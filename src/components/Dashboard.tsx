import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Progress } from './ui/Progress';
import { Flame, Droplets, Dumbbell, Target, TrendingUp, Award } from 'lucide-react';
import { User, DailyStats } from '../types';

interface DashboardProps {
  user: User;
  todayStats: DailyStats;
}

export function Dashboard({ user, todayStats }: DashboardProps) {
  const calorieProgress = Math.min((todayStats.calories / user.goals.calories) * 100, 100);
  const waterProgress = Math.min((todayStats.water / user.goals.water) * 100, 100);
  const exerciseProgress = Math.min((todayStats.exercise / user.goals.exercise) * 100, 100);
  
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-emerald-100">You're doing great! Keep up the healthy habits.</p>
        <div className="flex items-center mt-4 space-x-4">
          <div className="flex items-center space-x-2">
            <Flame className="text-orange-300" size={20} />
            <span className="font-semibold">{user.streak} day streak</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="text-yellow-300" size={20} />
            <span className="font-semibold">{user.points} points</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calories */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Calories</h3>
              <Target className="text-emerald-500" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Consumed</span>
                <span className="font-medium">{Math.round(todayStats.calories)} / {user.goals.calories}</span>
              </div>
              <Progress 
                value={todayStats.calories} 
                max={user.goals.calories} 
                color="emerald"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Math.max(0, user.goals.calories - todayStats.calories)} calories remaining
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Water */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Water</h3>
              <Droplets className="text-blue-500" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Glasses</span>
                <span className="font-medium">{todayStats.water} / {user.goals.water}</span>
              </div>
              <Progress 
                value={todayStats.water} 
                max={user.goals.water} 
                color="blue"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Math.max(0, user.goals.water - todayStats.water)} glasses to go
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Exercise */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Exercise</h3>
              <Dumbbell className="text-purple-500" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Minutes</span>
                <span className="font-medium">{todayStats.exercise} / {user.goals.exercise}</span>
              </div>
              <Progress 
                value={todayStats.exercise} 
                max={user.goals.exercise} 
                color="purple"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Math.max(0, user.goals.exercise - todayStats.exercise)} minutes remaining
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Macronutrients */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Today's Nutrition</h3>
            <TrendingUp className="text-emerald-500" size={20} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-500">{Math.round(todayStats.protein)}g</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{Math.round(todayStats.carbs)}g</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{Math.round(todayStats.fat)}g</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Fat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievement */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Latest Achievement</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🔥</div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Week Warrior</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Maintained a 7-day logging streak</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}