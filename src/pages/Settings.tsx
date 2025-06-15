
import React from 'react';
import MobileLayout from '../components/MobileLayout';
import NotificationSettings from '../components/NotificationSettings';

const Settings: React.FC = () => {
  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your Visio experience</p>
        </div>
        <NotificationSettings />
      </div>
    </MobileLayout>
  );
};

export default Settings;
