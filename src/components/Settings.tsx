import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  Download, 
  Upload,
  Trash2,
  HelpCircle,
  Mail,
  Smartphone,
  Wifi
} from 'lucide-react';
import { User } from '../types';
import { Integrations } from './Integrations';

interface SettingsProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

export function Settings({ user, onUpdateUser }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'data' | 'integrations'>('general');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    mealReminders: true,
    waterReminders: true,
    exerciseReminders: true,
    weeklyReports: true,
    achievements: true,
    socialUpdates: false
  });

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Appearance</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Moon className="text-indigo-500" size={20} />
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Switch to dark theme</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Language & Region</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="text-blue-500" size={20} />
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Language</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">English (US)</p>
              </div>
            </div>
            <Button size="sm" variant="ghost">Change</Button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Units</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weight
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option>Kilograms (kg)</option>
              <option>Pounds (lbs)</option>
            </select>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Distance
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option>Kilometers (km)</option>
              <option>Miles (mi)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Push Notifications</h4>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="text-blue-500" size={20} />
                <div>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {key === 'mealReminders' && 'Get reminded to log your meals'}
                    {key === 'waterReminders' && 'Stay hydrated with water reminders'}
                    {key === 'exerciseReminders' && 'Never miss your workout'}
                    {key === 'weeklyReports' && 'Receive weekly progress summaries'}
                    {key === 'achievements' && 'Celebrate your accomplishments'}
                    {key === 'socialUpdates' && 'Updates from friends and challenges'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-emerald-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Notification Schedule</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quiet Hours Start
            </label>
            <input
              type="time"
              defaultValue="22:00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quiet Hours End
            </label>
            <input
              type="time"
              defaultValue="07:00"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Data Sharing</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="text-green-500" size={20} />
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Share Anonymous Analytics</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Help improve the app with anonymous usage data</p>
              </div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="text-yellow-500" size={20} />
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Share with Healthcare Providers</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Allow authorized healthcare providers to access your data</p>
              </div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Account Security</h4>
        <div className="space-y-3">
          <Button variant="ghost" className="w-full justify-start">
            <Shield className="mr-3" size={20} />
            Change Password
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Smartphone className="mr-3" size={20} />
            Two-Factor Authentication
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Mail className="mr-3" size={20} />
            Update Email Address
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Data Management</h4>
        <div className="space-y-3">
          <Button variant="ghost" className="w-full justify-start">
            <Download className="mr-3 text-blue-500" size={20} />
            Export My Data
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Upload className="mr-3 text-green-500" size={20} />
            Import Data
          </Button>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Storage</h4>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Local Storage Used</span>
            <span className="font-medium text-gray-900 dark:text-white">2.4 MB</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '15%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">15% of available storage</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Danger Zone</h4>
        <div className="space-y-3">
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50">
            <Trash2 className="mr-3" size={20} />
            Clear All Data
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50">
            <Trash2 className="mr-3" size={20} />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="text-gray-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
          </div>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'general', label: 'General', icon: SettingsIcon },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'privacy', label: 'Privacy', icon: Shield },
              { id: 'data', label: 'Data', icon: Download },
              { id: 'integrations', label: 'Integrations', icon: Wifi }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      <Card>
        <CardContent className="pt-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'privacy' && renderPrivacySettings()}
          {activeTab === 'data' && renderDataSettings()}
          {activeTab === 'integrations' && <Integrations />}
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Help & Support</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="mr-3 text-blue-500" size={20} />
              Help Center
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Mail className="mr-3 text-green-500" size={20} />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Complete Health v1.0.0</p>
            <p>© 2024 Complete Health. All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}