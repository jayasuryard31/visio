import React, { useState, useEffect } from 'react';
import { Goal } from '../types';
import { User } from '@supabase/supabase-js';
import { Plus, Target, Calendar, Lightbulb, Sparkles, BarChart3, Heart, BookOpen, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import GoalCard from './GoalCard';
import AddGoalModal from './AddGoalModal';
import EditGoalModal from './EditGoalModal';
import DailyReminder from './DailyReminder';
import MobileLayout from './MobileLayout';

const Dashboard: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      await fetchGoals();
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        fetchGoals();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
    } else {
      // Map database fields to our Goal interface with proper type casting
      const mappedGoals: Goal[] = (data || []).map(goal => ({
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
        reminderEnabled: goal.reminder_enabled || false,
        reminderTime: goal.reminder_time || undefined,
        tags: goal.tags || [],
        streakCount: goal.streak_count || 0,
        lastActivityDate: goal.last_activity_date || undefined,
        estimatedCompletionDate: goal.estimated_completion_date || undefined,
        colorTheme: (goal.color_theme as 'orange' | 'blue' | 'green' | 'purple' | 'red' | 'pink' | 'yellow') || 'orange',
      }));
      setGoals(mappedGoals);
    }
  };

  const handleAddGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'userId'>) => {
    const { data, error } = await supabase
      .from('goals')
      .insert([{
        title: goalData.title,
        description: goalData.description,
        user_id: user?.id,
        target_days: goalData.targetDays,
        target_outcome: goalData.targetOutcome,
        notes: goalData.notes,
        is_completed: goalData.isCompleted || false,
        priority: goalData.priority || 'medium',
        category: goalData.category || 'personal',
        progress_percentage: goalData.progressPercentage || 0,
        reminder_enabled: goalData.reminderEnabled || false,
        reminder_time: goalData.reminderTime || '09:00:00',
        tags: goalData.tags || [],
        streak_count: goalData.streakCount || 0,
        color_theme: goalData.colorTheme || 'orange',
      }])
      .select();

    if (error) {
      console.error('Error adding goal:', error);
    } else {
      await fetchGoals();
      setIsAddModalOpen(false);
    }
  };

  const handleUpdateGoal = async (goalId: string, updates: Partial<Goal>) => {
    const { error } = await supabase
      .from('goals')
      .update({
        title: updates.title,
        description: updates.description,
        target_days: updates.targetDays,
        target_outcome: updates.targetOutcome,
        notes: updates.notes,
        is_completed: updates.isCompleted,
        priority: updates.priority,
        category: updates.category,
        progress_percentage: updates.progressPercentage,
        reminder_enabled: updates.reminderEnabled,
        reminder_time: updates.reminderTime,
        tags: updates.tags,
        streak_count: updates.streakCount,
        color_theme: updates.colorTheme,
        updated_at: new Date().toISOString(),
      })
      .eq('id', goalId);

    if (error) {
      console.error('Error updating goal:', error);
    } else {
      await fetchGoals();
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('Error deleting goal:', error);
    } else {
      await fetchGoals();
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsEditModalOpen(true);
  };

  const quickActions = [
    {
      icon: Target,
      label: 'Goals',
      color: 'from-orange-400 to-red-400',
      path: '/goals'
    },
    {
      icon: Heart,
      label: 'Wellness',
      color: 'from-pink-400 to-purple-400',
      path: '/wellness'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      color: 'from-blue-400 to-indigo-400',
      path: '/analytics'
    },
    {
      icon: BookOpen,
      label: 'Journal',
      color: 'from-green-400 to-teal-400',
      path: '/journal'
    },
    {
      icon: Calendar,
      label: 'Schedule',
      color: 'from-yellow-400 to-orange-400',
      path: '/schedule'
    },
    {
      icon: Focus,
      label: 'Focus Mode',
      color: 'from-purple-400 to-pink-400',
      path: '/focus'
    }
  ];

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your journey...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showAddGoal onAddGoal={() => setIsAddModalOpen(true)}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Visio</h1>
          <p className="text-gray-600">Manifest your dreams into reality</p>
        </div>

        {/* Daily Reminder */}
        <DailyReminder />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-orange-400 to-red-400 text-white border-0 shadow-xl">
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <div className="text-2xl font-bold">{goals.filter(g => !g.isCompleted).length}</div>
              <div className="text-xs opacity-80">Active Goals</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-400 to-emerald-400 text-white border-0 shadow-xl">
            <div className="text-center">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <div className="text-2xl font-bold">{goals.filter(g => g.isCompleted).length}</div>
              <div className="text-xs opacity-80">Completed</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-400 to-indigo-400 text-white border-0 shadow-xl">
            <div className="text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <div className="text-2xl font-bold">
                {goals.reduce((sum, goal) => sum + (goal.targetDays || 0), 0)}
              </div>
              <div className="text-xs opacity-80">Total Days</div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-400 to-pink-400 text-white border-0 shadow-xl">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <div className="text-2xl font-bold">
                {goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + (goal.progressPercentage || 0), 0) / goals.length) : 0}%
              </div>
              <div className="text-xs opacity-80">Avg Progress</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex flex-col items-center space-y-2`}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Recent Goals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Goals</h2>
            <Button
              onClick={() => navigate('/goals')}
              variant="outline"
              size="sm"
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              View All
            </Button>
          </div>
          
          {goals.length === 0 ? (
            <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-dashed border-2 border-orange-300">
              <Sparkles className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Start Your Journey
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first goal and begin manifesting your dreams into reality.
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-orange-400 to-red-400 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.slice(0, 4).map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdate={handleUpdateGoal}
                  onDelete={handleDeleteGoal}
                  onEdit={handleEditGoal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddGoal}
      />

      <EditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGoal(null);
        }}
        onUpdate={handleUpdateGoal}
        goal={editingGoal}
      />
    </MobileLayout>
  );
};

export default Dashboard;
