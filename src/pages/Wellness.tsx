
import React from 'react';
import MobileLayout from '../components/MobileLayout';
import MoodTracker from '../components/MoodTracker';
import StreakTracker from '../components/StreakTracker';

const Wellness: React.FC = () => {
  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-visio-primary dark:text-visio-primary mb-2">Wellness</h1>
          <p className="text-visio-secondary dark:text-visio-secondary">Monitor your mental and emotional health</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MoodTracker />
          <StreakTracker />
        </div>
      </div>
    </MobileLayout>
  );
};

export default Wellness;
