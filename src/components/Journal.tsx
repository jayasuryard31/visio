
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '../integrations/supabase/client';
import { BookOpen, Plus, Calendar, Search } from 'lucide-react';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  entryDate: string;
  mood?: string;
  tags?: string[];
  createdAt: string;
}

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries' as any)
        .select('*')
        .order('entry_date', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching journal entries:', error);
      } else if (data) {
        const mappedEntries: JournalEntry[] = data.map((entry: any) => ({
          id: entry.id,
          userId: entry.user_id,
          title: entry.title,
          content: entry.content,
          entryDate: entry.entry_date,
          mood: entry.mood,
          tags: entry.tags,
          createdAt: entry.created_at,
        }));
        setEntries(mappedEntries);
      }
    } catch (error) {
      console.error('Error in fetchJournalEntries:', error);
    }
  };

  const handleCreateEntry = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('journal_entries' as any)
        .insert([{
          user_id: user.id,
          title: newTitle,
          content: newContent,
          entry_date: new Date().toISOString().split('T')[0],
        }]);

      if (error) {
        console.error('Error creating journal entry:', error);
        toast.error('Failed to create journal entry');
      } else {
        toast.success('Journal entry created successfully!');
        setNewTitle('');
        setNewContent('');
        setIsCreating(false);
        fetchJournalEntries();
      }
    } catch (error) {
      console.error('Error in handleCreateEntry:', error);
      toast.error('Failed to create journal entry');
    }
    setLoading(false);
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <BookOpen className="mr-2 text-green-500" size={24} />
          Personal Journal
        </h3>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          size="sm"
          style={{
            background: 'linear-gradient(45deg, #10b981, #059669)',
            color: 'white',
            border: 'none'
          }}
        >
          <Plus size={16} className="mr-1" />
          New Entry
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your journal..."
          className="pl-10"
        />
      </div>

      {/* Create New Entry */}
      {isCreating && (
        <Card className="p-4 mb-4 bg-white">
          <div className="space-y-3">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Entry title..."
              className="font-medium"
            />
            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="What's on your mind today?"
              rows={4}
              className="resize-none"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleCreateEntry}
                disabled={loading || !newTitle.trim() || !newContent.trim()}
                size="sm"
                style={{
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none'
                }}
              >
                {loading ? 'Saving...' : 'Save Entry'}
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

      {/* Journal Entries */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
            <p>No journal entries yet. Start writing your thoughts!</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{entry.title}</h4>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  {new Date(entry.entryDate).toLocaleDateString()}
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">{entry.content}</p>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
};

export default Journal;
