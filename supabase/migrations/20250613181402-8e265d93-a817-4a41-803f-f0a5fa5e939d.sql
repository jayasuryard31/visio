
-- Add new columns to the goals table for enhanced features
ALTER TABLE public.goals 
ADD COLUMN priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
ADD COLUMN category TEXT DEFAULT 'personal',
ADD COLUMN progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
ADD COLUMN reminder_enabled BOOLEAN DEFAULT false,
ADD COLUMN reminder_time TIME DEFAULT '09:00:00',
ADD COLUMN tags TEXT[] DEFAULT '{}',
ADD COLUMN streak_count INTEGER DEFAULT 0,
ADD COLUMN last_activity_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN estimated_completion_date DATE,
ADD COLUMN color_theme TEXT DEFAULT 'orange' CHECK (color_theme IN ('orange', 'blue', 'green', 'purple', 'red', 'pink', 'yellow'));

-- Create a table for daily check-ins and mood tracking
CREATE TABLE public.daily_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  gratitude_note TEXT,
  daily_reflection TEXT,
  goals_worked_on UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, check_in_date)
);

-- Create a table for goal milestones
CREATE TABLE public.goal_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for motivation quotes favorites
CREATE TABLE public.favorite_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  quote_content TEXT NOT NULL,
  quote_author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to new tables
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_quotes ENABLE ROW LEVEL SECURITY;

-- RLS policies for daily_checkins
CREATE POLICY "Users can view their own check-ins" 
  ON public.daily_checkins 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins" 
  ON public.daily_checkins 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins" 
  ON public.daily_checkins 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own check-ins" 
  ON public.daily_checkins 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for goal_milestones
CREATE POLICY "Users can view their own milestones" 
  ON public.goal_milestones 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own milestones" 
  ON public.goal_milestones 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones" 
  ON public.goal_milestones 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones" 
  ON public.goal_milestones 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for favorite_quotes
CREATE POLICY "Users can view their own favorite quotes" 
  ON public.favorite_quotes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorite quotes" 
  ON public.favorite_quotes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite quotes" 
  ON public.favorite_quotes 
  FOR DELETE 
  USING (auth.uid() = user_id);
