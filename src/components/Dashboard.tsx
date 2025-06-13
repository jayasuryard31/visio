import React, { useState, useEffect } from 'react';
import { Goal } from '../types';
import { User } from '@supabase/supabase-js';
import { Plus, Target, Calendar, Lightbulb, Sparkles, LogOut, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import GoalCard from './GoalCard';
import AddGoalModal from './AddGoalModal';
import EditGoalModal from './EditGoalModal';
import DailyReminder from './DailyReminder';
import MoodTracker from './MoodTracker';
import ProgressAnalytics from './ProgressAnalytics';
import QuickActions from './QuickActions';
import StreakTracker from './StreakTracker';

const Dashboard: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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
      // Map database fields to our Goal interface
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
        priority: goal.priority || 'medium',
        category: goal.category || 'personal',
        progressPercentage: goal.progress_percentage || 0,
        reminderEnabled: goal.reminder_enabled || false,
        reminderTime: goal.reminder_time || undefined,
        tags: goal.tags || [],
        streakCount: goal.streak_count || 0,
        lastActivityDate: goal.last_activity_date || undefined,
        estimatedCompletionDate: goal.estimated_completion_date || undefined,
        colorTheme: goal.color_theme || 'orange',
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)'
      }}>
        <Typography variant="h4" sx={{ color: 'white' }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fff5f0 0%, #ffe0cc 50%, #ffd7b3 100%)' 
    }}>
      {/* Header */}
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 107, 53, 0.2)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Sparkles size={32} style={{ color: '#ff6b35', marginRight: 12 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff6b35' }}>
              Visio
            </Typography>
          </Box>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="mr-4"
            style={{
              background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
              color: 'white',
              border: 'none'
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
          <IconButton onClick={handleSignOut} sx={{ color: '#ff6b35' }}>
            <LogOut />
          </IconButton>
        </Toolbar>
      </AppBar>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Daily Reminder */}
            <DailyReminder />

            {/* Quick Actions */}
            <QuickActions
              onAddGoal={() => setIsAddModalOpen(true)}
              onShowAnalytics={() => setActiveTab('analytics')}
              onShowMoodTracker={() => setActiveTab('wellness')}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 border-0 shadow-xl" style={{ 
                background: 'linear-gradient(135deg, #ff6b35, #e55a2b)',
                color: 'white'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Active Goals</p>
                    <p className="text-3xl font-bold">{goals.filter(g => !g.isCompleted).length}</p>
                  </div>
                  <Target className="w-8 h-8 text-orange-200" />
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-xl" style={{ 
                background: 'linear-gradient(135deg, #f7931e, #e8841a)',
                color: 'white'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold">{goals.filter(g => g.isCompleted).length}</p>
                  </div>
                  <Lightbulb className="w-8 h-8 text-yellow-200" />
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-xl" style={{ 
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                color: 'white'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Total Days</p>
                    <p className="text-3xl font-bold">
                      {goals.reduce((sum, goal) => sum + (goal.targetDays || 0), 0)}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-red-200" />
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-xl" style={{ 
                background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
                color: 'white'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Avg Progress</p>
                    <p className="text-3xl font-bold">
                      {goals.length > 0 ? Math.round(goals.reduce((sum, goal) => sum + (goal.progressPercentage || 0), 0) / goals.length) : 0}%
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-200" />
                </div>
              </Card>
            </div>

            {/* Streak Tracker */}
            <StreakTracker />

            {/* Recent Goals Preview */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.slice(0, 6).map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onUpdate={handleUpdateGoal}
                    onDelete={handleDeleteGoal}
                    onEdit={handleEditGoal}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-8">
            {/* Goals Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Manifestations</h2>
              
              {goals.length === 0 ? (
                <Card className="p-12 text-center bg-white/70 backdrop-blur-sm border-dashed border-2 border-orange-300">
                  <Sparkles className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Start Your Journey
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Create your first goal and begin manifesting your dreams into reality.
                  </p>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    style={{
                      background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Goal
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.map((goal) => (
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
          </TabsContent>

          <TabsContent value="analytics">
            <ProgressAnalytics />
          </TabsContent>

          <TabsContent value="wellness">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MoodTracker />
              <StreakTracker />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddGoal}
      />

      {/* Edit Goal Modal */}
      <EditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGoal(null);
        }}
        onUpdate={handleUpdateGoal}
        goal={editingGoal}
      />
    </Box>
  );
};

export default Dashboard;
