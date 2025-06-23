import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { 
  Users, 
  Plus, 
  Heart, 
  Activity, 
  Moon, 
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  Settings,
  Bell,
  Shield,
  Crown,
  Award
} from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  avatar: string;
  isActive: boolean;
  lastActive: Date;
  healthScore: number;
  todayStats: {
    steps: number;
    calories: number;
    exercise: number;
    sleep: number;
    water: number;
  };
  goals: {
    steps: number;
    calories: number;
    exercise: number;
    water: number;
  };
  alerts: number;
  streak: number;
}

export function FamilyDashboard() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  // Mock family members data
  const familyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'Sarah Nagula',
      relationship: 'Spouse',
      age: 26,
      avatar: '👩‍💼',
      isActive: true,
      lastActive: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      healthScore: 87,
      todayStats: {
        steps: 8420,
        calories: 1650,
        exercise: 45,
        sleep: 7.5,
        water: 7
      },
      goals: {
        steps: 10000,
        calories: 1800,
        exercise: 30,
        water: 8
      },
      alerts: 1,
      streak: 12
    },
    {
      id: '2',
      name: 'Raj Nagula',
      relationship: 'Father',
      age: 58,
      avatar: '👨‍💼',
      isActive: false,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      healthScore: 72,
      todayStats: {
        steps: 5200,
        calories: 1950,
        exercise: 20,
        sleep: 6.8,
        water: 5
      },
      goals: {
        steps: 8000,
        calories: 2000,
        exercise: 30,
        water: 8
      },
      alerts: 2,
      streak: 5
    },
    {
      id: '3',
      name: 'Priya Nagula',
      relationship: 'Mother',
      age: 54,
      avatar: '👩‍🍳',
      isActive: true,
      lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      healthScore: 91,
      todayStats: {
        steps: 9850,
        calories: 1520,
        exercise: 60,
        sleep: 8.2,
        water: 9
      },
      goals: {
        steps: 9000,
        calories: 1600,
        exercise: 45,
        water: 8
      },
      alerts: 0,
      streak: 18
    }
  ];

  const getHealthScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    if (score >= 70) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-500 bg-red-50 dark:bg-red-900/20';
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return 'emerald';
    if (percentage >= 80) return 'blue';
    if (percentage >= 60) return 'yellow';
    return 'red';
  };

  const calculateFamilyAverage = (metric: keyof FamilyMember['todayStats']) => {
    const total = familyMembers.reduce((sum, member) => sum + member.todayStats[metric], 0);
    return Math.round(total / familyMembers.length);
  };

  const renderMemberCard = (member: FamilyMember) => (
    <Card 
      key={member.id} 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selectedMember === member.id ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : ''
      }`}
      onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="text-3xl">{member.avatar}</div>
              {member.isActive && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{member.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{member.relationship} • {member.age} years</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`text-xs px-2 py-1 rounded-full font-medium ${getHealthScoreColor(member.healthScore)}`}>
                  Health Score: {member.healthScore}
                </div>
                {member.alerts > 0 && (
                  <div className="flex items-center space-x-1 text-orange-500">
                    <Bell size={12} />
                    <span className="text-xs">{member.alerts}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-orange-500 mb-1">
              <Award size={14} />
              <span className="text-sm font-medium">{member.streak} days</span>
            </div>
            <p className="text-xs text-gray-500">
              {member.isActive ? 'Active now' : `${Math.floor((Date.now() - member.lastActive.getTime()) / (1000 * 60))}m ago`}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{member.todayStats.steps.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Steps</div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-emerald-600">{member.todayStats.exercise}m</div>
            <div className="text-xs text-gray-500">Exercise</div>
          </div>
        </div>

        {/* Expanded Details */}
        {selectedMember === member.id && (
          <div className="space-y-3 border-t border-gray-200 dark:border-gray-600 pt-4">
            {/* Steps Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Steps</span>
                <span className="font-medium">{member.todayStats.steps.toLocaleString()} / {member.goals.steps.toLocaleString()}</span>
              </div>
              <Progress
                value={member.todayStats.steps}
                max={member.goals.steps}
                color={getProgressColor(member.todayStats.steps, member.goals.steps)}
                className="h-2"
              />
            </div>

            {/* Exercise Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Exercise</span>
                <span className="font-medium">{member.todayStats.exercise}m / {member.goals.exercise}m</span>
              </div>
              <Progress
                value={member.todayStats.exercise}
                max={member.goals.exercise}
                color={getProgressColor(member.todayStats.exercise, member.goals.exercise)}
                className="h-2"
              />
            </div>

            {/* Water Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Water</span>
                <span className="font-medium">{member.todayStats.water} / {member.goals.water} glasses</span>
              </div>
              <Progress
                value={member.todayStats.water}
                max={member.goals.water}
                color={getProgressColor(member.todayStats.water, member.goals.water)}
                className="h-2"
              />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{member.todayStats.sleep}h</div>
                <div className="text-xs text-gray-500">Sleep</div>
              </div>
              <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-lg font-bold text-orange-600">{member.todayStats.calories}</div>
                <div className="text-xs text-gray-500">Calories</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="text-emerald-500" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Family Health Dashboard</h3>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost">
                <Settings size={16} className="mr-1" />
                Manage
              </Button>
              <Button size="sm">
                <Plus size={16} className="mr-1" />
                Add Member
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Family Overview Stats */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Family Health Overview</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{calculateFamilyAverage('steps').toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Steps</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{calculateFamilyAverage('exercise')}m</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Exercise</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{calculateFamilyAverage('sleep').toFixed(1)}h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Sleep</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(familyMembers.reduce((sum, m) => sum + m.healthScore, 0) / familyMembers.length)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Health Score</div>
            </div>
          </div>

          {/* Family Leaderboard */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
              <Crown className="text-yellow-500" size={16} />
              <span>Today's Family Leaderboard</span>
            </h4>
            <div className="space-y-2">
              {familyMembers
                .sort((a, b) => b.healthScore - a.healthScore)
                .map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded">
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm">{member.avatar}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{member.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white">{member.healthScore}</div>
                      <div className="text-xs text-gray-500">Health Score</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.map(renderMemberCard)}
      </div>

      {/* Family Challenges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Active Family Challenges</h3>
            <Button size="sm" variant="ghost">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🏃‍♀️</div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Family Step Challenge</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reach 100,000 steps together this week</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-600">67,470 / 100,000</div>
                <div className="text-xs text-gray-500">67% complete</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💧</div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Hydration Heroes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Everyone drinks 8+ glasses daily for 7 days</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">Day 3 / 7</div>
                <div className="text-xs text-gray-500">On track!</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Sharing Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="text-green-500" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Privacy & Sharing</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Family Data Sharing</h4>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              Family members can only see basic health metrics (steps, exercise, sleep duration). 
              Detailed health data, medical records, and personal notes remain private.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost">
                <Settings size={14} className="mr-1" />
                Manage Permissions
              </Button>
              <Button size="sm" variant="ghost">
                Privacy Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}