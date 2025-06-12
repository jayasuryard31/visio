
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
}

// Use Supabase User type instead of custom one
export type { User } from '@supabase/supabase-js';
