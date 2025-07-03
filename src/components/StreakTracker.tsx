
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '../integrations/supabase/client';
import { Goal } from '../types';
import { Flame, Calendar, Trophy } from 'lucide-react';

const StreakTracker: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('is_completed', false)
      .order('streak_count', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching goals:', error);
    } else if (data) {
      const mappedGoals: Goal[] = data.map(goal => ({
        id: goal.id,
        title: goal.title,
        description: goal.description || '',
        targetDays: goal.target_days,
        targetOutcome: goal.target_outcome || '',
        createdAt: goal.created_at,
        userId: goal.user_id,
        streakCount: goal.streak_count || 0,
        isCompleted: goal.is_completed || false,
      }));
      setGoals(mappedGoals);
    }
    setLoading(false);
  };

  const totalStreak = goals.reduce((sum, goal) => sum + (goal.streakCount || 0), 0);
  const longestStreak = Math.max(...goals.map(goal => goal.streakCount || 0), 0);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">Loading streaks...</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 glossy-card">
      <h3 className="text-xl font-bold text-visio-primary mb-4 flex items-center">
        <Flame className="mr-2 text-visio-primary" size={24} />
        Streak Tracker
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-visio-surface-variant rounded-xl">
          <div className="text-2xl font-bold text-visio-primary">{totalStreak}</div>
          <div className="text-sm text-visio-secondary">Total Days</div>
        </div>
        <div className="text-center p-4 bg-visio-surface-variant rounded-xl">
          <div className="text-2xl font-bold text-visio-primary">{longestStreak}</div>
          <div className="text-sm text-visio-secondary">Best Streak</div>
        </div>
      </div>

      <div className="space-y-3">
        {goals.slice(0, 3).map((goal) => (
          <div key={goal.id} className="flex items-center justify-between p-3 bg-visio-surface-variant rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-visio-primary truncate">{goal.title}</h4>
              <div className="flex items-center text-sm text-visio-secondary mt-1">
                <Calendar size={14} className="mr-1" />
                <span>{goal.streakCount || 0} days</span>
              </div>
            </div>
            <div className="flex items-center text-visio-primary">
              <Flame size={20} />
              <span className="font-bold ml-1">{goal.streakCount || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-8 text-visio-secondary">
          <Trophy size={48} className="mx-auto mb-3 opacity-50" />
          <p>Start working on your goals to build streaks!</p>
        </div>
      )}
    </Card>
  );
};

export default StreakTracker;
