import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { 
  Stethoscope, 
  FileText, 
  Calendar, 
  Pill, 
  Activity, 
  AlertTriangle,
  TrendingUp,
  Heart,
  Thermometer,
  Droplets,
  Eye,
  Download,
  Share2,
  Bell
} from 'lucide-react';
import { MedicalRecord, User, DailyStats } from '../types';

interface MedicalProfessionalToolsProps {
  user: User;
  stats: DailyStats[];
}

export function MedicalProfessionalTools({ user, stats }: MedicalProfessionalToolsProps) {
  const [activeTab, setActiveTab] = useState<'records' | 'vitals' | 'reports' | 'alerts'>('records');

  // Mock medical records
  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      type: 'lab_result',
      title: 'Complete Blood Count',
      value: 14.2,
      unit: 'g/dL',
      normalRange: { min: 12.0, max: 16.0 },
      notes: 'Hemoglobin levels within normal range',
      provider: 'Dr. Smith - Internal Medicine',
      timestamp: new Date('2024-01-05')
    },
    {
      id: '2',
      type: 'vital_sign',
      title: 'Blood Pressure',
      value: 118,
      unit: 'mmHg',
      normalRange: { min: 90, max: 120 },
      notes: 'Systolic pressure - optimal range',
      provider: 'Nurse Johnson',
      timestamp: new Date('2024-01-08')
    },
    {
      id: '3',
      type: 'medication',
      title: 'Vitamin D3',
      value: 2000,
      unit: 'IU',
      notes: 'Daily supplement for bone health',
      provider: 'Dr. Smith - Internal Medicine',
      timestamp: new Date('2024-01-01')
    },
    {
      id: '4',
      type: 'lab_result',
      title: 'Cholesterol Total',
      value: 185,
      unit: 'mg/dL',
      normalRange: { min: 0, max: 200 },
      notes: 'Total cholesterol within recommended range',
      provider: 'Dr. Smith - Internal Medicine',
      timestamp: new Date('2024-01-05')
    },
    {
      id: '5',
      type: 'appointment',
      title: 'Annual Physical Exam',
      notes: 'Routine checkup - all vitals normal, continue current health regimen',
      provider: 'Dr. Smith - Internal Medicine',
      timestamp: new Date('2024-01-10')
    }
  ];

  // Mock vital signs data
  const vitalSigns = {
    bloodPressure: {
      systolic: 118,
      diastolic: 76,
      trend: 'stable',
      lastReading: new Date('2024-01-08')
    },
    heartRate: {
      resting: 68,
      max: 185,
      trend: 'improving',
      lastReading: new Date('2024-01-08')
    },
    temperature: {
      current: 98.6,
      trend: 'normal',
      lastReading: new Date('2024-01-08')
    },
    oxygenSaturation: {
      current: 98,
      trend: 'stable',
      lastReading: new Date('2024-01-08')
    }
  };

  // Mock health alerts
  const healthAlerts = [
    {
      id: '1',
      type: 'warning',
      title: 'Hydration Below Target',
      message: 'Water intake has been below recommended levels for 3 consecutive days',
      priority: 'medium',
      timestamp: new Date('2024-01-08'),
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Exercise Goal Achieved',
      message: 'Patient has consistently met exercise goals for the past week',
      priority: 'low',
      timestamp: new Date('2024-01-07'),
      resolved: false
    },
    {
      id: '3',
      type: 'critical',
      title: 'Medication Reminder',
      message: 'Vitamin D3 supplement due for refill',
      priority: 'high',
      timestamp: new Date('2024-01-06'),
      resolved: true
    }
  ];

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'lab_result': return <Activity className="text-blue-500" size={20} />;
      case 'vital_sign': return <Heart className="text-red-500" size={20} />;
      case 'medication': return <Pill className="text-green-500" size={20} />;
      case 'appointment': return <Calendar className="text-purple-500" size={20} />;
      default: return <FileText className="text-gray-500" size={20} />;
    }
  };

  const getValueStatus = (value: number, normalRange?: { min: number; max: number }) => {
    if (!normalRange) return 'normal';
    if (value < normalRange.min) return 'low';
    if (value > normalRange.max) return 'high';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'low': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'normal': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="text-green-500" size={16} />;
      case 'declining': return <TrendingUp className="text-red-500 rotate-180" size={16} />;
      case 'stable': return <Activity className="text-blue-500" size={16} />;
      default: return <Activity className="text-gray-500" size={16} />;
    }
  };

  const renderMedicalRecords = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900 dark:text-white">Medical Records</h4>
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost">
            <Download size={16} className="mr-1" />
            Export
          </Button>
          <Button size="sm">
            <FileText size={16} className="mr-1" />
            Add Record
          </Button>
        </div>
      </div>

      {medicalRecords.map((record) => {
        const status = record.normalRange ? getValueStatus(record.value || 0, record.normalRange) : 'normal';
        
        return (
          <div key={record.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getRecordIcon(record.type)}
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 dark:text-white">{record.title}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{record.notes}</p>
                  
                  {record.value && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {record.value} {record.unit}
                      </span>
                      {record.normalRange && (
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                          {status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {record.normalRange && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">
                        Normal range: {record.normalRange.min} - {record.normalRange.max} {record.unit}
                      </div>
                      <Progress
                        value={record.value || 0}
                        max={record.normalRange.max}
                        color={status === 'normal' ? 'emerald' : status === 'high' ? 'red' : 'blue'}
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                    <span>{record.provider}</span>
                    <span>{record.timestamp.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderVitalSigns = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 dark:text-white">Current Vital Signs</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Blood Pressure */}
        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Heart className="text-red-500" size={24} />
              <h5 className="font-medium text-gray-900 dark:text-white">Blood Pressure</h5>
            </div>
            {getTrendIcon(vitalSigns.bloodPressure.trend)}
          </div>
          <div className="text-2xl font-bold text-red-600 mb-1">
            {vitalSigns.bloodPressure.systolic}/{vitalSigns.bloodPressure.diastolic}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">mmHg</div>
          <div className="text-xs text-gray-500 mt-2">
            Last reading: {vitalSigns.bloodPressure.lastReading.toLocaleDateString()}
          </div>
        </div>

        {/* Heart Rate */}
        <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Activity className="text-pink-500" size={24} />
              <h5 className="font-medium text-gray-900 dark:text-white">Heart Rate</h5>
            </div>
            {getTrendIcon(vitalSigns.heartRate.trend)}
          </div>
          <div className="text-2xl font-bold text-pink-600 mb-1">
            {vitalSigns.heartRate.resting}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">bpm (resting)</div>
          <div className="text-xs text-gray-500 mt-2">
            Max: {vitalSigns.heartRate.max} bpm
          </div>
        </div>

        {/* Temperature */}
        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Thermometer className="text-orange-500" size={24} />
              <h5 className="font-medium text-gray-900 dark:text-white">Temperature</h5>
            </div>
            {getTrendIcon(vitalSigns.temperature.trend)}
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {vitalSigns.temperature.current}°F
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Body temperature</div>
          <div className="text-xs text-gray-500 mt-2">
            Last reading: {vitalSigns.temperature.lastReading.toLocaleDateString()}
          </div>
        </div>

        {/* Oxygen Saturation */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Droplets className="text-blue-500" size={24} />
              <h5 className="font-medium text-gray-900 dark:text-white">Oxygen Saturation</h5>
            </div>
            {getTrendIcon(vitalSigns.oxygenSaturation.trend)}
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {vitalSigns.oxygenSaturation.current}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">SpO2</div>
          <div className="text-xs text-gray-500 mt-2">
            Last reading: {vitalSigns.oxygenSaturation.lastReading.toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealthReports = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900 dark:text-white">Health Reports</h4>
        <Button size="sm">
          <FileText size={16} className="mr-1" />
          Generate Report
        </Button>
      </div>

      {/* Weekly Summary */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h5 className="font-medium text-gray-900 dark:text-white mb-3">Weekly Health Summary</h5>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500">
              {Math.round(stats.slice(0, 7).reduce((sum, s) => sum + s.calories, 0) / 7)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {Math.round(stats.slice(0, 7).reduce((sum, s) => sum + s.exercise, 0) / 7)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Exercise (min)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {Math.round(stats.slice(0, 7).reduce((sum, s) => sum + s.water, 0) / 7)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Water (glasses)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">
              {Math.round(stats.slice(0, 7).reduce((sum, s) => sum + s.steps, 0) / 7)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Steps</div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="ghost">
            <Download size={16} className="mr-1" />
            Download PDF
          </Button>
          <Button size="sm" variant="ghost">
            <Share2 size={16} className="mr-1" />
            Share with Provider
          </Button>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h5 className="font-medium text-gray-900 dark:text-white mb-3">Trend Analysis</h5>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Weight Progress</span>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-green-500" size={16} />
              <span className="text-green-600 font-medium">-0.5kg this week</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Exercise Consistency</span>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-green-500" size={16} />
              <span className="text-green-600 font-medium">85% goal achievement</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Nutrition Quality</span>
            <div className="flex items-center space-x-2">
              <Activity className="text-blue-500" size={16} />
              <span className="text-blue-600 font-medium">Stable, within targets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealthAlerts = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900 dark:text-white">Health Alerts</h4>
        <Button size="sm" variant="ghost">
          <Bell size={16} className="mr-1" />
          Configure Alerts
        </Button>
      </div>

      {healthAlerts.map((alert) => (
        <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
          alert.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
          alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
          'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        } ${alert.resolved ? 'opacity-60' : ''}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertTriangle className={`${
                alert.priority === 'high' ? 'text-red-500' :
                alert.priority === 'medium' ? 'text-yellow-500' :
                'text-blue-500'
              }`} size={20} />
              <div>
                <h5 className={`font-medium ${
                  alert.priority === 'high' ? 'text-red-800 dark:text-red-200' :
                  alert.priority === 'medium' ? 'text-yellow-800 dark:text-yellow-200' :
                  'text-blue-800 dark:text-blue-200'
                }`}>
                  {alert.title}
                </h5>
                <p className={`text-sm mt-1 ${
                  alert.priority === 'high' ? 'text-red-700 dark:text-red-300' :
                  alert.priority === 'medium' ? 'text-yellow-700 dark:text-yellow-300' :
                  'text-blue-700 dark:text-blue-300'
                }`}>
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {alert.timestamp.toLocaleDateString()} at {alert.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {!alert.resolved && (
                <Button size="sm" variant="ghost">
                  Resolve
                </Button>
              )}
              {alert.resolved && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  Resolved
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Stethoscope className="text-blue-500" size={24} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Medical Professional Tools</h3>
          </div>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'records', label: 'Medical Records', icon: FileText },
              { id: 'vitals', label: 'Vital Signs', icon: Heart },
              { id: 'reports', label: 'Health Reports', icon: TrendingUp },
              { id: 'alerts', label: 'Health Alerts', icon: AlertTriangle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
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
          {activeTab === 'records' && renderMedicalRecords()}
          {activeTab === 'vitals' && renderVitalSigns()}
          {activeTab === 'reports' && renderHealthReports()}
          {activeTab === 'alerts' && renderHealthAlerts()}
        </CardContent>
      </Card>
    </div>
  );
}