
export interface Quote {
  content: string;
  author: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  targetOutcome: string;
  createdAt: string;
  userId: string;
  notes?: string;
  isCompleted?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  progressPercentage?: number;
  reminderEnabled?: boolean;
  reminderTime?: string;
  tags?: string[];
  streakCount?: number;
  lastActivityDate?: string;
  estimatedCompletionDate?: string;
  colorTheme?: 'orange' | 'blue' | 'green' | 'purple' | 'red' | 'pink' | 'yellow';
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  checkInDate: string;
  moodRating?: number;
  energyLevel?: number;
  gratitudeNote?: string;
  dailyReflection?: string;
  goalsWorkedOn?: string[];
  createdAt: string;
}

export interface GoalMilestone {
  id: string;
  goalId: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: string;
  isCompleted?: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface FavoriteQuote {
  id: string;
  userId: string;
  quoteContent: string;
  quoteAuthor: string;
  createdAt: string;
}

// Use Supabase User type instead of custom one
export type { User } from '@supabase/supabase-js';
