import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Progress as ProgressBar } from './ui/Progress';
import { TrendingUp, TrendingDown, Target, Award, Calendar, Zap } from 'lucide-react';
import { DailyStats, Achievement } from '../types';

interface ProgressProps {
  stats: DailyStats[];
  achievements: Achievement[];
  userGoals: {
    weight: number;
    calories: number;
    water: number;
    exercise: number;
  };
}

export function Progress({ stats, achievements, userGoals }: ProgressProps) {
  const latestStats = stats[0];
  const previousStats = stats[1];
  
  const earnedAchievements = achievements.filter(a => a.earned);
  const inProgressAchievements = achievements.filter(a => !a.earned && a.progress > 0);
  
  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  const weightTrend = previousStats ? calculateTrend(latestStats.weight || 0, previousStats.weight || 0) : 0;
  const calorieTrend = previousStats ? calculateTrend(latestStats.calories, previousStats.calories) : 0;
  const exerciseTrend = previousStats ? calculateTrend(latestStats.exercise, previousStats.exercise) : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-emerald-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Progress Overview</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Weight Progress */}
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {latestStats.weight ? `${latestStats.weight}kg` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Weight</div>
              {latestStats.weight && (
                <div className={`text-xs mt-1 flex items-center justify-center space-x-1 ${
                  weightTrend < 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {weightTrend < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                  <span>{Math.abs(weightTrend).toFixed(1)}%</span>
                </div>
              )}
            </div>

            {/* Calorie Consistency */}
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((latestStats.calories / userGoals.calories) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Calorie Goal</div>
              <div className={`text-xs mt-1 flex items-center justify-center space-x-1 ${
                calorieTrend > 0 ? 'text-blue-600' : 'text-gray-600'
              }`}>
                <TrendingUp size={12} />
                <span>{Math.abs(calorieTrend).toFixed(1)}% vs yesterday</span>
              </div>
            </div>

            {/* Exercise Streak */}
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {latestStats.exercise}min
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Exercise Today</div>
              <div className={`text-xs mt-1 flex items-center justify-center space-x-1 ${
                exerciseTrend > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {exerciseTrend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{Math.abs(exerciseTrend).toFixed(1)}% vs yesterday</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calendar className="text-blue-500" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Weekly Trends</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Calories Chart */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Calories</span>
                <span className="text-sm text-gray-500">Target: {userGoals.calories}</span>
              </div>
              <div className="flex items-end space-x-1 h-20">
                {stats.slice(0, 7).reverse().map((stat, index) => {
                  const height = (stat.calories / userGoals.calories) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full rounded-t ${
                          stat.calories <= userGoals.calories ? 'bg-emerald-400' : 'bg-yellow-400'
                        } transition-all duration-300`}
                        style={{ height: `${Math.min(height, 100)}%` }}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(stat.date).getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise Chart */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Exercise Minutes</span>
                <span className="text-sm text-gray-500">Target: {userGoals.exercise} min</span>
              </div>
              <div className="flex items-end space-x-1 h-20">
                {stats.slice(0, 7).reverse().map((stat, index) => {
                  const height = (stat.exercise / userGoals.exercise) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full rounded-t ${
                          stat.exercise >= userGoals.exercise ? 'bg-purple-400' : 'bg-gray-300'
                        } transition-all duration-300`}
                        style={{ height: `${Math.min(height, 100)}%` }}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(stat.date).getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Award className="text-yellow-500" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Achievements</h3>
          </div>
        </CardHeader>
        <CardContent>
          {/* Earned Achievements */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Earned Achievements ({earnedAchievements.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {earnedAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 dark:text-white">{achievement.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                    {achievement.earnedDate && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        Earned {achievement.earnedDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Achievements */}
          {inProgressAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                In Progress
              </h4>
              <div className="space-y-3">
                {inProgressAchievements.map((achievement) => (
                  <div key={achievement.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-2xl opacity-50">{achievement.icon}</div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-white">{achievement.title}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                    <ProgressBar
                      value={achievement.progress}
                      max={achievement.target}
                      color="yellow"
                      showLabel
                      label="Progress"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}