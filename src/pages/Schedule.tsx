
import React from 'react';
import MobileLayout from '../components/MobileLayout';
import Schedule from '../components/Schedule';

const SchedulePage: React.FC = () => {
  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Schedule</h1>
          <p className="text-gray-600">Plan your time and activities</p>
        </div>
        <Schedule />
      </div>
    </MobileLayout>
  );
};

export default SchedulePage;
