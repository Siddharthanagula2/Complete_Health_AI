import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { Modal } from './ui/Modal';
import { Moon, Plus, Clock, Star, TrendingUp, Bed, Sun } from 'lucide-react';
import { SleepEntry } from '../types';

interface SleepTrackerProps {
  entries: SleepEntry[];
  onAddEntry: (entry: Omit<SleepEntry, 'id'>) => void;
  goal: number; // hours
}

export function SleepTracker({ entries, onAddEntry, goal }: SleepTrackerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bedtime, setBedtime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState(4);
  const [notes, setNotes] = useState('');

  const todayEntries = entries.filter(entry => {
    const today = new Date().toDateString();
    return new Date(entry.date).toDateString() === today;
  });

  const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const avgSleep = entries.length > 0 ? 
    entries.slice(-7).reduce((sum, entry) => sum + entry.duration, 0) / Math.min(7, entries.length) : 0;

  const calculateDuration = (bedtime: string, wakeTime: string) => {
    const [bedHour, bedMin] = bedtime.split(':').map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    
    let bedMinutes = bedHour * 60 + bedMin;
    let wakeMinutes = wakeHour * 60 + wakeMin;
    
    // Handle overnight sleep
    if (wakeMinutes <= bedMinutes) {
      wakeMinutes += 24 * 60;
    }
    
    return (wakeMinutes - bedMinutes) / 60;
  };

  const handleAddSleep = () => {
    const duration = calculateDuration(bedtime, wakeTime);
    
    const entry: Omit<SleepEntry, 'id'> = {
      date: new Date(),
      bedtime,
      wakeTime,
      duration,
      quality,
      notes: notes.trim() || undefined
    };

    onAddEntry(entry);
    setIsAddModalOpen(false);
    setBedtime('22:00');
    setWakeTime('07:00');
    setQuality(4);
    setNotes('');
  };

  const getSleepQualityText = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Fair';
    if (rating >= 1.5) return 'Poor';
    return 'Very Poor';
  };

  const getSleepQualityColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 3.5) return 'text-blue-500';
    if (rating >= 2.5) return 'text-yellow-500';
    if (rating >= 1.5) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Sleep Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Sleep Overview</h3>
            <Moon className="text-indigo-500" size={24} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-500">
                {lastEntry ? `${lastEntry.duration.toFixed(1)}h` : '0h'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Last Night</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                {avgSleep.toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">7-Day Average</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${lastEntry ? getSleepQualityColor(lastEntry.quality) : 'text-gray-400'}`}>
                {lastEntry ? getSleepQualityText(lastEntry.quality) : 'No Data'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Quality</div>
            </div>
          </div>
          
          <Progress 
            value={lastEntry ? lastEntry.duration : 0} 
            max={goal} 
            color="indigo"
            showLabel
            label="Sleep Goal Progress"
            className="mb-4"
          />
          
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full"
          >
            <Plus size={16} className="mr-2" />
            Log Sleep
          </Button>
        </CardContent>
      </Card>

      {/* Sleep History */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Recent Sleep</h3>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No sleep data logged yet. Start tracking your sleep!
            </p>
          ) : (
            <div className="space-y-3">
              {entries.slice(-7).reverse().map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">😴</div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {entry.duration.toFixed(1)} hours
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Bed size={14} />
                          <span>{entry.bedtime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Sun size={14} />
                          <span>{entry.wakeTime}</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${getSleepQualityColor(entry.quality)}`}>
                          <Star size={14} />
                          <span>{entry.quality}/5</span>
                        </div>
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-gray-500 mt-1">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sleep Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-emerald-500" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Sleep Trends</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Average Sleep Duration</span>
              <span className="font-medium text-gray-900 dark:text-white">{avgSleep.toFixed(1)} hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Goal Achievement</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {entries.filter(e => e.duration >= goal).length}/{entries.length} nights
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Average Quality</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {entries.length > 0 ? (entries.reduce((sum, e) => sum + e.quality, 0) / entries.length).toFixed(1) : '0'}/5
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Sleep Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Sleep"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bedtime
              </label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Wake Time
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sleep Quality (1-5)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setQuality(rating)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    quality === rating
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {rating}
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
              placeholder="How did you sleep? Any factors affecting your sleep?"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sleep Summary</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Duration: {calculateDuration(bedtime, wakeTime).toFixed(1)} hours</p>
              <p>Quality: {getSleepQualityText(quality)}</p>
            </div>
          </div>

          <Button onClick={handleAddSleep} className="w-full">
            <Moon size={16} className="mr-2" />
            Log Sleep
          </Button>
        </div>
      </Modal>
    </div>
  );
}