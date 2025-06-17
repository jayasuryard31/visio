
import React from 'react';
import MobileLayout from '../components/MobileLayout';
import FocusMode from '../components/FocusMode';

const FocusModePage: React.FC = () => {
  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-visio-primary dark:text-visio-primary mb-2">Focus Mode</h1>
          <p className="text-visio-secondary dark:text-visio-secondary">Enhanced productivity with Pomodoro technique</p>
        </div>
        <FocusMode />
      </div>
    </MobileLayout>
  );
};

export default FocusModePage;
