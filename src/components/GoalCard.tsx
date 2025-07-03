import React, { useState } from 'react';
import { Goal } from '../types';
import { Calendar, Target, MoreVertical, Edit, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface GoalCardProps {
  goal: Goal;
  onUpdate: (goalId: string, updates: Partial<Goal>) => void;
  onDelete: (goalId: string) => void;
  onEdit: (goal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdate, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  const daysElapsed = Math.floor(
    (new Date().getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = Math.max(0, goal.targetDays - daysElapsed);
  const progress = Math.min(100, (daysElapsed / goal.targetDays) * 100);

  const toggleCompleted = () => {
    onUpdate(goal.id, { isCompleted: !goal.isCompleted });
  };

  const getProgressColor = () => {
    if (goal.isCompleted) return 'bg-green-500';
    if (progress < 50) return 'bg-blue-500';
    if (progress < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = () => {
    if (goal.isCompleted) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
    }
    if (daysRemaining === 0) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Due Today</Badge>;
    }
    if (daysRemaining <= 3) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Almost Due</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
  };

  return (
    <Card 
      className={`p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer glossy-card ${
        goal.isCompleted ? 'opacity-75' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCompleted}
            className="mr-3 p-0 h-auto hover:bg-transparent"
          >
            {goal.isCompleted ? (
              <CheckCircle className="w-6 h-6 text-visio-primary" />
            ) : (
              <Circle className="w-6 h-6 text-visio-secondary hover:text-visio-primary transition-colors" />
            )}
          </Button>
          <h3 className={`font-semibold text-lg ${goal.isCompleted ? 'line-through text-visio-secondary' : 'text-visio-primary'}`}>
            {goal.title}
          </h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4 text-visio-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glossy-card">
            <DropdownMenuItem onClick={() => onEdit(goal)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(goal.id)} className="text-red-500">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        {getStatusBadge()}
      </div>

      {/* Description */}
      <p className="text-visio-secondary mb-4 line-clamp-2">
        {goal.description}
      </p>

      {/* Target Outcome */}
      <div className="flex items-center mb-4 p-3 bg-visio-surface-variant rounded-lg">
        <Target className="w-4 h-4 text-visio-primary mr-2 flex-shrink-0" />
        <p className="text-sm text-visio-primary font-medium">
          {goal.targetOutcome}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-visio-secondary mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-visio-surface-variant rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Days Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-visio-secondary">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{goal.targetDays} days total</span>
        </div>
        <div className="text-right">
          {goal.isCompleted ? (
            <span className="text-visio-primary font-medium">Completed! 🎉</span>
          ) : daysRemaining > 0 ? (
            <span className="text-visio-primary font-medium">{daysRemaining} days left</span>
          ) : (
            <span className="text-red-500 font-medium">Due today!</span>
          )}
        </div>
      </div>

      {/* Notes (if any) */}
      {goal.notes && (
        <div className="mt-4 pt-4 border-t border-visio-surface-variant">
          <p className="text-xs text-visio-secondary italic">
            "{goal.notes}"
          </p>
        </div>
      )}
    </Card>
  );
};

export default GoalCard;
