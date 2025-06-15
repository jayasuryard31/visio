
import React from 'react';
import MobileLayout from '../components/MobileLayout';
import FocusMode from '../components/FocusMode';

const FocusModePage: React.FC = () => {
  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Focus Mode</h1>
          <p className="text-gray-600">Enhanced productivity with Pomodoro technique</p>
        </div>
        <FocusMode />
      </div>
    </MobileLayout>
  );
};

export default FocusModePage;
