
import React from 'react';
import MobileLayout from '../components/MobileLayout';
import ProgressAnalytics from '../components/ProgressAnalytics';

const Analytics: React.FC = () => {
  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your progress and insights</p>
        </div>
        <ProgressAnalytics />
      </div>
    </MobileLayout>
  );
};

export default Analytics;
