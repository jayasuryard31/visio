
import React from 'react';
import MobileLayout from '../components/MobileLayout';
import Schedule from '../components/Schedule';

const SchedulePage: React.FC = () => {
  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-visio-primary dark:text-visio-primary mb-2">Schedule</h1>
          <p className="text-visio-secondary dark:text-visio-secondary">Plan your time and activities</p>
        </div>
        <Schedule />
      </div>
    </MobileLayout>
  );
};

export default SchedulePage;
