import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { 
  Trophy, 
  Award, 
  Star, 
  Target, 
  Zap, 
  Crown, 
  Medal,
  Lock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Flame
} from 'lucide-react';
import { Achievement } from '../types';
import { mockAchievements } from '../data/mockData';

export function Achievements() {
  const [activeTab, setActiveTab] = useState<'earned' | 'progress' | 'locked'>('earned');

  const earnedAchievements = mockAchievements.filter(a => a.earned);
  const inProgressAchievements = mockAchievements.filter(a => !a.earned && a.progress > 0);
  const lockedAchievements = mockAchievements.filter(a => !a.earned && a.progress === 0);

  const totalPoints = earnedAchievements.length * 100; // 100 points per achievement
  const completionRate = Math.round((earnedAchievements.length / mockAchievements.length) * 100);

  const getAchievementIcon = (achievement: Achievement) => {
    if (achievement.earned) {
      return <div className="text-3xl">{achievement.icon}</div>;
    } else if (achievement.progress > 0) {
      return <div className="text-3xl opacity-60">{achievement.icon}</div>;
    } else {
      return <Lock className="text-gray-400" size={24} />;
    }
  };

  const getAchievementBorder = (achievement: Achievement) => {
    if (achievement.earned) {
      return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20';
    } else if (achievement.progress > 0) {
      return 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20';
    } else {
      return 'border-gray-200 bg-gray-50 dark:bg-gray-700';
    }
  };

  const renderAchievements = (achievements: Achievement[]) => {
    if (achievements.length === 0) {
      const emptyMessages = {
        earned: 'No achievements earned yet. Start logging your health data to unlock your first achievement!',
        progress: 'No achievements in progress. Keep using the app to start working toward new goals!',
        locked: 'All achievements are either earned or in progress. Great job!'
      };

      return (
        <div className="text-center py-8">
          <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400">
            {emptyMessages[activeTab]}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={`border-2 ${getAchievementBorder(achievement)}`}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getAchievementIcon(achievement)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                        <span>{achievement.title}</span>
                        {achievement.earned && <CheckCircle className="text-green-500" size={16} />}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  
                  {achievement.earned ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="text-yellow-500" size={16} />
                        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                          Completed
                        </span>
                      </div>
                      {achievement.earnedDate && (
                        <span className="text-xs text-gray-500">
                          {achievement.earnedDate.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {achievement.progress} / {achievement.target}
                        </span>
                      </div>
                      <Progress
                        value={achievement.progress}
                        max={achievement.target}
                        color={achievement.progress > 0 ? 'blue' : 'gray'}
                        className="h-2"
                      />
                      <div className="text-xs text-gray-500">
                        {Math.round((achievement.progress / achievement.target) * 100)}% complete
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Trophy className="text-yellow-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Achievements & Badges</h3>
          </div>
        </CardHeader>
      </Card>

      {/* Achievement Stats */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Your Progress</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{earnedAchievements.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Earned</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{inProgressAchievements.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Overall Achievement Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {earnedAchievements.length} / {mockAchievements.length}
              </span>
            </div>
            <Progress
              value={earnedAchievements.length}
              max={mockAchievements.length}
              color="yellow"
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievement */}
      {earnedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Medal className="text-gold-500" size={20} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Latest Achievement</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="text-4xl">{earnedAchievements[earnedAchievements.length - 1].icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {earnedAchievements[earnedAchievements.length - 1].title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {earnedAchievements[earnedAchievements.length - 1].description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Calendar size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-500">
                    Earned {earnedAchievements[earnedAchievements.length - 1].earnedDate?.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">+100</div>
                <div className="text-xs text-gray-500">Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'earned', label: `Earned (${earnedAchievements.length})`, icon: Trophy },
              { id: 'progress', label: `In Progress (${inProgressAchievements.length})`, icon: TrendingUp },
              { id: 'locked', label: `Locked (${lockedAchievements.length})`, icon: Lock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-600 text-yellow-600 dark:text-yellow-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements List */}
      <Card>
        <CardContent className="pt-6">
          {activeTab === 'earned' && renderAchievements(earnedAchievements)}
          {activeTab === 'progress' && renderAchievements(inProgressAchievements)}
          {activeTab === 'locked' && renderAchievements(lockedAchievements)}
        </CardContent>
      </Card>

      {/* Achievement Tips */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Flame className="text-orange-500" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Tips for Earning Achievements</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Target className="text-emerald-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Consistency is Key</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Log your data daily to build streaks and unlock consistency-based achievements.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Zap className="text-blue-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Try New Activities</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explore different types of exercises and foods to unlock variety achievements.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Crown className="text-purple-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Set Personal Records</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Challenge yourself to beat your previous bests in exercise and nutrition.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Star className="text-yellow-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Complete Challenges</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Participate in community challenges to earn special achievement badges.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}