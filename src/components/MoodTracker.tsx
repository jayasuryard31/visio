
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '../integrations/supabase/client';
import { DailyCheckIn } from '../types';
import { Heart, Star, Zap, Coffee, Sun } from 'lucide-react';
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
      setTodayCheckIn(data);
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
  const energyIcons = [null, <Coffee size={20} />, <Star size={20} />, <Heart size={20} />, <Zap size={20} />, <Sun size={20} />];

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Heart className="mr-2 text-pink-500" size={24} />
        Daily Mood Check-in
      </h3>
      
      <div className="space-y-6">
        {/* Mood Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling today?
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setMoodRating(rating)}
                className={`p-3 rounded-lg text-2xl transition-all ${
                  moodRating === rating
                    ? 'bg-pink-200 scale-110'
                    : 'bg-white hover:bg-pink-100'
                }`}
              >
                {moodIcons[rating]}
              </button>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What's your energy level?
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setEnergyLevel(level)}
                className={`p-3 rounded-lg transition-all ${
                  energyLevel === level
                    ? 'bg-yellow-200 scale-110 text-yellow-600'
                    : 'bg-white hover:bg-yellow-100 text-gray-600'
                }`}
              >
                {energyIcons[level]}
              </button>
            ))}
          </div>
        </div>

        {/* Gratitude Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are you grateful for today?
          </label>
          <Textarea
            value={gratitudeNote}
            onChange={(e) => setGratitudeNote(e.target.value)}
            placeholder="I'm grateful for..."
            className="resize-none"
            rows={2}
          />
        </div>

        {/* Daily Reflection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Reflection
          </label>
          <Textarea
            value={dailyReflection}
            onChange={(e) => setDailyReflection(e.target.value)}
            placeholder="How was your day? What did you learn?"
            className="resize-none"
            rows={3}
          />
        </div>

        <Button
          onClick={handleSaveCheckIn}
          disabled={loading}
          className="w-full"
          style={{
            background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
            color: 'white',
            border: 'none'
          }}
        >
          {loading ? 'Saving...' : todayCheckIn ? 'Update Check-in' : 'Save Check-in'}
        </Button>
      </div>
    </Card>
  );
};

export default MoodTracker;
