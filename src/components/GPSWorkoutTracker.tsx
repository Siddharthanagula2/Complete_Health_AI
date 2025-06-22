import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { 
  Play, 
  Pause, 
  Square, 
  MapPin, 
  Timer, 
  Zap, 
  TrendingUp, 
  Heart,
  Navigation,
  Mountain
} from 'lucide-react';
import { GPSWorkout, GPSPoint } from '../types';

interface GPSWorkoutTrackerProps {
  onWorkoutComplete: (workout: Omit<GPSWorkout, 'id'>) => void;
}

export function GPSWorkoutTracker({ onWorkoutComplete }: GPSWorkoutTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [workoutType, setWorkoutType] = useState<'running' | 'cycling' | 'walking' | 'hiking'>('running');
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentPace, setCurrentPace] = useState(0);
  const [avgPace, setAvgPace] = useState(0);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [route, setRoute] = useState<GPSPoint[]>([]);

  // Simulate GPS tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        
        // Simulate distance increase (varies by workout type)
        const speedMultiplier = {
          running: 0.003,
          cycling: 0.008,
          walking: 0.002,
          hiking: 0.0015
        }[workoutType];
        
        setDistance(prev => prev + speedMultiplier);
        
        // Calculate pace (minutes per km)
        const currentSpeed = speedMultiplier * 60; // km/h
        setCurrentPace(currentSpeed > 0 ? 60 / currentSpeed : 0);
        
        // Update average pace
        if (duration > 0 && distance > 0) {
          setAvgPace((duration / 60) / distance);
        }
        
        // Simulate calories (varies by workout type and intensity)
        const calorieRate = {
          running: 12,
          cycling: 8,
          walking: 5,
          hiking: 7
        }[workoutType];
        
        setCalories(prev => prev + (calorieRate / 60));
        
        // Simulate heart rate
        setHeartRate(120 + Math.random() * 40);
        
        // Simulate elevation changes
        setElevation(prev => prev + (Math.random() - 0.5) * 2);
        
        // Add GPS point
        const newPoint: GPSPoint = {
          latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
          elevation: elevation,
          timestamp: new Date(),
          heartRate: heartRate,
          pace: currentPace
        };
        
        setRoute(prev => [...prev, newPoint]);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTracking, isPaused, workoutType, duration, distance, currentPace, heartRate, elevation]);

  const startWorkout = () => {
    setIsTracking(true);
    setIsPaused(false);
    // Reset all values
    setDuration(0);
    setDistance(0);
    setCurrentPace(0);
    setAvgPace(0);
    setCalories(0);
    setHeartRate(0);
    setElevation(0);
    setRoute([]);
  };

  const pauseWorkout = () => {
    setIsPaused(!isPaused);
  };

  const stopWorkout = () => {
    if (duration > 0) {
      const workout: Omit<GPSWorkout, 'id'> = {
        name: `${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} Workout`,
        type: workoutType,
        duration,
        distance: Math.round(distance * 100) / 100,
        calories: Math.round(calories),
        avgPace,
        maxPace: Math.max(...route.map(p => p.pace || 0)),
        elevationGain: Math.max(0, elevation),
        heartRateAvg: Math.round(heartRate),
        heartRateMax: Math.round(Math.max(...route.map(p => p.heartRate || 0))),
        route,
        timestamp: new Date()
      };
      
      onWorkoutComplete(workout);
    }
    
    setIsTracking(false);
    setIsPaused(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Workout Type Selection */}
      {!isTracking && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white">Choose Workout Type</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {(['running', 'cycling', 'walking', 'hiking'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setWorkoutType(type)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    workoutType === type
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {type === 'running' && '🏃‍♂️'}
                    {type === 'cycling' && '🚴‍♂️'}
                    {type === 'walking' && '🚶‍♂️'}
                    {type === 'hiking' && '🥾'}
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white capitalize">{type}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Tracking Interface */}
      {isTracking && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                {workoutType} Workout
              </h3>
              <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
            </div>
          </CardHeader>
          <CardContent>
            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-500">{formatTime(duration)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{distance.toFixed(2)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Distance (km)</div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Timer size={16} className="text-purple-500" />
                  <span className="text-sm font-medium">Pace</span>
                </div>
                <div className="text-lg font-bold text-purple-500">
                  {currentPace > 0 ? formatPace(currentPace) : '--:--'}
                </div>
                <div className="text-xs text-gray-500">min/km</div>
              </div>

              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Zap size={16} className="text-orange-500" />
                  <span className="text-sm font-medium">Calories</span>
                </div>
                <div className="text-lg font-bold text-orange-500">{Math.round(calories)}</div>
                <div className="text-xs text-gray-500">kcal</div>
              </div>

              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Heart size={16} className="text-red-500" />
                  <span className="text-sm font-medium">Heart Rate</span>
                </div>
                <div className="text-lg font-bold text-red-500">{Math.round(heartRate)}</div>
                <div className="text-xs text-gray-500">bpm</div>
              </div>

              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Mountain size={16} className="text-green-500" />
                  <span className="text-sm font-medium">Elevation</span>
                </div>
                <div className="text-lg font-bold text-green-500">{Math.round(elevation)}</div>
                <div className="text-xs text-gray-500">m</div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 mb-6 text-center">
              <MapPin className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-gray-600 dark:text-gray-400">GPS Map View</p>
              <p className="text-sm text-gray-500">Route: {route.length} points tracked</p>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isPaused ? (
                <Button onClick={pauseWorkout} variant="warning" size="lg">
                  <Pause size={20} className="mr-2" />
                  Pause
                </Button>
              ) : (
                <Button onClick={pauseWorkout} variant="success" size="lg">
                  <Play size={20} className="mr-2" />
                  Resume
                </Button>
              )}
              
              <Button onClick={stopWorkout} variant="danger" size="lg">
                <Square size={20} className="mr-2" />
                Stop
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Workout Button */}
      {!isTracking && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={startWorkout} className="w-full" size="lg">
              <Play size={24} className="mr-2" />
              Start {workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} Workout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}