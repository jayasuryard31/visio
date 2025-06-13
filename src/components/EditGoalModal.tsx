
import React, { useState, useEffect } from 'react';
import { Goal } from '../types';
import { X, Sparkles, Target, Calendar, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (goalId: string, updates: Partial<Goal>) => void;
  goal: Goal | null;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ isOpen, onClose, onUpdate, goal }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDays: '',
    targetOutcome: '',
    notes: ''
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description,
        targetDays: goal.targetDays.toString(),
        targetOutcome: goal.targetOutcome,
        notes: goal.notes || ''
      });
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.targetDays || !formData.targetOutcome || !goal) {
      return;
    }

    onUpdate(goal.id, {
      title: formData.title,
      description: formData.description,
      targetDays: parseInt(formData.targetDays),
      targetOutcome: formData.targetOutcome,
      notes: formData.notes || undefined,
    });

    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center">
            <Sparkles className="w-6 h-6 text-orange-600 mr-2" />
            Edit Your Manifestation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center">
              <Target className="w-4 h-4 mr-2 text-orange-600" />
              Goal Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Learn Spanish fluently"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="border-orange-200 focus:border-orange-500 focus:ring-orange-500/20"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-orange-600" />
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your goal and why it's important to you..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 h-24"
              required
            />
          </div>

          {/* Target Days and Outcome in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetDays" className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                Target Days
              </Label>
              <Input
                id="targetDays"
                type="number"
                placeholder="30"
                min="1"
                max="365"
                value={formData.targetDays}
                onChange={(e) => handleChange('targetDays', e.target.value)}
                className="border-orange-200 focus:border-orange-500 focus:ring-orange-500/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetOutcome" className="text-sm font-medium text-gray-700 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-orange-600" />
                Target Outcome
              </Label>
              <Input
                id="targetOutcome"
                type="text"
                placeholder="Have a 10-minute conversation"
                value={formData.targetOutcome}
                onChange={(e) => handleChange('targetOutcome', e.target.value)}
                className="border-orange-200 focus:border-orange-500 focus:ring-orange-500/20"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any additional thoughts, motivations, or reminders..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 h-20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Update Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGoalModal;
