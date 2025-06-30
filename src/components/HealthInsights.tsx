import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { LoadingScreen } from './LoadingScreen';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Brain,
  Heart,
  Activity,
  Zap,
  RefreshCw,
  Calendar,
  BarChart3
} from 'lucide-react';
import { HealthInsight } from '../types';
import { mockAIInsights } from '../data/aiInsights';

export function HealthInsights() {
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'nutrition' | 'fitness' | 'wellness'>('all');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use mock data for now
      setInsights(mockAIInsights);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setError(error instanceof Error ? error.message : 'Failed to load insights');
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="text-green-500" size={24} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={24} />;
      case 'prediction': return <TrendingUp className="text-blue-500" size={24} />;
      case 'recommendation': return <Lightbulb className="text-purple-500" size={24} />;
      default: return <Brain className="text-gray-500" size={24} />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'prediction': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      case 'recommendation': return 'border-purple-200 bg-purple-50 dark:bg-purple-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-700';
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

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[impact as keyof typeof colors] || colors.low}`}>
        {impact} impact
      </span>
    );
  };

  const filteredInsights = activeFilter === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === activeFilter);

  const insightStats = {
    total: insights.length,
    positive: insights.filter(i => i.type === 'positive').length,
    warnings: insights.filter(i => i.type === 'warning').length,
    actionable: insights.filter(i => i.actionable).length
  };

  if (isLoading) {
    return <LoadingScreen message="Analyzing your health data..." fullScreen={false} />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto text-red-400 mb-4" size={48} />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Unable to Load Insights
              </h4>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
              <Button onClick={fetchInsights}>
                <RefreshCw size={16} className="mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="text-purple-500" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Health Insights</h3>
            </div>
            <Button size="sm" onClick={fetchInsights} disabled={isLoading}>
              <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Insights Summary */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Insights Overview</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{insightStats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Insights</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{insightStats.positive}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Positive</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{insightStats.warnings}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Warnings</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{insightStats.actionable}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Actionable</div>
            </div>
          </div>
        </CardContent>
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
            ].map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Insights Available
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  {activeFilter === 'all' 
                    ? 'Start logging your health data to receive personalized AI insights.'
                    : `No ${activeFilter} insights available. Try logging more ${activeFilter} data.`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredInsights.map((insight) => (
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
                          {getImpactBadge(insight.priority)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {insight.message}
                    </p>
                    
                    {insight.actionable && (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Zap size={14} className="mr-1" />
                          {insight.action || 'Take Action'}
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
          ))
        )}
      </div>
    </div>
  );
}