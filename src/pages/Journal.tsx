
import React from 'react';
import MobileLayout from '../components/MobileLayout';
import Journal from '../components/Journal';

const JournalPage: React.FC = () => {
  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Journal</h1>
          <p className="text-gray-600">Reflect on your journey and thoughts</p>
        </div>
        <Journal />
      </div>
    </MobileLayout>
  );
};

export default JournalPage;
