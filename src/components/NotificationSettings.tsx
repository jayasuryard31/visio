
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '../integrations/supabase/client';
import { Bell, Settings, Smartphone, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationPreference {
  id: string;
  userId: string;
  dailyReminder: boolean;
  dailyReminderTime: string;
  goalDeadlines: boolean;
  weeklyProgress: boolean;
  motivationalQuotes: boolean;
  focusSessionReminders: boolean;
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
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
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching notification preferences:', error);
    } else if (data) {
      setPreferences({
        id: data.id,
        userId: data.user_id,
        dailyReminder: data.daily_reminder,
        dailyReminderTime: data.daily_reminder_time,
        goalDeadlines: data.goal_deadlines,
        weeklyProgress: data.weekly_progress,
        motivationalQuotes: data.motivational_quotes,
        focusSessionReminders: data.focus_session_reminders,
        pushNotificationsEnabled: data.push_notifications_enabled,
        emailNotificationsEnabled: data.email_notifications_enabled,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      });
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
        await updatePreferences({ pushNotificationsEnabled: true });
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const updatedPrefs = {
      user_id: user.id,
      daily_reminder: updates.dailyReminder ?? preferences?.dailyReminder ?? true,
      daily_reminder_time: updates.dailyReminderTime ?? preferences?.dailyReminderTime ?? '09:00',
      goal_deadlines: updates.goalDeadlines ?? preferences?.goalDeadlines ?? true,
      weekly_progress: updates.weeklyProgress ?? preferences?.weeklyProgress ?? true,
      motivational_quotes: updates.motivationalQuotes ?? preferences?.motivationalQuotes ?? true,
      focus_session_reminders: updates.focusSessionReminders ?? preferences?.focusSessionReminders ?? true,
      push_notifications_enabled: updates.pushNotificationsEnabled ?? preferences?.pushNotificationsEnabled ?? false,
      email_notifications_enabled: updates.emailNotificationsEnabled ?? preferences?.emailNotificationsEnabled ?? true,
      updated_at: new Date().toISOString(),
    };

    if (preferences) {
      const { error } = await supabase
        .from('notification_preferences')
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
        .from('notification_preferences')
        .insert([updatedPrefs]);

      if (error) {
        console.error('Error creating preferences:', error);
        toast.error('Failed to save preferences');
      } else {
        toast.success('Notification preferences saved!');
        fetchNotificationPreferences();
      }
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

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-gray-500">Receive notifications on this device</p>
            </div>
            <Switch
              checked={preferences?.pushNotificationsEnabled ?? false}
              onCheckedChange={(checked) => updatePreferences({ pushNotificationsEnabled: checked })}
              disabled={pushPermission !== 'granted'}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              checked={preferences?.emailNotificationsEnabled ?? true}
              onCheckedChange={(checked) => updatePreferences({ emailNotificationsEnabled: checked })}
            />
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
              <h4 className="font-medium">Daily Reminders</h4>
              <p className="text-sm text-gray-500">Daily motivation and goal check-ins</p>
            </div>
            <Switch
              checked={preferences?.dailyReminder ?? true}
              onCheckedChange={(checked) => updatePreferences({ dailyReminder: checked })}
            />
          </div>

          {preferences?.dailyReminder && (
            <div className="ml-4 flex items-center space-x-2">
              <Clock size={16} className="text-gray-400" />
              <Input
                type="time"
                value={preferences?.dailyReminderTime ?? '09:00'}
                onChange={(e) => updatePreferences({ dailyReminderTime: e.target.value })}
                className="w-32"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Goal Deadlines</h4>
              <p className="text-sm text-gray-500">Reminders for approaching deadlines</p>
            </div>
            <Switch
              checked={preferences?.goalDeadlines ?? true}
              onCheckedChange={(checked) => updatePreferences({ goalDeadlines: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Weekly Progress</h4>
              <p className="text-sm text-gray-500">Weekly summary of your achievements</p>
            </div>
            <Switch
              checked={preferences?.weeklyProgress ?? true}
              onCheckedChange={(checked) => updatePreferences({ weeklyProgress: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Motivational Quotes</h4>
              <p className="text-sm text-gray-500">Daily inspirational messages</p>
            </div>
            <Switch
              checked={preferences?.motivationalQuotes ?? true}
              onCheckedChange={(checked) => updatePreferences({ motivationalQuotes: checked })}
            />
          </div>

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
        </div>
      </Card>
    </div>
  );
};

export default NotificationSettings;
