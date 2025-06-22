import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  Target,
  Brain,
  Zap,
  Calendar,
  Filter
} from 'lucide-react';
import { DailyStats, HealthCorrelation, User } from '../types';

interface AdvancedAnalyticsProps {
  stats: DailyStats[];
  user: User;
}

export function AdvancedAnalytics({ stats, user }: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'calories' | 'weight' | 'exercise' | 'water'>('calories');

  // Mock correlations data
  const correlations: HealthCorrelation[] = [
    {
      id: '1',
      metric1: 'Exercise Duration',
      metric2: 'Sleep Quality',
      correlation: 0.78,
      strength: 'strong',
      insight: 'Higher exercise duration strongly correlates with better sleep quality',
      recommendation: 'Maintain 45+ minutes of daily exercise for optimal sleep'
    },
    {
      id: '2',
      metric1: 'Water Intake',
      metric2: 'Energy Levels',
      correlation: 0.65,
      strength: 'moderate',
      insight: 'Adequate hydration moderately improves energy levels throughout the day',
      recommendation: 'Aim for 8+ glasses daily, especially before 3 PM'
    },
    {
      id: '3',
      metric1: 'Protein Intake',
      metric2: 'Muscle Recovery',
      correlation: 0.82,
      strength: 'strong',
      insight: 'Higher protein intake significantly improves muscle recovery after workouts',
      recommendation: 'Target 1.6-2.2g protein per kg body weight on training days'
    }
  ];

  // Calculate trends
  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const previous = data.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;
    return ((recent - previous) / previous) * 100;
  };

  const getMetricData = (metric: string) => {
    return stats.map(stat => {
      switch (metric) {
        case 'calories': return stat.calories;
        case 'weight': return stat.weight || 0;
        case 'exercise': return stat.exercise;
        case 'water': return stat.water;
        default: return 0;
      }
    });
  };

  const caloriesTrend = calculateTrend(getMetricData('calories'));
  const weightTrend = calculateTrend(getMetricData('weight'));
  const exerciseTrend = calculateTrend(getMetricData('exercise'));
  const waterTrend = calculateTrend(getMetricData('water'));

  // Predictive insights
  const generatePredictions = () => {
    const weightData = getMetricData('weight').filter(w => w > 0);
    const avgWeightLoss = weightData.length > 1 ? 
      (weightData[0] - weightData[weightData.length - 1]) / weightData.length : 0;
    
    const weeksToGoal = avgWeightLoss > 0 ? 
      Math.ceil((user.weight - user.goals.weight) / avgWeightLoss) : null;

    return {
      weightGoal: weeksToGoal,
      calorieConsistency: Math.round((stats.filter(s => Math.abs(s.calories - user.goals.calories) < 200).length / stats.length) * 100),
      exerciseStreak: stats.filter(s => s.exercise >= user.goals.exercise).length
    };
  };

  const predictions = generatePredictions();

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'text-green-500';
    if (abs >= 0.4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.4) return 'Moderate';
    return 'Weak';
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Advanced Analytics</h3>
            <div className="flex space-x-2">
              {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={timeRange === range ? 'primary' : 'ghost'}
                  onClick={() => setTimeRange(range)}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="text-blue-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Trend Analysis</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Target className="text-emerald-500" size={20} />
                <span className="font-medium">Calories</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">{Math.round(stats[0]?.calories || 0)}</div>
              <div className={`text-sm flex items-center justify-center space-x-1 ${
                caloriesTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {caloriesTrend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(caloriesTrend).toFixed(1)}%</span>
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Activity className="text-blue-500" size={20} />
                <span className="font-medium">Weight</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{user.weight}kg</div>
              <div className={`text-sm flex items-center justify-center space-x-1 ${
                weightTrend <= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {weightTrend <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                <span>{Math.abs(weightTrend).toFixed(1)}%</span>
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Zap className="text-purple-500" size={20} />
                <span className="font-medium">Exercise</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats[0]?.exercise || 0}min</div>
              <div className={`text-sm flex items-center justify-center space-x-1 ${
                exerciseTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {exerciseTrend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(exerciseTrend).toFixed(1)}%</span>
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Calendar className="text-cyan-500" size={20} />
                <span className="font-medium">Water</span>
              </div>
              <div className="text-2xl font-bold text-cyan-600">{stats[0]?.water || 0}</div>
              <div className={`text-sm flex items-center justify-center space-x-1 ${
                waterTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {waterTrend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{Math.abs(waterTrend).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="text-purple-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Predictive Insights</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Weight Goal Forecast</h4>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {predictions.weightGoal ? `${predictions.weightGoal} weeks` : 'On track'}
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Based on current progress rate
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Calorie Consistency</h4>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {predictions.calorieConsistency}%
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Days within target range
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Exercise Streak</h4>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {predictions.exerciseStreak} days
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Meeting exercise goals
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Correlations */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <PieChart className="text-orange-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Health Correlations</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {correlations.map((correlation) => (
              <div key={correlation.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {correlation.metric1} ↔ {correlation.metric2}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {correlation.insight}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getCorrelationColor(correlation.correlation)}`}>
                      {(correlation.correlation * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {getCorrelationStrength(correlation.correlation)}
                    </div>
                  </div>
                </div>
                
                <Progress
                  value={Math.abs(correlation.correlation) * 100}
                  max={100}
                  color={correlation.correlation >= 0.7 ? 'emerald' : correlation.correlation >= 0.4 ? 'yellow' : 'red'}
                  className="mb-2"
                />
                
                {correlation.recommendation && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Recommendation:</strong> {correlation.recommendation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Visualization Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="text-emerald-500" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Interactive Charts</h3>
            </div>
            <div className="flex space-x-2">
              {(['calories', 'weight', 'exercise', 'water'] as const).map((metric) => (
                <Button
                  key={metric}
                  size="sm"
                  variant={selectedMetric === metric ? 'primary' : 'ghost'}
                  onClick={() => setSelectedMetric(metric)}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
            <BarChart3 className="mx-auto text-gray-400 mb-4" size={64} />
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
              Interactive {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Chart
            </h4>
            <p className="text-gray-500 dark:text-gray-500">
              Advanced visualization showing {timeRange} trends, patterns, and predictions
            </p>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }, (_, i) => {
                const height = Math.random() * 60 + 20;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-emerald-400 rounded-t"
                      style={{ height: `${height}px` }}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}