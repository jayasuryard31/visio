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
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    checkPushSupport();
    fetchNotificationPreferences();
    checkExistingSubscription();
  }, []);

  const checkPushSupport = () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setPushSupported(true);
      setPushPermission(Notification.permission);
    }
  };

  const checkExistingSubscription = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setPushSubscription(subscription);
      } catch (error) {
        console.error('Error checking existing subscription:', error);
      }
    }
  };

  const fetchNotificationPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching notification preferences:', error);
      } else if (data) {
        const prefData = data as any;
        setPreferences({
          id: prefData.id,
          userId: prefData.user_id,
          goalReminders: prefData.goal_reminders,
          dailyCheckinReminders: prefData.daily_checkin_reminders,
          focusSessionReminders: prefData.focus_session_reminders,
          streakNotifications: prefData.streak_notifications,
          milestoneNotifications: prefData.milestone_notifications,
          reminderTime: prefData.reminder_time,
          createdAt: prefData.created_at,
          updatedAt: prefData.updated_at,
        });
      }
    } catch (error) {
      console.error('Error in fetchNotificationPreferences:', error);
    }
  };

  const enablePushNotifications = async () => {
    if (!pushSupported) {
      toast.error('Push notifications are not supported in this browser');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        
        const vapidPublicKey = 'BECFStW9K4LgJwAPLBZOHPJ1z0fRzCLyRWMp9r9JkklMLWhQfGGvE8RbLAaTsJjX6zXZWsYNbabN7FU-PQ5A2vE';
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey
        });

        setPushSubscription(subscription);
        
        await savePushSubscription(subscription);
        
        toast.success('Push notifications enabled!');
      } else {
        toast.error('Push notification permission denied');
      }
    } catch (error) {
      console.error('Error enabling push notifications:', error);
      toast.error('Failed to enable push notifications');
    }
  };

  const disablePushNotifications = async () => {
    try {
      if (pushSubscription) {
        await pushSubscription.unsubscribe();
        setPushSubscription(null);
        
        await removePushSubscription();
        
        toast.success('Push notifications disabled');
      }
    } catch (error) {
      console.error('Error disabling push notifications:', error);
      toast.error('Failed to disable push notifications');
    }
  };

  const savePushSubscription = async (subscription: PushSubscription) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('push_subscriptions')
        .insert([{
          user_id: user.id,
          subscription: JSON.stringify(subscription),
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error saving push subscription:', error);
      }
    } catch (error) {
      console.error('Error in savePushSubscription:', error);
    }
  };

  const removePushSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing push subscription:', error);
      }
    } catch (error) {
      console.error('Error in removePushSubscription:', error);
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
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      toast.error('Failed to update preferences');
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Push Notifications */}
      <Card className="p-6 glossy-card">
        <h3 className="text-xl font-bold text-visio-primary dark:text-visio-primary mb-4 flex items-center">
          <Smartphone className="mr-2 text-visio-primary" size={24} />
          Push Notifications
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-visio-surface-variant dark:bg-visio-surface-variant rounded-lg">
            <div>
              <h4 className="font-medium text-visio-primary dark:text-visio-primary">Browser Notifications</h4>
              <p className="text-sm text-visio-secondary dark:text-visio-secondary">
                Status: {pushSubscription ? 'Enabled' : pushPermission === 'denied' ? 'Blocked' : 'Disabled'}
              </p>
            </div>
            <div className="space-x-2">
              {!pushSubscription && pushPermission !== 'denied' && (
                <Button
                  onClick={enablePushNotifications}
                  disabled={!pushSupported}
                  size="sm"
                  className="glossy-button"
                >
                  Enable
                </Button>
              )}
              {pushSubscription && (
                <Button 
                  onClick={disablePushNotifications} 
                  size="sm" 
                  variant="outline"
                  className="border-visio-primary text-visio-primary dark:border-visio-primary dark:text-visio-primary"
                >
                  Disable
                </Button>
              )}
              {pushPermission === 'denied' && (
                <p className="text-sm text-red-500">
                  Please enable notifications in browser settings
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6 glossy-card">
        <h3 className="text-xl font-bold text-visio-primary dark:text-visio-primary mb-4 flex items-center">
          <Bell className="mr-2 text-visio-primary" size={24} />
          Notification Types
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-visio-primary dark:text-visio-primary">Goal Reminders</h4>
              <p className="text-sm text-visio-secondary dark:text-visio-secondary">Daily reminders about your goals</p>
            </div>
            <Switch
              checked={preferences?.goalReminders ?? true}
              onCheckedChange={(checked) => updatePreferences({ goalReminders: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-visio-primary dark:text-visio-primary">Daily Check-in Reminders</h4>
              <p className="text-sm text-visio-secondary dark:text-visio-secondary">Reminders to log your daily mood and reflection</p>
            </div>
            <Switch
              checked={preferences?.dailyCheckinReminders ?? true}
              onCheckedChange={(checked) => updatePreferences({ dailyCheckinReminders: checked })}
            />
          </div>

          {preferences?.goalReminders && (
            <div className="ml-4 flex items-center space-x-2">
              <Clock size={16} className="text-visio-secondary dark:text-visio-secondary" />
              <Input
                type="time"
                value={preferences?.reminderTime ?? '09:00'}
                onChange={(e) => updatePreferences({ reminderTime: e.target.value })}
                className="w-32 glossy-card"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-visio-primary dark:text-visio-primary">Focus Session Reminders</h4>
              <p className="text-sm text-visio-secondary dark:text-visio-secondary">Reminders to take breaks and start focus sessions</p>
            </div>
            <Switch
              checked={preferences?.focusSessionReminders ?? true}
              onCheckedChange={(checked) => updatePreferences({ focusSessionReminders: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-visio-primary dark:text-visio-primary">Streak Notifications</h4>
              <p className="text-sm text-visio-secondary dark:text-visio-secondary">Celebrate your goal streaks</p>
            </div>
            <Switch
              checked={preferences?.streakNotifications ?? true}
              onCheckedChange={(checked) => updatePreferences({ streakNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-visio-primary dark:text-visio-primary">Milestone Notifications</h4>
              <p className="text-sm text-visio-secondary dark:text-visio-secondary">Get notified when you reach milestones</p>
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
