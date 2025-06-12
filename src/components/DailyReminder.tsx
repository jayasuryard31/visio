
import React, { useState } from 'react';
import { Sparkles, X, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DailyReminder: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentReminder] = useState(() => {
    const reminders = [
      "Don't forget to focus on your goals today! ✨",
      "Every small step brings you closer to your dreams! 🌟",
      "Believe in yourself - you're capable of amazing things! 💫",
      "Today is a perfect day to manifest your desires! 🎯",
      "Your future self will thank you for the effort you put in today! 🚀",
      "Progress, not perfection. Keep moving forward! 💪",
      "Your dreams are valid and achievable! 🌈"
    ];
    return reminders[Math.floor(Math.random() * reminders.length)];
  });

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white border-0 shadow-xl animate-fade-in">
      <div className="p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-2 left-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="flex items-center mr-4">
              <Heart className="w-6 h-6 text-pink-200 mr-2 animate-pulse" />
              <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Daily Motivation</h3>
              <p className="text-white/90">{currentReminder}</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DailyReminder;
