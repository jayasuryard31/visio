
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '../integrations/supabase/client';
import { Goal, DailyCheckIn } from '../types';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ProgressAnalytics: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [goalsResponse, checkInsResponse] = await Promise.all([
      supabase.from('goals').select('*').order('created_at', { ascending: false }),
      supabase.from('daily_checkins').select('*').order('check_in_date', { ascending: false }).limit(30)
    ]);

    if (goalsResponse.data) {
      const mappedGoals: Goal[] = goalsResponse.data.map(goal => ({
        id: goal.id,
        title: goal.title,
        description: goal.description || '',
        targetDays: goal.target_days,
        targetOutcome: goal.target_outcome || '',
        createdAt: goal.created_at,
        userId: goal.user_id,
        notes: goal.notes || undefined,
        isCompleted: goal.is_completed || false,
        priority: (goal.priority as 'low' | 'medium' | 'high') || 'medium',
        category: goal.category || 'personal',
        progressPercentage: goal.progress_percentage || 0,
      }));
      setGoals(mappedGoals);
    }

    if (checkInsResponse.data) {
      const mappedCheckIns: DailyCheckIn[] = checkInsResponse.data.map(checkIn => ({
        id: checkIn.id,
        userId: checkIn.user_id,
        checkInDate: checkIn.check_in_date,
        moodRating: checkIn.mood_rating,
        energyLevel: checkIn.energy_level,
        gratitudeNote: checkIn.gratitude_note,
        dailyReflection: checkIn.daily_reflection,
        goalsWorkedOn: checkIn.goals_worked_on,
        createdAt: checkIn.created_at,
      }));
      setCheckIns(mappedCheckIns);
    }

    setLoading(false);
  };

  const moodData = checkIns
    .filter(checkIn => checkIn.moodRating)
    .slice(0, 7)
    .reverse()
    .map(checkIn => ({
      date: new Date(checkIn.checkInDate).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: checkIn.moodRating,
      energy: checkIn.energyLevel,
    }));

  const categoryData = goals.reduce((acc, goal) => {
    const category = goal.category || 'personal';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  const COLORS = ['#ff6b35', '#f7931e', '#e74c3c', '#3498db', '#9b59b6', '#2ecc71'];

  const avgMood = checkIns.reduce((sum, checkIn) => sum + (checkIn.moodRating || 0), 0) / (checkIns.filter(c => c.moodRating).length || 1);
  const avgEnergy = checkIns.reduce((sum, checkIn) => sum + (checkIn.energyLevel || 0), 0) / (checkIns.filter(c => c.energyLevel).length || 1);
  const totalProgress = goals.reduce((sum, goal) => sum + (goal.progressPercentage || 0), 0) / (goals.length || 1);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">Loading analytics...</div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Key Metrics */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-blue-500" size={24} />
          Key Metrics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{avgMood.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Mood</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{avgEnergy.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Energy</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{totalProgress.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Avg Progress</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{checkIns.length}</div>
            <div className="text-sm text-gray-600">Check-ins</div>
          </div>
        </div>
      </Card>

      {/* Mood & Energy Trend */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">7-Day Mood & Energy</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[1, 5]} />
            <Tooltip />
            <Line type="monotone" dataKey="mood" stroke="#ff6b35" strokeWidth={2} />
            <Line type="monotone" dataKey="energy" stroke="#f7931e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Goal Categories */}
      {pieData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Goals by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Achievement Summary */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Award className="mr-2 text-yellow-500" size={24} />
          Achievements
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
            <span className="text-sm font-medium">Goals Completed</span>
            <span className="text-lg font-bold text-yellow-600">
              {goals.filter(g => g.isCompleted).length}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium">Days Checked In</span>
            <span className="text-lg font-bold text-green-600">{checkIns.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium">Active Goals</span>
            <span className="text-lg font-bold text-blue-600">
              {goals.filter(g => !g.isCompleted).length}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressAnalytics;
