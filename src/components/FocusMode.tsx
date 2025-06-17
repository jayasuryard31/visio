import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '../integrations/supabase/client';
import { Target, Play, Pause, RotateCcw, Clock, Minimize, X } from 'lucide-react';
import { toast } from 'sonner';

interface FocusSession {
  id: string;
  userId: string;
  goalId?: string;
  duration: number;
  completedDuration: number;
  sessionType: 'work' | 'break' | 'longbreak';
  status: 'active' | 'paused' | 'completed';
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

const FocusMode: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'break' | 'longbreak'>('work');
  const [customDuration, setCustomDuration] = useState(25);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    fetchCompletedSessions();
  }, []);

  // Prevent navigation when in active session
  useEffect(() => {
    if (isActive && isFullscreen) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };

      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
        toast.error('Please complete or pause your focus session first');
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      window.history.pushState(null, '', window.location.href);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isActive, isFullscreen]);

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        // Fallback for browsers that don't support fullscreen
        setIsFullscreen(true);
      });
    } else {
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {
        setIsFullscreen(false);
      });
    } else {
      setIsFullscreen(false);
    }
  };

  const fetchCompletedSessions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('status', 'completed')
        .gte('created_at', today)
        .eq('session_type', 'work');

      if (error) {
        console.error('Error fetching focus sessions:', error);
      } else {
        setCompletedSessions(data?.length || 0);
      }
    } catch (error) {
      console.error('Error in fetchCompletedSessions:', error);
    }
  };

  const handleSessionComplete = async () => {
    setIsActive(false);
    
    if (currentSession) {
      try {
        const { error } = await supabase
          .from('focus_sessions')
          .update({
            status: 'completed',
            completed_duration: currentSession.duration,
            completed_at: new Date().toISOString(),
          })
          .eq('id', currentSession.id);

        if (error) {
          console.error('Error updating session:', error);
        }
      } catch (error) {
        console.error('Error in handleSessionComplete:', error);
      }
    }

    if (sessionType === 'work') {
      setCompletedSessions(prev => prev + 1);
      toast.success('Focus session completed! Great job!');
      
      // Auto-start break
      const breakDuration = completedSessions > 0 && (completedSessions + 1) % 4 === 0 ? 15 : 5;
      setSessionType(breakDuration === 15 ? 'longbreak' : 'break');
      setTimeLeft(breakDuration * 60);
    } else {
      toast.success('Break completed! Ready for another focus session?');
      setSessionType('work');
      setTimeLeft(customDuration * 60);
    }
    
    setCurrentSession(null);
    
    // Exit fullscreen when session completes
    if (isFullscreen) {
      exitFullscreen();
    }
  };

  const startSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const duration = timeLeft;
      const { data, error } = await supabase
        .from('focus_sessions')
        .insert([{
          user_id: user.id,
          duration: duration,
          completed_duration: 0,
          session_type: sessionType,
          status: 'active',
          started_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        toast.error('Failed to start session');
      } else if (data) {
        const sessionData = data as any;
        setCurrentSession({
          id: sessionData.id,
          userId: sessionData.user_id,
          duration: sessionData.duration,
          completedDuration: sessionData.completed_duration || 0,
          sessionType: sessionData.session_type,
          status: sessionData.status,
          startedAt: sessionData.started_at,
          createdAt: sessionData.created_at,
        });
        setIsActive(true);
        enterFullscreen();
        toast.success('Focus session started!');
      }
    } catch (error) {
      console.error('Error in startSession:', error);
      toast.error('Failed to start session');
    }
  };

  const pauseSession = () => {
    setIsActive(false);
    if (isFullscreen) {
      exitFullscreen();
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentSession(null);
    
    if (sessionType === 'work') {
      setTimeLeft(customDuration * 60);
    } else if (sessionType === 'break') {
      setTimeLeft(5 * 60);
    } else {
      setTimeLeft(15 * 60);
    }

    if (isFullscreen) {
      exitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionTypeLabel = () => {
    switch (sessionType) {
      case 'work': return 'Focus Time';
      case 'break': return 'Short Break';
      case 'longbreak': return 'Long Break';
    }
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case 'work': return 'from-red-400 to-orange-400';
      case 'break': return 'from-green-400 to-emerald-400';
      case 'longbreak': return 'from-blue-400 to-indigo-400';
    }
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center z-50">
        <div className="text-center">
          {/* Exit button */}
          <Button
            onClick={exitFullscreen}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
          >
            <X size={24} />
          </Button>

          {/* Timer Display */}
          <div className={`mx-auto w-80 h-80 rounded-full bg-gradient-to-br ${getSessionColor()} flex items-center justify-center mb-8 shadow-2xl`}>
            <div className="bg-white rounded-full w-72 h-72 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold text-gray-800 mb-4">
                {formatTime(timeLeft)}
              </div>
              <div className="text-lg text-gray-600 mb-2">{getSessionTypeLabel()}</div>
              <div className="text-sm text-gray-500">
                Sessions today: {completedSessions}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-6">
            {!isActive ? (
              <Button
                onClick={() => setIsActive(true)}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg"
              >
                <Play size={24} className="mr-2" />
                Resume
              </Button>
            ) : (
              <Button
                onClick={pauseSession}
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 text-lg"
              >
                <Pause size={24} className="mr-2" />
                Pause
              </Button>
            )}
            
            <Button
              onClick={resetSession}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              <RotateCcw size={24} className="mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-xl">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <Target className="mr-2 text-red-500" size={28} />
          Focus Mode
        </h3>
        <p className="text-gray-600 mb-6">Pomodoro technique for enhanced productivity</p>

        {/* Timer Display */}
        <div className={`mx-auto w-64 h-64 rounded-full bg-gradient-to-br ${getSessionColor()} flex items-center justify-center mb-6 shadow-2xl`}>
          <div className="bg-white rounded-full w-56 h-56 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-600 mb-1">{getSessionTypeLabel()}</div>
            <div className="text-xs text-gray-500">
              Sessions today: {completedSessions}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          {!isActive ? (
            <Button
              onClick={startSession}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Play size={20} className="mr-2" />
              Start
            </Button>
          ) : (
            <Button
              onClick={pauseSession}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Pause size={20} className="mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={resetSession}
            size="lg"
            variant="outline"
          >
            <RotateCcw size={20} className="mr-2" />
            Reset
          </Button>
        </div>

        {/* Session Settings */}
        {!isActive && (
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type
              </label>
              <Select value={sessionType} onValueChange={(value: any) => {
                setSessionType(value);
                if (value === 'work') {
                  setTimeLeft(customDuration * 60);
                } else if (value === 'break') {
                  setTimeLeft(5 * 60);
                } else {
                  setTimeLeft(15 * 60);
                }
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Focus Time</SelectItem>
                  <SelectItem value="break">Short Break</SelectItem>
                  <SelectItem value="longbreak">Long Break</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {sessionType === 'work' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={customDuration}
                  onChange={(e) => {
                    const duration = parseInt(e.target.value) || 25;
                    setCustomDuration(duration);
                    setTimeLeft(duration * 60);
                  }}
                  min="1"
                  max="60"
                />
              </div>
            )}
          </div>
        )}

        {/* Progress Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white rounded-lg shadow">
            <div className="text-lg font-bold text-green-600">{completedSessions}</div>
            <div className="text-xs text-gray-500">Today</div>
          </div>
          <div className="p-3 bg-white rounded-lg shadow">
            <div className="text-lg font-bold text-blue-600">
              {Math.round((completedSessions * customDuration) / 60 * 10) / 10}h
            </div>
            <div className="text-xs text-gray-500">Focus Time</div>
          </div>
          <div className="p-3 bg-white rounded-lg shadow">
            <div className="text-lg font-bold text-purple-600">
              {Math.floor(completedSessions / 4)}
            </div>
            <div className="text-xs text-gray-500">Cycles</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FocusMode;
