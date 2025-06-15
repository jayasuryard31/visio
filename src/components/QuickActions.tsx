
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target, Calendar, BookOpen, Heart, TrendingUp } from 'lucide-react';

interface QuickActionsProps {
  onAddGoal: () => void;
  onShowAnalytics: () => void;
  onShowMoodTracker: () => void;
  onShowJournal: () => void;
  onShowSchedule: () => void;
  onShowFocusMode: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAddGoal,
  onShowAnalytics,
  onShowMoodTracker,
  onShowJournal,
  onShowSchedule,
  onShowFocusMode
}) => {
  const actions = [
    {
      icon: <Plus size={20} />,
      label: 'New Goal',
      color: 'from-orange-400 to-red-400',
      onClick: onAddGoal
    },
    {
      icon: <Heart size={20} />,
      label: 'Mood Check',
      color: 'from-pink-400 to-purple-400',
      onClick: onShowMoodTracker
    },
    {
      icon: <TrendingUp size={20} />,
      label: 'Analytics',
      color: 'from-blue-400 to-indigo-400',
      onClick: onShowAnalytics
    },
    {
      icon: <BookOpen size={20} />,
      label: 'Journal',
      color: 'from-green-400 to-teal-400',
      onClick: onShowJournal
    },
    {
      icon: <Calendar size={20} />,
      label: 'Schedule',
      color: 'from-yellow-400 to-orange-400',
      onClick: onShowSchedule
    },
    {
      icon: <Target size={20} />,
      label: 'Focus Mode',
      color: 'from-purple-400 to-pink-400',
      onClick: onShowFocusMode
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex flex-col items-center space-y-2`}
          >
            {action.icon}
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
