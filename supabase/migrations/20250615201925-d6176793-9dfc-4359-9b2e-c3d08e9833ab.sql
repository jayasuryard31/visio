
-- Create table for journal entries
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for schedule events
CREATE TABLE public.schedule_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  category TEXT NOT NULL DEFAULT 'personal' CHECK (category IN ('work', 'personal', 'health', 'social', 'other')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for focus sessions
CREATE TABLE public.focus_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  goal_id UUID REFERENCES public.goals(id),
  duration INTEGER NOT NULL,
  completed_duration INTEGER DEFAULT 0,
  session_type TEXT NOT NULL DEFAULT 'work' CHECK (session_type IN ('work', 'break', 'longbreak')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for notification preferences
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  goal_reminders BOOLEAN DEFAULT true,
  daily_checkin_reminders BOOLEAN DEFAULT true,
  focus_session_reminders BOOLEAN DEFAULT true,
  streak_notifications BOOLEAN DEFAULT true,
  milestone_notifications BOOLEAN DEFAULT true,
  reminder_time TIME DEFAULT '09:00:00',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Add Row Level Security (RLS) to new tables
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for journal_entries
CREATE POLICY "Users can view their own journal entries" 
  ON public.journal_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries" 
  ON public.journal_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" 
  ON public.journal_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" 
  ON public.journal_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for schedule_events
CREATE POLICY "Users can view their own schedule events" 
  ON public.schedule_events 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedule events" 
  ON public.schedule_events 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedule events" 
  ON public.schedule_events 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedule events" 
  ON public.schedule_events 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for focus_sessions
CREATE POLICY "Users can view their own focus sessions" 
  ON public.focus_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own focus sessions" 
  ON public.focus_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own focus sessions" 
  ON public.focus_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own focus sessions" 
  ON public.focus_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for notification_preferences
CREATE POLICY "Users can view their own notification preferences" 
  ON public.notification_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notification preferences" 
  ON public.notification_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences" 
  ON public.notification_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notification preferences" 
  ON public.notification_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);
