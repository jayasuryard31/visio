
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '../integrations/supabase/client';
import { Calendar, Clock, Plus, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  location?: string;
  category: 'work' | 'personal' | 'health' | 'social' | 'other';
  createdAt: string;
}

const Schedule: React.FC = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    category: 'personal' as const
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('schedule_events' as any)
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching events:', error);
      } else if (data) {
        const mappedEvents: ScheduleEvent[] = data.map((event: any) => ({
          id: event.id,
          userId: event.user_id,
          title: event.title,
          description: event.description,
          startTime: event.start_time,
          endTime: event.end_time,
          date: event.date,
          location: event.location,
          category: event.category,
          createdAt: event.created_at,
        }));
        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error('Error in fetchEvents:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.startTime || !newEvent.endTime) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('schedule_events' as any)
        .insert([{
          user_id: user.id,
          title: newEvent.title,
          description: newEvent.description || null,
          start_time: newEvent.startTime,
          end_time: newEvent.endTime,
          date: newEvent.date,
          location: newEvent.location || null,
          category: newEvent.category,
        }]);

      if (error) {
        console.error('Error creating event:', error);
        toast.error('Failed to create event');
      } else {
        toast.success('Event created successfully!');
        setNewEvent({
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          date: new Date().toISOString().split('T')[0],
          location: '',
          category: 'personal'
        });
        setIsCreating(false);
        fetchEvents();
      }
    } catch (error) {
      console.error('Error in handleCreateEvent:', error);
      toast.error('Failed to create event');
    }
    setLoading(false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      work: 'bg-blue-100 text-blue-800',
      personal: 'bg-green-100 text-green-800',
      health: 'bg-red-100 text-red-800',
      social: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Calendar className="mr-2 text-blue-500" size={24} />
          Schedule
        </h3>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          size="sm"
          style={{
            background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
            color: 'white',
            border: 'none'
          }}
        >
          <Plus size={16} className="mr-1" />
          New Event
        </Button>
      </div>

      {/* Create New Event */}
      {isCreating && (
        <Card className="p-4 mb-4 bg-white">
          <div className="space-y-3">
            <Input
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              placeholder="Event title..."
            />
            <Textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              placeholder="Description (optional)"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              />
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({...newEvent, category: e.target.value as any})}
                className="px-3 py-2 border rounded-md"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="health">Health</option>
                <option value="social">Social</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                placeholder="Start time"
              />
              <Input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                placeholder="End time"
              />
            </div>
            <Input
              value={newEvent.location}
              onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              placeholder="Location (optional)"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleCreateEvent}
                disabled={loading || !newEvent.title.trim()}
                size="sm"
                style={{
                  background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none'
                }}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
              <Button
                onClick={() => setIsCreating(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Upcoming Events */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto mb-3 opacity-50" />
            <p>No upcoming events. Schedule your day!</p>
          </div>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{event.title}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock size={14} className="mr-1" />
                    {event.startTime} - {event.endTime}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin size={14} className="mr-1" />
                      {event.location}
                    </div>
                  )}
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
};

export default Schedule;
