import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { Modal } from './ui/Modal';
import { Heart, Plus, TrendingUp, Calendar, MessageCircle } from 'lucide-react';
import { MoodEntry } from '../types';

interface MoodTrackerProps {
  entries: MoodEntry[];
  onAddEntry: (entry: Omit<MoodEntry, 'id'>) => void;
}

export function MoodTracker({ entries, onAddEntry }: MoodTrackerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(5);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const moodEmojis = {
    1: '😢',
    2: '😔',
    3: '😐',
    4: '🙂',
    5: '😊',
    6: '😄',
    7: '🤩',
    8: '😍',
    9: '🥳',
    10: '🌟'
  };

  const moodLabels = {
    1: 'Terrible',
    2: 'Very Bad',
    3: 'Bad',
    4: 'Poor',
    5: 'Okay',
    6: 'Good',
    7: 'Great',
    8: 'Excellent',
    9: 'Amazing',
    10: 'Perfect'
  };

  const moodFactors = [
    'Work/School', 'Relationships', 'Health', 'Exercise', 'Sleep', 'Weather',
    'Social', 'Family', 'Stress', 'Achievement', 'Relaxation', 'Creativity',
    'Nature', 'Music', 'Food', 'Travel', 'Learning', 'Helping Others'
  ];

  const todayEntries = entries.filter(entry => {
    const today = new Date().toDateString();
    return new Date(entry.timestamp).toDateString() === today;
  });

  const avgMood = entries.length > 0 ? 
    entries.slice(-7).reduce((sum, entry) => sum + entry.rating, 0) / Math.min(7, entries.length) : 0;

  const handleAddMood = () => {
    const entry: Omit<MoodEntry, 'id'> = {
      rating: selectedMood,
      factors: selectedFactors,
      notes: notes.trim() || undefined,
      timestamp: new Date()
    };

    onAddEntry(entry);
    setIsAddModalOpen(false);
    setSelectedMood(5);
    setSelectedFactors([]);
    setNotes('');
  };

  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  const getMoodColor = (rating: number) => {
    if (rating >= 8) return 'text-green-500';
    if (rating >= 6) return 'text-blue-500';
    if (rating >= 4) return 'text-yellow-500';
    if (rating >= 2) return 'text-orange-500';
    return 'text-red-500';
  };

  const getMoodTrend = () => {
    if (entries.length < 2) return null;
    const recent = entries.slice(-3).reduce((sum, e) => sum + e.rating, 0) / 3;
    const previous = entries.slice(-6, -3).reduce((sum, e) => sum + e.rating, 0) / 3;
    return recent - previous;
  };

  const trend = getMoodTrend();

  return (
    <div className="space-y-6">
      {/* Mood Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Mood Overview</h3>
            <Heart className="text-pink-500" size={24} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {todayEntries.length > 0 ? moodEmojis[todayEntries[todayEntries.length - 1].rating as keyof typeof moodEmojis] : '😐'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-500">
                {avgMood.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">7-Day Average</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${trend !== null ? (trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500') : 'text-gray-400'}`}>
                {trend !== null ? (trend > 0 ? '↗️' : trend < 0 ? '↘️' : '➡️') : '📊'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Trend</div>
            </div>
          </div>
          
          <Progress 
            value={avgMood} 
            max={10} 
            color="pink"
            showLabel
            label="Mood Score"
            className="mb-4"
          />
          
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full"
          >
            <Plus size={16} className="mr-2" />
            Log Mood
          </Button>
        </CardContent>
      </Card>

      {/* Mood History */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Recent Moods</h3>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No mood data logged yet. Start tracking your mood!
            </p>
          ) : (
            <div className="space-y-3">
              {entries.slice(-7).reverse().map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">
                      {moodEmojis[entry.rating as keyof typeof moodEmojis]}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {moodLabels[entry.rating as keyof typeof moodLabels]}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{entry.rating}/10</span>
                        {entry.factors && entry.factors.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{entry.factors.slice(0, 2).join(', ')}{entry.factors.length > 2 ? '...' : ''}</span>
                          </>
                        )}
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-gray-500 mt-1">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-emerald-500" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Mood Insights</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Most Common Mood</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {entries.length > 0 ? moodLabels[Math.round(avgMood) as keyof typeof moodLabels] : 'No data'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Entries This Week</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {entries.filter(e => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(e.timestamp) >= weekAgo;
                }).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Best Day</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {entries.length > 0 ? 
                  new Date(entries.reduce((best, current) => 
                    current.rating > best.rating ? current : best
                  ).timestamp).toLocaleDateString() : 'No data'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Mood Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Your Mood"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How are you feeling? (1-10)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(moodEmojis).map(([rating, emoji]) => (
                <button
                  key={rating}
                  onClick={() => setSelectedMood(parseInt(rating))}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedMood === parseInt(rating)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="text-2xl">{emoji}</div>
                  <div className="text-xs mt-1">{rating}</div>
                </button>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                {moodLabels[selectedMood as keyof typeof moodLabels]}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What's affecting your mood? (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {moodFactors.map((factor) => (
                <button
                  key={factor}
                  onClick={() => toggleFactor(factor)}
                  className={`p-2 text-sm rounded-lg transition-colors ${
                    selectedFactors.includes(factor)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {factor}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What happened today? Any thoughts or reflections?"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>

          <Button onClick={handleAddMood} className="w-full">
            <Heart size={16} className="mr-2" />
            Log Mood
          </Button>
        </div>
      </Modal>
    </div>
  );
}