import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { 
  Smartphone, 
  Watch, 
  Activity, 
  Heart, 
  Wifi, 
  CheckCircle, 
  Plus, 
  Settings,
  Bluetooth,
  Cloud,
  Shield,
  Zap,
  RefreshCw
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  category: 'wearable' | 'app' | 'scale' | 'monitor';
  icon: React.ReactNode;
  description: string;
  isConnected: boolean;
  lastSync?: Date;
  dataTypes: string[];
  batteryLevel?: number;
  status: 'connected' | 'syncing' | 'error' | 'available';
}

export function Integrations() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'apple-health',
      name: 'Apple Health',
      category: 'app',
      icon: <Smartphone className="text-gray-800" size={24} />,
      description: 'Sync health data from your iPhone and Apple Watch',
      isConnected: true,
      lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Workouts'],
      status: 'connected'
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      category: 'app',
      icon: <Activity className="text-blue-500" size={24} />,
      description: 'Connect with Google Fit to sync your Android health data',
      isConnected: true,
      lastSync: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      dataTypes: ['Steps', 'Activities', 'Weight'],
      status: 'connected'
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      category: 'wearable',
      icon: <Watch className="text-teal-500" size={24} />,
      description: 'Track steps, heart rate, sleep, and more with Fitbit devices',
      isConnected: false,
      dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Exercise', 'Calories'],
      status: 'available'
    },
    {
      id: 'garmin',
      name: 'Garmin',
      category: 'wearable',
      icon: <Activity className="text-blue-600" size={24} />,
      description: 'Professional fitness tracking with Garmin Connect',
      isConnected: false,
      dataTypes: ['GPS Workouts', 'Heart Rate', 'VO2 Max', 'Training Load'],
      status: 'available'
    },
    {
      id: 'oura',
      name: 'Oura Ring',
      category: 'wearable',
      icon: <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
        <div className="w-3 h-3 border-2 border-white rounded-full"></div>
      </div>,
      description: 'Advanced sleep and recovery tracking with Oura Ring',
      isConnected: false,
      dataTypes: ['Sleep Stages', 'HRV', 'Body Temperature', 'Readiness'],
      status: 'available'
    },
    {
      id: 'whoop',
      name: 'WHOOP',
      category: 'wearable',
      icon: <Heart className="text-red-500" size={24} />,
      description: '24/7 health monitoring with WHOOP Strap',
      isConnected: false,
      dataTypes: ['Recovery', 'Strain', 'Sleep', 'HRV'],
      status: 'available'
    },
    {
      id: 'withings',
      name: 'Withings Scale',
      category: 'scale',
      icon: <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
        <div className="w-4 h-1 bg-white rounded"></div>
      </div>,
      description: 'Smart body composition scale with WiFi sync',
      isConnected: false,
      dataTypes: ['Weight', 'Body Fat', 'Muscle Mass', 'BMI'],
      status: 'available'
    },
    {
      id: 'omron',
      name: 'Omron Blood Pressure',
      category: 'monitor',
      icon: <Heart className="text-red-600" size={24} />,
      description: 'Bluetooth blood pressure monitor',
      isConnected: false,
      dataTypes: ['Blood Pressure', 'Heart Rate'],
      status: 'available'
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<'all' | 'wearable' | 'app' | 'scale' | 'monitor'>('all');

  const handleConnect = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            isConnected: true, 
            status: 'syncing' as const,
            lastSync: new Date()
          }
        : device
    ));

    // Simulate connection process
    setTimeout(() => {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'connected' as const }
          : device
      ));
    }, 2000);
  };

  const handleDisconnect = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            isConnected: false, 
            status: 'available' as const,
            lastSync: undefined
          }
        : device
    ));
  };

  const handleSync = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            status: 'syncing' as const
          }
        : device
    ));

    setTimeout(() => {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              status: 'connected' as const,
              lastSync: new Date()
            }
          : device
      ));
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="text-green-500" size={16} />;
      case 'syncing': return <RefreshCw className="text-blue-500 animate-spin" size={16} />;
      case 'error': return <div className="w-4 h-4 bg-red-500 rounded-full"></div>;
      default: return <Plus className="text-gray-400" size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'syncing': return 'Syncing...';
      case 'error': return 'Error';
      default: return 'Available';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'syncing': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const filteredDevices = activeCategory === 'all' 
    ? devices 
    : devices.filter(device => device.category === activeCategory);

  const connectedDevices = devices.filter(d => d.isConnected);
  const availableDevices = devices.filter(d => !d.isConnected);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Wifi className="text-blue-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Device Integrations</h3>
          </div>
        </CardHeader>
      </Card>

      {/* Integration Stats */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Connection Overview</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{connectedDevices.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Connected</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{availableDevices.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {connectedDevices.reduce((sum, device) => sum + device.dataTypes.length, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Data Types</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {connectedDevices.filter(d => d.lastSync && Date.now() - d.lastSync.getTime() < 30 * 60 * 1000).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Recently Synced</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'all', label: 'All Devices', icon: Wifi },
              { id: 'wearable', label: 'Wearables', icon: Watch },
              { id: 'app', label: 'Health Apps', icon: Smartphone },
              { id: 'scale', label: 'Smart Scales', icon: Activity },
              { id: 'monitor', label: 'Monitors', icon: Heart }
            ].map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                    activeCategory === category.id
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium hidden sm:inline">{category.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device) => (
          <Card key={device.id} className={`border-2 ${
            device.isConnected 
              ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
              : 'border-gray-200 hover:border-blue-300 transition-colors'
          }`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {device.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{device.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(device.status)}
                      <span className={`text-sm ${getStatusColor(device.status)}`}>
                        {getStatusText(device.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {device.description}
              </p>

              {/* Data Types */}
              <div className="mb-4">
                <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Data Types:</h5>
                <div className="flex flex-wrap gap-1">
                  {device.dataTypes.map((type) => (
                    <span key={type} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Last Sync */}
              {device.lastSync && (
                <div className="mb-4 text-xs text-gray-500">
                  Last sync: {device.lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {device.isConnected ? (
                  <>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleSync(device.id)}
                      disabled={device.status === 'syncing'}
                      className="flex-1"
                    >
                      <RefreshCw size={14} className={`mr-1 ${device.status === 'syncing' ? 'animate-spin' : ''}`} />
                      Sync
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDisconnect(device.id)}
                    >
                      <Settings size={14} />
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => handleConnect(device.id)}
                    className="w-full"
                    disabled={device.status === 'syncing'}
                  >
                    <Plus size={14} className="mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Benefits */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Zap className="text-yellow-500" size={20} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Why Connect Your Devices?</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Cloud className="text-blue-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Automatic Data Sync</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your health data syncs automatically in the background, so you never miss a day of tracking.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BarChart3 className="text-green-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Comprehensive Insights</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get deeper insights by combining data from multiple sources for a complete health picture.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="text-purple-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Secure & Private</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All data is encrypted and stored securely. You control what data is shared and with whom.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Bluetooth className="text-indigo-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Easy Setup</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  One-time setup with OAuth authentication. No need to manually enter credentials.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Shield className="text-blue-500 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Privacy & Security</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Your health data is encrypted end-to-end and never shared with third parties without your explicit consent. 
                You can disconnect any device at any time and all associated data will be removed from our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}