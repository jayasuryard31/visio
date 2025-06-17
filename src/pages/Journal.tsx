
import React from 'react';
import MobileLayout from '../components/MobileLayout';
import Journal from '../components/Journal';

const JournalPage: React.FC = () => {
  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-visio-primary dark:text-visio-primary mb-2">Journal</h1>
          <p className="text-visio-secondary dark:text-visio-secondary">Reflect on your journey and thoughts</p>
        </div>
        <Journal />
      </div>
    </MobileLayout>
  );
};

export default JournalPage;
