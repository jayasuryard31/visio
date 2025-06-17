
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Customize your Visio experience</p>
        </div>

        {/* Theme Settings */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            {theme === 'dark' ? <Moon className="mr-2 text-blue-500" size={24} /> : <Sun className="mr-2 text-orange-500" size={24} />}
            Appearance
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white">Dark Mode</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
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
