
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
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
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
        console.error('Error checking push subscription:', error);
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
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      
      if (permission !== 'granted') {
        toast.error('Push notification permission denied');
        return;
      }

      // Register service worker and get push subscription
      const registration = await navigator.serviceWorker.ready;
      
      const vapidPublicKey = 'BMqS9a8JyU5SWdvl-YfXE-jPY8VdJxKPg-7X8BdE8j4mzCwjRJKvJYh9sWqyN2x3JzK8vQ5nF6BdHg7R2dY5XwA'; // Replace with your VAPID public key
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      setPushSubscription(subscription);

      // Save subscription to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('push_subscriptions')
          .upsert({
            user_id: user.id,
            endpoint: subscription.endpoint,
            p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
            auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
          });

        if (error) {
          console.error('Error saving push subscription:', error);
        }
      }

      toast.success('Push notifications enabled successfully!');
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
        
        // Remove subscription from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', user.id);

          if (error) {
            console.error('Error removing push subscription:', error);
          }
        }
      }
      
      toast.success('Push notifications disabled');
    } catch (error) {
      console.error('Error disabling push notifications:', error);
      toast.error('Failed to disable push notifications');
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
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
                Status: {pushSubscription ? 'Enabled' : pushPermission === 'denied' ? 'Blocked' : 'Disabled'}
              </p>
            </div>
            <div className="space-x-2">
              {!pushSubscription ? (
                <Button
                  onClick={enablePushNotifications}
                  disabled={!pushSupported || pushPermission === 'denied'}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                >
                  Enable
                </Button>
              ) : (
                <Button
                  onClick={disablePushNotifications}
                  size="sm"
                  variant="destructive"
                >
                  Disable
                </Button>
              )}
            </div>
          </div>

          {pushPermission === 'denied' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                Notifications are blocked. Please enable them in your browser settings to receive push notifications.
              </p>
            </div>
          )}
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
              disabled={loading}
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
              disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotificationSettings;
