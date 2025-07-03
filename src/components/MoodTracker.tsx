
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '../integrations/supabase/client';
import { DailyCheckIn } from '../types';
import { Heart, Star, Zap, Coffee, Sun, Battery, BatteryLow } from 'lucide-react';
import { toast } from 'sonner';

const MoodTracker: React.FC = () => {
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | null>(null);
  const [moodRating, setMoodRating] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [gratitudeNote, setGratitudeNote] = useState('');
  const [dailyReflection, setDailyReflection] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodayCheckIn();
  }, []);

  const fetchTodayCheckIn = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('check_in_date', today)
      .maybeSingle();

    if (error) {
      console.error('Error fetching today check-in:', error);
    } else if (data) {
      const mappedCheckIn: DailyCheckIn = {
        id: data.id,
        userId: data.user_id,
        checkInDate: data.check_in_date,
        moodRating: data.mood_rating,
        energyLevel: data.energy_level,
        gratitudeNote: data.gratitude_note,
        dailyReflection: data.daily_reflection,
        goalsWorkedOn: data.goals_worked_on,
        createdAt: data.created_at,
      };
      setTodayCheckIn(mappedCheckIn);
      setMoodRating(data.mood_rating || 0);
      setEnergyLevel(data.energy_level || 0);
      setGratitudeNote(data.gratitude_note || '');
      setDailyReflection(data.daily_reflection || '');
    }
  };

  const handleSaveCheckIn = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const checkInData = {
      user_id: user.id,
      check_in_date: new Date().toISOString().split('T')[0],
      mood_rating: moodRating || null,
      energy_level: energyLevel || null,
      gratitude_note: gratitudeNote || null,
      daily_reflection: dailyReflection || null,
    };

    if (todayCheckIn) {
      const { error } = await supabase
        .from('daily_checkins')
        .update(checkInData)
        .eq('id', todayCheckIn.id);

      if (error) {
        console.error('Error updating check-in:', error);
        toast.error('Failed to update check-in');
      } else {
        toast.success('Check-in updated successfully!');
        fetchTodayCheckIn();
      }
    } else {
      const { error } = await supabase
        .from('daily_checkins')
        .insert([checkInData]);

      if (error) {
        console.error('Error creating check-in:', error);
        toast.error('Failed to save check-in');
      } else {
        toast.success('Check-in saved successfully!');
        fetchTodayCheckIn();
      }
    }
    setLoading(false);
  };

  const moodIcons = [null, '😢', '😕', '😐', '😊', '😄'];
  const energyIcons = [
    null, 
    <BatteryLow size={20} className="text-red-500" />, 
    <Coffee size={20} className="text-orange-500" />, 
    <Battery size={20} className="text-yellow-500" />, 
    <Zap size={20} className="text-blue-500" />, 
    <Sun size={20} className="text-green-500" />
  ];
  const energyLabels = ['', 'Exhausted', 'Low', 'Moderate', 'High', 'Energized'];

  return (
    <Card className="p-6 glossy-card">
      <h3 className="text-xl font-bold text-visio-primary mb-4 flex items-center">
        <Heart className="mr-2 text-visio-primary" size={24} />
        Daily Mood Check-in
      </h3>
      
      <div className="space-y-6">
        {/* Mood Rating */}
        <div>
          <label className="block text-sm font-medium text-visio-primary mb-2">
            How are you feeling today?
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setMoodRating(rating)}
                className={`p-3 rounded-lg text-2xl transition-all ${
                  moodRating === rating
                    ? 'bg-visio-primary text-white scale-110'
                    : 'bg-visio-surface-variant hover:bg-visio-primary hover:text-white'
                }`}
              >
                {moodIcons[rating]}
              </button>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div>
          <label className="block text-sm font-medium text-visio-primary mb-2">
            What's your energy level?
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="flex flex-col items-center">
                <button
                  onClick={() => setEnergyLevel(level)}
                  className={`p-3 rounded-lg transition-all ${
                    energyLevel === level
                      ? 'bg-visio-primary text-white scale-110'
                      : 'bg-visio-surface-variant hover:bg-visio-primary hover:text-white'
                  }`}
                >
                  {energyIcons[level]}
                </button>
                <span className="text-xs text-visio-secondary mt-1">{energyLabels[level]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gratitude Note */}
        <div>
          <label className="block text-sm font-medium text-visio-primary mb-2">
            What are you grateful for today?
          </label>
          <Textarea
            value={gratitudeNote}
            onChange={(e) => setGratitudeNote(e.target.value)}
            placeholder="I'm grateful for..."
            className="resize-none glossy-card"
            rows={2}
          />
        </div>

        {/* Daily Reflection */}
        <div>
          <label className="block text-sm font-medium text-visio-primary mb-2">
            Daily Reflection
          </label>
          <Textarea
            value={dailyReflection}
            onChange={(e) => setDailyReflection(e.target.value)}
            placeholder="How was your day? What did you learn?"
            className="resize-none glossy-card"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSaveCheckIn}
          disabled={loading}
          className="w-full glossy-button"
        >
          {loading ? 'Saving...' : todayCheckIn ? 'Update Check-in' : 'Save Check-in'}
        </Button>
      </div>
    </Card>
  );
};

export default MoodTracker;
