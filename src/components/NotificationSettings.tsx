
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { supabase } from '../integrations/supabase/client';
import { Bell, Settings, Smartphone, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationPreference {
  id: string;
  userId: string;
  goalReminders: boolean;
  dailyCheckinReminders: boolean;
  focusSessionReminders: boolean;
  streakNotifications: boolean;
  milestoneNotifications: boolean;
  reminderTime: string;
  createdAt: string;
  updatedAt: string;
}

const NotificationSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    checkPushSupport();
    fetchNotificationPreferences();
  }, []);

  const checkPushSupport = () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setPushSupported(true);
      setPushPermission(Notification.permission);
    }
  };

  const fetchNotificationPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences' as any)
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching notification preferences:', error);
      } else if (data) {
        setPreferences({
          id: data.id,
          userId: data.user_id,
          goalReminders: data.goal_reminders,
          dailyCheckinReminders: data.daily_checkin_reminders,
          focusSessionReminders: data.focus_session_reminders,
          streakNotifications: data.streak_notifications,
          milestoneNotifications: data.milestone_notifications,
          reminderTime: data.reminder_time,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      }
    } catch (error) {
      console.error('Error in fetchNotificationPreferences:', error);
    }
  };

  const requestPushPermission = async () => {
    if (!pushSupported) {
      toast.error('Push notifications are not supported in this browser');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      
      if (permission === 'granted') {
        toast.success('Push notifications enabled!');
        // Here you would typically register the service worker and get the push subscription
      } else {
        toast.error('Push notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting push permission:', error);
      toast.error('Failed to request push permission');
    }
  };

  const updatePreferences = async (updates: Partial<NotificationPreference>) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const updatedPrefs = {
        user_id: user.id,
        goal_reminders: updates.goalReminders ?? preferences?.goalReminders ?? true,
        daily_checkin_reminders: updates.dailyCheckinReminders ?? preferences?.dailyCheckinReminders ?? true,
        focus_session_reminders: updates.focusSessionReminders ?? preferences?.focusSessionReminders ?? true,
        streak_notifications: updates.streakNotifications ?? preferences?.streakNotifications ?? true,
        milestone_notifications: updates.milestoneNotifications ?? preferences?.milestoneNotifications ?? true,
        reminder_time: updates.reminderTime ?? preferences?.reminderTime ?? '09:00',
        updated_at: new Date().toISOString(),
      };

      if (preferences) {
        const { error } = await supabase
          .from('notification_preferences' as any)
          .update(updatedPrefs)
          .eq('id', preferences.id);

        if (error) {
          console.error('Error updating preferences:', error);
          toast.error('Failed to update preferences');
        } else {
          toast.success('Notification preferences updated!');
          fetchNotificationPreferences();
        }
      } else {
        const { error } = await supabase
          .from('notification_preferences' as any)
          .insert([updatedPrefs]);

        if (error) {
          console.error('Error creating preferences:', error);
          toast.error('Failed to save preferences');
        } else {
          toast.success('Notification preferences saved!');
          fetchNotificationPreferences();
        }
      }
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      toast.error('Failed to update preferences');
    }
    setLoading(false);
  };

  const testNotification = () => {
    if (pushPermission === 'granted') {
      new Notification('Visio Test Notification', {
        body: 'Your notifications are working perfectly!',
        icon: '/visio.png',
        badge: '/visio.png'
      });
    } else {
      toast.error('Please enable push notifications first');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Push Notifications */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Smartphone className="mr-2 text-blue-500" size={24} />
          Push Notifications
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">Browser Notifications</h4>
              <p className="text-sm text-gray-500">
                Status: {pushPermission === 'granted' ? 'Enabled' : pushPermission === 'denied' ? 'Blocked' : 'Not requested'}
              </p>
            </div>
            <div className="space-x-2">
              {pushPermission !== 'granted' && (
                <Button
                  onClick={requestPushPermission}
                  disabled={!pushSupported}
                  size="sm"
                >
                  Enable
                </Button>
              )}
              {pushPermission === 'granted' && (
                <Button onClick={testNotification} size="sm" variant="outline">
                  Test
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Bell className="mr-2 text-orange-500" size={24} />
          Notification Types
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Goal Reminders</h4>
              <p className="text-sm text-gray-500">Daily reminders about your goals</p>
            </div>
            <Switch
              checked={preferences?.goalReminders ?? true}
              onCheckedChange={(checked) => updatePreferences({ goalReminders: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Daily Check-in Reminders</h4>
              <p className="text-sm text-gray-500">Reminders to log your daily mood and reflection</p>
            </div>
            <Switch
              checked={preferences?.dailyCheckinReminders ?? true}
              onCheckedChange={(checked) => updatePreferences({ dailyCheckinReminders: checked })}
            />
          </div>

          {preferences?.goalReminders && (
            <div className="ml-4 flex items-center space-x-2">
              <Clock size={16} className="text-gray-400" />
              <Input
                type="time"
                value={preferences?.reminderTime ?? '09:00'}
                onChange={(e) => updatePreferences({ reminderTime: e.target.value })}
                className="w-32"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Focus Session Reminders</h4>
              <p className="text-sm text-gray-500">Reminders to take breaks and start focus sessions</p>
            </div>
            <Switch
              checked={preferences?.focusSessionReminders ?? true}
              onCheckedChange={(checked) => updatePreferences({ focusSessionReminders: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Streak Notifications</h4>
              <p className="text-sm text-gray-500">Celebrate your goal streaks</p>
            </div>
            <Switch
              checked={preferences?.streakNotifications ?? true}
              onCheckedChange={(checked) => updatePreferences({ streakNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Milestone Notifications</h4>
              <p className="text-sm text-gray-500">Get notified when you reach milestones</p>
            </div>
            <Switch
              checked={preferences?.milestoneNotifications ?? true}
              onCheckedChange={(checked) => updatePreferences({ milestoneNotifications: checked })}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotificationSettings;
