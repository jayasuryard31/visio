
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

export interface User {
  id: string;
  email: string;
  name?: string;
}
