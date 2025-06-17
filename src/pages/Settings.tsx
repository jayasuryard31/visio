
import React from 'react';
import MobileLayout from '../components/MobileLayout';
import NotificationSettings from '../components/NotificationSettings';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-visio-primary dark:text-visio-primary mb-2">Settings</h1>
          <p className="text-visio-secondary dark:text-visio-secondary">Customize your Visio experience</p>
        </div>

        {/* Theme Settings */}
        <Card className="p-6 glossy-card">
          <h3 className="text-xl font-bold text-visio-primary dark:text-visio-primary mb-4 flex items-center">
            {theme === 'dark' ? <Moon className="mr-2 text-visio-primary" size={24} /> : <Sun className="mr-2 text-visio-primary" size={24} />}
            Appearance
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-visio-primary dark:text-visio-primary">Dark Mode</h4>
              <p className="text-sm text-visio-secondary dark:text-visio-secondary">Toggle between light and dark themes</p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </Card>

        <NotificationSettings />
      </div>
    </MobileLayout>
  );
};

export default Settings;
