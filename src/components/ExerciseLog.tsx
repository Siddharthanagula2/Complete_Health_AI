import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { Modal } from './ui/Modal';
import { Dumbbell, Plus, Play, Clock, Zap } from 'lucide-react';
import { ExerciseEntry } from '../types';
import { mockExercises } from '../data/mockData';

interface ExerciseLogProps {
  entries: ExerciseEntry[];
  onAddEntry: (entry: Omit<ExerciseEntry, 'id'>) => void;
  goal: number; // minutes per day
}

export function ExerciseLog({ entries, onAddEntry, goal }: ExerciseLogProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState<'low' | 'moderate' | 'high'>('moderate');

  const todayEntries = entries.filter(entry => {
    const today = new Date().toDateString();
    return entry.timestamp.toDateString() === today;
  });

  const totalMinutes = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const totalCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);

  const handleAddExercise = () => {
    if (!selectedExercise) return;

    // Adjust calories based on intensity and duration
    const baseCaloriesPerMinute = selectedExercise.calories / selectedExercise.duration;
    const intensityMultiplier = { low: 0.8, moderate: 1.0, high: 1.3 }[intensity];
    const adjustedCalories = Math.round(baseCaloriesPerMinute * duration * intensityMultiplier);

    const entry: Omit<ExerciseEntry, 'id'> = {
      name: selectedExercise.name,
      type: selectedExercise.type,
      duration,
      calories: adjustedCalories,
      intensity,
      timestamp: new Date()
    };

    onAddEntry(entry);
    setIsAddModalOpen(false);
    setSelectedExercise(null);
    setDuration(30);
    setIntensity('moderate');
  };

  const exerciseTypes = {
    cardio: { icon: '🏃‍♀️', color: 'text-red-500' },
    strength: { icon: '💪', color: 'text-blue-500' },
    flexibility: { icon: '🧘‍♀️', color: 'text-green-500' },
    sports: { icon: '⚽', color: 'text-purple-500' }
  };

  return (
    <div className="space-y-6">
      {/* Exercise Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Today's Exercise</h3>
            <Dumbbell className="text-purple-500" size={24} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">{totalMinutes}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">{totalCalories}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
            </div>
          </div>
          
          <Progress 
            value={totalMinutes} 
            max={goal} 
            color="purple"
            showLabel
            label="Daily Goal Progress"
            className="mb-2"
          />
          
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full"
          >
            <Plus size={16} className="mr-2" />
            Log Exercise
          </Button>
        </CardContent>
      </Card>

      {/* Exercise History */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Recent Workouts</h3>
        </CardHeader>
        <CardContent>
          {todayEntries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No exercises logged today. Time to get moving!
            </p>
          ) : (
            <div className="space-y-3">
              {todayEntries.reverse().map((entry) => {
                const typeInfo = exerciseTypes[entry.type];
                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{typeInfo.icon}</div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{entry.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{entry.duration} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap size={14} />
                            <span>{entry.calories} cal</span>
                          </div>
                          <div className={`capitalize ${
                            entry.intensity === 'high' ? 'text-red-500' :
                            entry.intensity === 'moderate' ? 'text-yellow-500' : 'text-green-500'
                          }`}>
                            {entry.intensity}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Exercise Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Exercise"
      >
        <div className="space-y-4">
          {/* Exercise Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Choose Exercise
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {mockExercises.map((exercise) => {
                const typeInfo = exerciseTypes[exercise.type as keyof typeof exerciseTypes];
                return (
                  <div
                    key={exercise.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedExercise?.id === exercise.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">{typeInfo.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {exercise.type} • {exercise.calories} cal/{exercise.duration} min
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedExercise && (
            <>
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Intensity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Intensity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'moderate', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setIntensity(level)}
                      className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                        intensity === level
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated Calories */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Estimated Burn</h4>
                <div className="text-2xl font-bold text-purple-500">
                  {Math.round((selectedExercise.calories / selectedExercise.duration) * duration * 
                    ({ low: 0.8, moderate: 1.0, high: 1.3 }[intensity]))} calories
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on {intensity} intensity for {duration} minutes
                </p>
              </div>

              <Button onClick={handleAddExercise} className="w-full">
                <Play size={16} className="mr-2" />
                Log Exercise
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}