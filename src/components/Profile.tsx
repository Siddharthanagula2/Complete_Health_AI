import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { User, Settings, Target, Trophy, Shield, Bell } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
  onUpdateUser: (updates: Partial<UserType>) => void;
}

export function Profile({ user, onUpdateUser }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    age: user.age,
    weight: user.weight,
    height: user.height,
    goals: { ...user.goals }
  });

  const handleSave = () => {
    onUpdateUser(editData);
    setIsEditing(false);
  };

  const levelProgress = (user.points % 1000) / 1000 * 100;
  const nextLevelPoints = Math.ceil(user.points / 1000) * 1000;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-1">
                  <Trophy className="text-yellow-500" size={16} />
                  <span className="text-sm font-medium">Level {user.level}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.points} / {nextLevelPoints} points
                  </span>
                </div>
              </div>
              
              <Progress
                value={user.points % 1000}
                max={1000}
                color="yellow"
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Current Stats</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{user.age}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{user.weight}kg</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Weight</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{user.height}cm</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Height</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {Math.round(user.weight / Math.pow(user.height / 100, 2))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">BMI</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="text-emerald-500" size={20} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Health Goals</h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Settings size={16} className="mr-1" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={editData.age}
                    onChange={(e) => setEditData({ ...editData, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={editData.weight}
                    onChange={(e) => setEditData({ ...editData, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={editData.height}
                    onChange={(e) => setEditData({ ...editData, height: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={editData.goals.weight}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      goals: { ...editData.goals, weight: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Daily Calories
                  </label>
                  <input
                    type="number"
                    value={editData.goals.calories}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      goals: { ...editData.goals, calories: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Water Goal (glasses)
                  </label>
                  <input
                    type="number"
                    value={editData.goals.water}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      goals: { ...editData.goals, water: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Exercise Goal (minutes)
                  </label>
                  <input
                    type="number"
                    value={editData.goals.exercise}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      goals: { ...editData.goals, exercise: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Target Weight</span>
                <span className="font-semibold text-gray-900 dark:text-white">{user.goals.weight}kg</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Daily Calories</span>
                <span className="font-semibold text-gray-900 dark:text-white">{user.goals.calories}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Water Goal</span>
                <span className="font-semibold text-gray-900 dark:text-white">{user.goals.water} glasses</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Exercise Goal</span>
                <span className="font-semibold text-gray-900 dark:text-white">{user.goals.exercise} min</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Settings className="text-gray-500" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="text-blue-500" size={20} />
                <span className="text-gray-700 dark:text-gray-300">Notifications</span>
              </div>
              <Button size="sm" variant="ghost">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="text-green-500" size={20} />
                <span className="text-gray-700 dark:text-gray-300">Privacy</span>
              </div>
              <Button size="sm" variant="ghost">Manage</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}