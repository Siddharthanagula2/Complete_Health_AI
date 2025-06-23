import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { 
  Stethoscope, 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Brain,
  FileText,
  Download,
  Share2,
  Bell,
  Eye,
  MessageCircle
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  avatar: string;
  lastVisit: Date;
  nextAppointment?: Date;
  riskLevel: 'low' | 'medium' | 'high';
  conditions: string[];
  vitals: {
    bloodPressure: { systolic: number; diastolic: number; date: Date };
    heartRate: { value: number; date: Date };
    weight: { value: number; date: Date };
    temperature: { value: number; date: Date };
  };
  recentMetrics: {
    steps: number;
    exercise: number;
    sleep: number;
    calories: number;
  };
  alerts: Array<{
    id: string;
    type: 'warning' | 'info' | 'critical';
    message: string;
    date: Date;
  }>;
  adherence: {
    medication: number;
    exercise: number;
    diet: number;
  };
}

export function ProviderPortal() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'dashboard'>('list');

  // Mock patients data
  const patients: Patient[] = [
    {
      id: '1',
      name: 'John Smith',
      age: 45,
      gender: 'M',
      avatar: '👨‍💼',
      lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextAppointment: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      riskLevel: 'medium',
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      vitals: {
        bloodPressure: { systolic: 145, diastolic: 92, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        heartRate: { value: 78, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        weight: { value: 185, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        temperature: { value: 98.6, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      },
      recentMetrics: {
        steps: 6500,
        exercise: 25,
        sleep: 6.5,
        calories: 2100
      },
      alerts: [
        {
          id: '1',
          type: 'warning',
          message: 'Blood pressure elevated for 3 consecutive days',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'info',
          message: 'Exercise goal not met this week',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ],
      adherence: {
        medication: 85,
        exercise: 60,
        diet: 75
      }
    },
    {
      id: '2',
      name: 'Maria Garcia',
      age: 32,
      gender: 'F',
      avatar: '👩‍🔬',
      lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      riskLevel: 'low',
      conditions: ['Anxiety'],
      vitals: {
        bloodPressure: { systolic: 118, diastolic: 76, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        heartRate: { value: 68, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        weight: { value: 135, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        temperature: { value: 98.4, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      },
      recentMetrics: {
        steps: 9200,
        exercise: 45,
        sleep: 7.8,
        calories: 1650
      },
      alerts: [
        {
          id: '3',
          type: 'info',
          message: 'Excellent exercise consistency this month',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ],
      adherence: {
        medication: 95,
        exercise: 90,
        diet: 88
      }
    },
    {
      id: '3',
      name: 'Robert Johnson',
      age: 67,
      gender: 'M',
      avatar: '👨‍🦳',
      lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      nextAppointment: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      riskLevel: 'high',
      conditions: ['Heart Disease', 'High Cholesterol', 'Arthritis'],
      vitals: {
        bloodPressure: { systolic: 160, diastolic: 98, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        heartRate: { value: 88, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        weight: { value: 210, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        temperature: { value: 99.1, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      },
      recentMetrics: {
        steps: 3200,
        exercise: 10,
        sleep: 5.5,
        calories: 2400
      },
      alerts: [
        {
          id: '4',
          type: 'critical',
          message: 'Blood pressure critically high - immediate attention needed',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: '5',
          type: 'warning',
          message: 'Medication adherence below 70%',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ],
      adherence: {
        medication: 65,
        exercise: 30,
        diet: 55
      }
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-700 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="text-red-500" size={16} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'info': return <CheckCircle className="text-blue-500" size={16} />;
      default: return <Bell className="text-gray-500" size={16} />;
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.conditions.some(condition => condition.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRisk = filterRisk === 'all' || patient.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const selectedPatientData = selectedPatient ? patients.find(p => p.id === selectedPatient) : null;

  const renderPatientList = () => (
    <div className="space-y-4">
      {filteredPatients.map((patient) => (
        <Card 
          key={patient.id} 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedPatient === patient.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
          onClick={() => setSelectedPatient(patient.id)}
        >
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{patient.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{patient.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(patient.riskLevel)}`}>
                      {patient.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {patient.age} years • {patient.gender === 'M' ? 'Male' : 'Female'}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {patient.conditions.map((condition) => (
                      <span key={condition} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Last visit: {patient.lastVisit.toLocaleDateString()}
                </div>
                {patient.nextAppointment && (
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Next: {patient.nextAppointment.toLocaleDateString()}
                  </div>
                )}
                {patient.alerts.length > 0 && (
                  <div className="flex items-center space-x-1 mt-2 text-orange-500">
                    <Bell size={14} />
                    <span className="text-xs">{patient.alerts.length} alerts</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Vitals */}
            <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}
                </div>
                <div className="text-xs text-gray-500">BP</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {patient.vitals.heartRate.value}
                </div>
                <div className="text-xs text-gray-500">HR</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {patient.vitals.weight.value}
                </div>
                <div className="text-xs text-gray-500">Weight</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {patient.recentMetrics.steps.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Steps</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderPatientDashboard = () => {
    if (!selectedPatientData) {
      return (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Select a Patient
          </h4>
          <p className="text-gray-500 dark:text-gray-400">
            Choose a patient from the list to view their detailed health dashboard.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Patient Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{selectedPatientData.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedPatientData.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedPatientData.age} years • {selectedPatientData.gender === 'M' ? 'Male' : 'Female'}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(selectedPatientData.riskLevel)}`}>
                      {selectedPatientData.riskLevel.toUpperCase()} RISK
                    </span>
                    <span className="text-xs text-gray-500">
                      Last visit: {selectedPatientData.lastVisit.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost">
                  <MessageCircle size={16} className="mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="ghost">
                  <Calendar size={16} className="mr-1" />
                  Schedule
                </Button>
                <Button size="sm">
                  <FileText size={16} className="mr-1" />
                  Records
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        {selectedPatientData.alerts.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 dark:text-white">Active Alerts</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedPatientData.alerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  }`}>
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vital Signs */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white">Current Vital Signs</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <Heart className="mx-auto text-red-500 mb-2" size={24} />
                <div className="text-lg font-bold text-red-600">
                  {selectedPatientData.vitals.bloodPressure.systolic}/{selectedPatientData.vitals.bloodPressure.diastolic}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Blood Pressure</div>
                <div className="text-xs text-gray-500 mt-1">
                  {selectedPatientData.vitals.bloodPressure.date.toLocaleDateString()}
                </div>
              </div>

              <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <Activity className="mx-auto text-pink-500 mb-2" size={24} />
                <div className="text-lg font-bold text-pink-600">
                  {selectedPatientData.vitals.heartRate.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Heart Rate</div>
                <div className="text-xs text-gray-500 mt-1">
                  {selectedPatientData.vitals.heartRate.date.toLocaleDateString()}
                </div>
              </div>

              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Droplets className="mx-auto text-blue-500 mb-2" size={24} />
                <div className="text-lg font-bold text-blue-600">
                  {selectedPatientData.vitals.weight.value} lbs
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Weight</div>
                <div className="text-xs text-gray-500 mt-1">
                  {selectedPatientData.vitals.weight.date.toLocaleDateString()}
                </div>
              </div>

              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Thermometer className="mx-auto text-orange-500 mb-2" size={24} />
                <div className="text-lg font-bold text-orange-600">
                  {selectedPatientData.vitals.temperature.value}°F
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
                <div className="text-xs text-gray-500 mt-1">
                  {selectedPatientData.vitals.temperature.date.toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle Metrics */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Lifestyle Metrics</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <div className="text-lg font-bold text-emerald-600">
                  {selectedPatientData.recentMetrics.steps.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Daily Steps</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {selectedPatientData.recentMetrics.exercise} min
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Exercise</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="text-lg font-bold text-indigo-600">
                  {selectedPatientData.recentMetrics.sleep}h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sleep</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-lg font-bold text-yellow-600">
                  {selectedPatientData.recentMetrics.calories}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Calories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Adherence */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white">Treatment Adherence</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Medication Adherence</span>
                  <span className="font-medium">{selectedPatientData.adherence.medication}%</span>
                </div>
                <Progress
                  value={selectedPatientData.adherence.medication}
                  max={100}
                  color={selectedPatientData.adherence.medication >= 80 ? 'emerald' : selectedPatientData.adherence.medication >= 60 ? 'yellow' : 'red'}
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Exercise Compliance</span>
                  <span className="font-medium">{selectedPatientData.adherence.exercise}%</span>
                </div>
                <Progress
                  value={selectedPatientData.adherence.exercise}
                  max={100}
                  color={selectedPatientData.adherence.exercise >= 80 ? 'emerald' : selectedPatientData.adherence.exercise >= 60 ? 'yellow' : 'red'}
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Dietary Guidelines</span>
                  <span className="font-medium">{selectedPatientData.adherence.diet}%</span>
                </div>
                <Progress
                  value={selectedPatientData.adherence.diet}
                  max={100}
                  color={selectedPatientData.adherence.diet >= 80 ? 'emerald' : selectedPatientData.adherence.diet >= 60 ? 'yellow' : 'red'}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Stethoscope className="text-blue-500" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Healthcare Provider Portal</h3>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost">
                <Download size={16} className="mr-1" />
                Export
              </Button>
              <Button size="sm" variant="ghost">
                <Share2 size={16} className="mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search patients by name or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                onClick={() => setViewMode('list')}
              >
                <Users size={16} />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'dashboard' ? 'primary' : 'ghost'}
                onClick={() => setViewMode('dashboard')}
              >
                <TrendingUp size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Overview Stats */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Patient Overview</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredPatients.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Patients</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {filteredPatients.filter(p => p.riskLevel === 'high').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">High Risk</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredPatients.filter(p => p.alerts.length > 0).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Alerts</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredPatients.filter(p => p.nextAppointment && p.nextAppointment > new Date()).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming Appointments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Patients ({filteredPatients.length})
              </h3>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                {renderPatientList()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Dashboard */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 dark:text-white">Patient Dashboard</h3>
            </CardHeader>
            <CardContent>
              {renderPatientDashboard()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}