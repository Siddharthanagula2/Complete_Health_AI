import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Brain,
  Heart,
  Activity,
  Zap
} from 'lucide-react';
import { User, DailyStats, HealthInsight } from '../types';

interface HealthInsightsProps {
  user: User;
  stats: DailyStats[];
}

export function HealthInsights({ user, stats }: HealthInsightsProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'nutrition' | 'fitness' | 'wellness'>('all');

  // Generate health insights based on user data
  const generateInsights = (): HealthInsight[] => {
    const insights: HealthInsight[] = [];
    
    // Calorie consistency insight
    const recentCalories = stats.slice(0, 7).map(s => s.calories);
    const avgCalories = recentCalories.reduce((a, b) => a + b, 0) / recentCalories.length;
    const calorieVariance = recentCalories.reduce((sum, cal) => sum + Math.pow(cal - avgCalories, 2), 0) / recentCalories.length;
    
    if (calorieVariance < 10000) {
      insights.push({
        id: '1',
        type: 'positive',
        category: 'nutrition',
        title: 'Excellent Calorie Consistency',
        description: 'Your calorie intake has been very consistent over the past week, which is great for maintaining steady energy levels.',
        impact: 'high',
        actionable: true,
        recommendation: 'Keep up this consistent pattern to support your metabolism and energy levels.',
        dataPoints: [`Average: ${Math.round(avgCalories)} calories`, `Variance: Low`],
        timestamp: new Date()
      });
    }

    // Exercise trend insight
    const recentExercise = stats.slice(0, 7).map(s => s.exercise);
    const exerciseTrend = recentExercise.slice(0, 3).reduce((a, b) => a + b, 0) - recentExercise.slice(4, 7).reduce((a, b) => a + b, 0);
    
    if (exerciseTrend > 30) {
      insights.push({
        id: '2',
        type: 'positive',
        category: 'fitness',
        title: 'Increasing Exercise Activity',
        description: 'Your exercise duration has increased significantly this week compared to last week.',
        impact: 'high',
        actionable: true,
        recommendation: 'Great progress! Consider adding variety to your workouts to prevent plateaus.',
        dataPoints: [`Increase: +${Math.round(exerciseTrend)} minutes`, `Current average: ${Math.round(recentExercise.slice(0, 3).reduce((a, b) => a + b, 0) / 3)} min/day`],
        timestamp: new Date()
      });
    }

    // Hydration insight
    const recentWater = stats.slice(0, 7).map(s => s.water);
    const avgWater = recentWater.reduce((a, b) => a + b, 0) / recentWater.length;
    
    if (avgWater < user.goals.water * 0.8) {
      insights.push({
        id: '3',
        type: 'warning',
        category: 'wellness',
        title: 'Hydration Below Target',
        description: 'Your water intake has been consistently below your daily goal this week.',
        impact: 'medium',
        actionable: true,
        recommendation: 'Set hourly reminders to drink water, and keep a water bottle visible throughout the day.',
        dataPoints: [`Average: ${avgWater.toFixed(1)} glasses`, `Goal: ${user.goals.water} glasses`, `Achievement: ${Math.round((avgWater / user.goals.water) * 100)}%`],
        timestamp: new Date()
      });
    }

    // Sleep quality insight (mock data)
    insights.push({
      id: '4',
      type: 'neutral',
      category: 'wellness',
      title: 'Sleep Pattern Analysis',
      description: 'Your sleep duration varies significantly. Consistent sleep schedules can improve recovery and energy.',
      impact: 'medium',
      actionable: true,
      recommendation: 'Try to maintain a consistent bedtime and wake time, even on weekends.',
      dataPoints: ['Average: 7.2 hours', 'Variance: High', 'Quality: Good'],
      timestamp: new Date()
    });

    // Nutrition balance insight
    const recentProtein = stats.slice(0, 7).map(s => s.protein);
    const avgProtein = recentProtein.reduce((a, b) => a + b, 0) / recentProtein.length;
    const proteinPerKg = avgProtein / user.weight;
    
    if (proteinPerKg >= 1.6) {
      insights.push({
        id: '5',
        type: 'positive',
        category: 'nutrition',
        title: 'Optimal Protein Intake',
        description: 'Your protein intake is excellent for muscle maintenance and recovery.',
        impact: 'high',
        actionable: false,
        recommendation: 'Continue this protein intake pattern to support your fitness goals.',
        dataPoints: [`${proteinPerKg.toFixed(1)}g per kg body weight`, `Daily average: ${Math.round(avgProtein)}g`],
        timestamp: new Date()
      });
    }

    // Weight trend insight
    const recentWeights = stats.slice(0, 14).map(s => s.weight).filter(w => w);
    if (recentWeights.length >= 7) {
      const weightTrend = recentWeights.slice(0, 7).reduce((a, b) => a + b, 0) / 7 - 
                         recentWeights.slice(7, 14).reduce((a, b) => a + b, 0) / 7;
      
      if (Math.abs(weightTrend) > 0.5) {
        insights.push({
          id: '6',
          type: weightTrend < 0 ? 'positive' : 'warning',
          category: 'fitness',
          title: `Weight ${weightTrend < 0 ? 'Decrease' : 'Increase'} Detected`,
          description: `Your weight has ${weightTrend < 0 ? 'decreased' : 'increased'} by ${Math.abs(weightTrend).toFixed(1)}kg over the past two weeks.`,
          impact: 'high',
          actionable: true,
          recommendation: weightTrend < 0 ? 
            'Great progress! Ensure you\'re maintaining adequate nutrition for sustainable weight loss.' :
            'Consider reviewing your calorie intake and exercise routine to align with your goals.',
          dataPoints: [`Change: ${weightTrend > 0 ? '+' : ''}${weightTrend.toFixed(1)}kg`, `Current: ${user.weight}kg`, `Goal: ${user.goals.weight}kg`],
          timestamp: new Date()
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();
  const filteredInsights = activeCategory === 'all' ? insights : insights.filter(i => i.category === activeCategory);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="text-green-500" size={24} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={24} />;
      case 'negative': return <TrendingDown className="text-red-500" size={24} />;
      default: return <Lightbulb className="text-blue-500" size={24} />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'negative': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      default: return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return <Target className="text-emerald-500" size={16} />;
      case 'fitness': return <Activity className="text-blue-500" size={16} />;
      case 'wellness': return <Heart className="text-pink-500" size={16} />;
      default: return <Brain className="text-purple-500" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lightbulb className="text-yellow-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Health Insights</h3>
          </div>
        </CardHeader>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'all', label: 'All Insights', icon: Brain },
              { id: 'nutrition', label: 'Nutrition', icon: Target },
              { id: 'fitness', label: 'Fitness', icon: Activity },
              { id: 'wellness', label: 'Wellness', icon: Heart }
            ].map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                    activeCategory === category.id
                      ? 'bg-white dark:bg-gray-600 text-yellow-600 dark:text-yellow-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights Summary */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Insights Summary</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {insights.filter(i => i.type === 'positive').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Positive</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {insights.filter(i => i.type === 'warning').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Warnings</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {insights.filter(i => i.actionable).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Actionable</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {insights.filter(i => i.impact === 'high').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">High Impact</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <Card key={insight.id} className={`border-l-4 ${getInsightColor(insight.type)}`}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {getCategoryIcon(insight.category)}
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {insight.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {insight.impact} impact
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {insight.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {insight.description}
                  </p>
                  
                  {insight.dataPoints && insight.dataPoints.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Data:</h5>
                      <div className="flex flex-wrap gap-2">
                        {insight.dataPoints.map((point, index) => (
                          <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {insight.recommendation && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mb-3">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        💡 Recommendation:
                      </h5>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {insight.recommendation}
                      </p>
                    </div>
                  )}
                  
                  {insight.actionable && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">
                        <Zap size={14} className="mr-1" />
                        Take Action
                      </Button>
                      <Button size="sm" variant="ghost">
                        Learn More
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInsights.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Lightbulb className="mx-auto text-gray-400 mb-4" size={48} />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No insights available
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                Keep logging your health data to receive personalized insights.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}