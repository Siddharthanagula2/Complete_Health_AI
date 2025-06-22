import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { 
  Users, 
  Trophy, 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus,
  Crown,
  Target,
  Calendar,
  Zap,
  Medal
} from 'lucide-react';
import { Friend, Challenge, User } from '../types';

interface SocialCommunityProps {
  user: User;
}

export function SocialCommunity({ user }: SocialCommunityProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'challenges' | 'leaderboard' | 'community'>('friends');

  // Mock friends data
  const friends: Friend[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      level: 5,
      points: 2340,
      streak: 12,
      isOnline: true,
      lastActive: new Date()
    },
    {
      id: '2',
      name: 'Mike Chen',
      level: 4,
      points: 1890,
      streak: 8,
      isOnline: false,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Emma Wilson',
      level: 6,
      points: 3120,
      streak: 15,
      isOnline: true,
      lastActive: new Date()
    },
    {
      id: '4',
      name: 'David Rodriguez',
      level: 3,
      points: 1456,
      streak: 5,
      isOnline: false,
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  // Mock challenges data
  const challenges: Challenge[] = [
    {
      id: '1',
      title: '10K Steps Daily',
      description: 'Walk 10,000 steps every day for a week',
      type: 'group',
      category: 'steps',
      target: 70000,
      duration: 7,
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      participants: ['1', '2', '3', user.id],
      rewards: {
        points: 500,
        badge: '🚶‍♂️'
      },
      isActive: true
    },
    {
      id: '2',
      title: 'Hydration Hero',
      description: 'Drink 8 glasses of water daily for 5 days',
      type: 'individual',
      category: 'water',
      target: 40,
      duration: 5,
      startDate: new Date(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      participants: [user.id],
      rewards: {
        points: 300,
        badge: '💧'
      },
      isActive: true
    },
    {
      id: '3',
      title: 'Workout Warrior',
      description: 'Complete 45 minutes of exercise daily',
      type: 'group',
      category: 'exercise',
      target: 315,
      duration: 7,
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      participants: ['1', '3', user.id],
      rewards: {
        points: 750,
        badge: '💪'
      },
      isActive: false
    }
  ];

  // Mock leaderboard data
  const leaderboard = [
    { id: '3', name: 'Emma Wilson', points: 3120, level: 6, streak: 15, rank: 1 },
    { id: user.id, name: user.name, points: user.points, level: user.level, streak: user.streak, rank: 2 },
    { id: '1', name: 'Sarah Johnson', points: 2340, level: 5, streak: 12, rank: 3 },
    { id: '2', name: 'Mike Chen', points: 1890, level: 4, streak: 8, rank: 4 },
    { id: '4', name: 'David Rodriguez', points: 1456, level: 3, streak: 5, rank: 5 }
  ];

  const getChallengeProgress = (challenge: Challenge) => {
    // Mock progress calculation
    const daysElapsed = Math.floor((Date.now() - challenge.startDate.getTime()) / (24 * 60 * 60 * 1000));
    const progressPerDay = challenge.target / challenge.duration;
    return Math.min(daysElapsed * progressPerDay * (0.8 + Math.random() * 0.4), challenge.target);
  };

  const formatTimeRemaining = (endDate: Date) => {
    const diff = endDate.getTime() - Date.now();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const renderFriends = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900 dark:text-white">Friends ({friends.length})</h4>
        <Button size="sm">
          <Plus size={16} className="mr-1" />
          Add Friend
        </Button>
      </div>
      
      {friends.map((friend) => (
        <div key={friend.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{friend.name.charAt(0)}</span>
              </div>
              {friend.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">{friend.name}</h5>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <span>Level {friend.level}</span>
                <span>•</span>
                <span>{friend.points} points</span>
                <span>•</span>
                <span>{friend.streak} day streak</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost">
              <MessageCircle size={16} />
            </Button>
            <Button size="sm" variant="ghost">
              <Trophy size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900 dark:text-white">Active Challenges</h4>
        <Button size="sm">
          <Plus size={16} className="mr-1" />
          Create Challenge
        </Button>
      </div>
      
      {challenges.map((challenge) => {
        const progress = getChallengeProgress(challenge);
        const isActive = challenge.isActive && new Date() <= challenge.endDate;
        
        return (
          <div key={challenge.id} className={`p-4 rounded-lg border-2 ${
            isActive ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-700'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{challenge.rewards.badge}</div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">{challenge.title}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Users size={12} />
                      <span>{challenge.participants.length} participants</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{challenge.duration} days</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Trophy size={12} />
                      <span>{challenge.rewards.points} points</span>
                    </span>
                  </div>
                </div>
              </div>
              {isActive && (
                <div className="text-right">
                  <div className="text-sm font-medium text-emerald-600">
                    {formatTimeRemaining(challenge.endDate)} left
                  </div>
                </div>
              )}
            </div>
            
            <Progress
              value={progress}
              max={challenge.target}
              color={isActive ? 'emerald' : 'gray'}
              showLabel
              label={`Progress: ${Math.round(progress)}/${challenge.target}`}
              className="mb-3"
            />
            
            <div className="flex justify-between items-center">
              <span className={`text-sm px-2 py-1 rounded-full ${
                challenge.type === 'group' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
              }`}>
                {challenge.type === 'group' ? 'Group Challenge' : 'Personal Challenge'}
              </span>
              
              {!isActive && new Date() < challenge.startDate ? (
                <Button size="sm" variant="secondary">Join Challenge</Button>
              ) : isActive ? (
                <Button size="sm" variant="success">Active</Button>
              ) : (
                <span className="text-sm text-gray-500">Completed</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 dark:text-white">Weekly Leaderboard</h4>
      
      {leaderboard.map((person, index) => (
        <div key={person.id} className={`flex items-center justify-between p-4 rounded-lg ${
          person.id === user.id 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800'
            : 'bg-gray-50 dark:bg-gray-700'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              index === 0 ? 'bg-yellow-500 text-white' :
              index === 1 ? 'bg-gray-400 text-white' :
              index === 2 ? 'bg-orange-500 text-white' :
              'bg-gray-200 text-gray-700'
            }`}>
              {index < 3 ? (
                index === 0 ? <Crown size={16} /> :
                index === 1 ? <Medal size={16} /> :
                <Medal size={16} />
              ) : (
                person.rank
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{person.name.charAt(0)}</span>
              </div>
              <div>
                <h5 className={`font-medium ${person.id === user.id ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-white'}`}>
                  {person.name} {person.id === user.id && '(You)'}
                </h5>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <span>Level {person.level}</span>
                  <span>•</span>
                  <span>{person.streak} day streak</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-600">{person.points}</div>
            <div className="text-xs text-gray-500">points</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 dark:text-white">Community Feed</h4>
      
      {/* Mock community posts */}
      {[
        {
          id: '1',
          user: 'Sarah Johnson',
          action: 'completed a 5K run',
          time: '2 hours ago',
          likes: 12,
          comments: 3
        },
        {
          id: '2',
          user: 'Mike Chen',
          action: 'reached their water goal for 7 days straight',
          time: '4 hours ago',
          likes: 8,
          comments: 1
        },
        {
          id: '3',
          user: 'Emma Wilson',
          action: 'earned the "Consistency King" badge',
          time: '1 day ago',
          likes: 15,
          comments: 5
        }
      ].map((post) => (
        <div key={post.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{post.user.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white">
                <span className="font-medium">{post.user}</span> {post.action}
              </p>
              <p className="text-sm text-gray-500 mt-1">{post.time}</p>
              
              <div className="flex items-center space-x-4 mt-3">
                <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-500">
                  <Heart size={16} />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500">
                  <MessageCircle size={16} />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-green-500">
                  <Share2 size={16} />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'friends', label: 'Friends', icon: Users },
              { id: 'challenges', label: 'Challenges', icon: Target },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'community', label: 'Community', icon: MessageCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
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

      {/* Tab Content */}
      <Card>
        <CardContent className="pt-6">
          {activeTab === 'friends' && renderFriends()}
          {activeTab === 'challenges' && renderChallenges()}
          {activeTab === 'leaderboard' && renderLeaderboard()}
          {activeTab === 'community' && renderCommunity()}
        </CardContent>
      </Card>
    </div>
  );
}