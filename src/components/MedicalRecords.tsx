import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Progress } from './ui/Progress';
import { 
  FileText, 
  Plus, 
  Calendar, 
  Pill, 
  Activity, 
  Heart,
  Thermometer,
  Droplets,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Building,
  Stethoscope
} from 'lucide-react';

interface MedicalRecord {
  id: string;
  type: 'lab_result' | 'medication' | 'appointment' | 'vital_sign' | 'imaging' | 'procedure';
  title: string;
  value?: number;
  unit?: string;
  normalRange?: {
    min: number;
    max: number;
  };
  status?: 'normal' | 'abnormal' | 'critical' | 'pending';
  notes?: string;
  provider?: string;
  facility?: string;
  date: Date;
  attachments?: string[];
  followUpRequired?: boolean;
  category: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  adherence: number;
  sideEffects?: string[];
  instructions: string;
  refillsRemaining: number;
  nextRefillDate?: Date;
}

export function MedicalRecords() {
  const [activeTab, setActiveTab] = useState<'records' | 'medications' | 'appointments'>('records');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lab_result' | 'medication' | 'appointment' | 'vital_sign'>('all');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  // Mock medical records
  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      type: 'lab_result',
      title: 'Complete Blood Count (CBC)',
      date: new Date('2024-01-15'),
      provider: 'Dr. Sarah Johnson',
      facility: 'City Medical Center',
      status: 'normal',
      category: 'Blood Work',
      notes: 'All values within normal range. Continue current health regimen.',
      followUpRequired: false
    },
    {
      id: '2',
      type: 'lab_result',
      title: 'Hemoglobin A1C',
      value: 5.8,
      unit: '%',
      normalRange: { min: 4.0, max: 5.6 },
      status: 'abnormal',
      date: new Date('2024-01-15'),
      provider: 'Dr. Sarah Johnson',
      facility: 'City Medical Center',
      category: 'Diabetes Screening',
      notes: 'Slightly elevated. Recommend dietary modifications and follow-up in 3 months.',
      followUpRequired: true
    },
    {
      id: '3',
      type: 'lab_result',
      title: 'Cholesterol Panel',
      date: new Date('2024-01-10'),
      provider: 'Dr. Sarah Johnson',
      facility: 'City Medical Center',
      status: 'normal',
      category: 'Lipid Profile',
      notes: 'Total cholesterol: 185 mg/dL, LDL: 110 mg/dL, HDL: 55 mg/dL. Good levels.',
      followUpRequired: false
    },
    {
      id: '4',
      type: 'vital_sign',
      title: 'Blood Pressure Reading',
      value: 128,
      unit: 'mmHg',
      normalRange: { min: 90, max: 120 },
      status: 'abnormal',
      date: new Date('2024-01-20'),
      provider: 'Nurse Jennifer Smith',
      facility: 'City Medical Center',
      category: 'Cardiovascular',
      notes: 'Systolic: 128 mmHg, Diastolic: 82 mmHg. Slightly elevated, monitor closely.',
      followUpRequired: true
    },
    {
      id: '5',
      type: 'imaging',
      title: 'Chest X-Ray',
      date: new Date('2024-01-05'),
      provider: 'Dr. Michael Chen',
      facility: 'Radiology Associates',
      status: 'normal',
      category: 'Imaging',
      notes: 'Clear lung fields, normal heart size. No acute findings.',
      followUpRequired: false,
      attachments: ['chest_xray_20240105.pdf']
    },
    {
      id: '6',
      type: 'procedure',
      title: 'Annual Physical Examination',
      date: new Date('2024-01-08'),
      provider: 'Dr. Sarah Johnson',
      facility: 'City Medical Center',
      status: 'normal',
      category: 'Preventive Care',
      notes: 'Comprehensive physical exam completed. All systems normal. Continue current health practices.',
      followUpRequired: false
    }
  ];

  // Mock medications
  const medications: Medication[] = [
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      prescribedBy: 'Dr. Sarah Johnson',
      startDate: new Date('2023-12-01'),
      isActive: true,
      adherence: 95,
      instructions: 'Take with or without food. Monitor blood pressure regularly.',
      refillsRemaining: 3,
      nextRefillDate: new Date('2024-02-15')
    },
    {
      id: '2',
      name: 'Vitamin D3',
      dosage: '2000 IU',
      frequency: 'Once daily',
      prescribedBy: 'Dr. Sarah Johnson',
      startDate: new Date('2023-11-15'),
      isActive: true,
      adherence: 88,
      instructions: 'Take with food for better absorption.',
      refillsRemaining: 5,
      nextRefillDate: new Date('2024-03-01')
    },
    {
      id: '3',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      prescribedBy: 'Dr. Sarah Johnson',
      startDate: new Date('2024-01-16'),
      isActive: true,
      adherence: 92,
      instructions: 'Take with meals to reduce stomach upset.',
      refillsRemaining: 2,
      nextRefillDate: new Date('2024-02-20'),
      sideEffects: ['Mild nausea initially']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'abnormal': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'pending': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="text-green-500" size={16} />;
      case 'abnormal': return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'critical': return <AlertTriangle className="text-red-500" size={16} />;
      case 'pending': return <Clock className="text-blue-500" size={16} />;
      default: return <FileText className="text-gray-500" size={16} />;
    }
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'lab_result': return <Activity className="text-blue-500" size={20} />;
      case 'vital_sign': return <Heart className="text-red-500" size={20} />;
      case 'medication': return <Pill className="text-green-500" size={20} />;
      case 'appointment': return <Calendar className="text-purple-500" size={20} />;
      case 'imaging': return <Eye className="text-indigo-500" size={20} />;
      case 'procedure': return <Stethoscope className="text-orange-500" size={20} />;
      default: return <FileText className="text-gray-500" size={20} />;
    }
  };

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.provider?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesType;
  });

  const renderMedicalRecords = () => (
    <div className="space-y-4">
      {filteredRecords.map((record) => (
        <Card 
          key={record.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedRecord === record.id ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
          onClick={() => setSelectedRecord(selectedRecord === record.id ? null : record.id)}
        >
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getRecordIcon(record.type)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{record.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status || 'normal')}`}>
                      {record.status?.toUpperCase() || 'NORMAL'}
                    </span>
                    {record.followUpRequired && (
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                        FOLLOW-UP REQUIRED
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{record.category}</p>
                  
                  {record.value && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {record.value} {record.unit}
                      </span>
                      {record.normalRange && (
                        <span className="text-xs text-gray-500">
                          (Normal: {record.normalRange.min} - {record.normalRange.max} {record.unit})
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{record.provider}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building size={14} />
                      <span>{record.facility}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{record.date.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(record.status || 'normal')}
                {record.attachments && record.attachments.length > 0 && (
                  <Button size="sm" variant="ghost">
                    <Download size={14} />
                  </Button>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {selectedRecord === record.id && record.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Notes:</h5>
                <p className="text-sm text-gray-700 dark:text-gray-300">{record.notes}</p>
                
                {record.attachments && record.attachments.length > 0 && (
                  <div className="mt-3">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Attachments:</h5>
                    <div className="flex flex-wrap gap-2">
                      {record.attachments.map((attachment, index) => (
                        <Button key={index} size="sm" variant="ghost" className="text-blue-600">
                          <Download size={14} className="mr-1" />
                          {attachment}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderMedications = () => (
    <div className="space-y-4">
      {medications.map((medication) => (
        <Card key={medication.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Pill className="text-green-500 mt-1" size={20} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{medication.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      medication.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {medication.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {medication.dosage} • {medication.frequency}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Prescribed by {medication.prescribedBy} on {medication.startDate.toLocaleDateString()}
                  </p>
                  
                  {/* Adherence */}
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Adherence</span>
                      <span className="font-medium">{medication.adherence}%</span>
                    </div>
                    <Progress
                      value={medication.adherence}
                      max={100}
                      color={medication.adherence >= 90 ? 'emerald' : medication.adherence >= 70 ? 'yellow' : 'red'}
                      className="h-2"
                    />
                  </div>

                  {/* Instructions */}
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-1">Instructions:</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{medication.instructions}</p>
                  </div>

                  {/* Side Effects */}
                  {medication.sideEffects && medication.sideEffects.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">Reported Side Effects:</h5>
                      <div className="flex flex-wrap gap-1">
                        {medication.sideEffects.map((effect, index) => (
                          <span key={index} className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {medication.refillsRemaining} refills left
                </div>
                {medication.nextRefillDate && (
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Next refill: {medication.nextRefillDate.toLocaleDateString()}
                  </div>
                )}
                <Button size="sm" variant="ghost" className="mt-2">
                  <Pill size={14} className="mr-1" />
                  Refill
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderAppointments = () => (
    <div className="text-center py-12">
      <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Appointment History
      </h4>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        View and manage your medical appointments and visit history.
      </p>
      <Button>
        <Plus size={16} className="mr-2" />
        Schedule Appointment
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="text-blue-500" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Medical Records</h3>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost">
                <Upload size={16} className="mr-1" />
                Upload
              </Button>
              <Button size="sm">
                <Plus size={16} className="mr-1" />
                Add Record
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Records Overview</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{medicalRecords.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Records</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{medications.filter(m => m.isActive).length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Medications</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {medicalRecords.filter(r => r.followUpRequired).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Follow-ups Needed</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {medicalRecords.filter(r => r.date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Recent (30 days)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { id: 'records', label: 'Medical Records', icon: FileText },
              { id: 'medications', label: 'Medications', icon: Pill },
              { id: 'appointments', label: 'Appointments', icon: Calendar }
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

      {/* Search and Filters */}
      {activeTab === 'records' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search records by title, category, or provider..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="lab_result">Lab Results</option>
                <option value="vital_sign">Vital Signs</option>
                <option value="medication">Medications</option>
                <option value="appointment">Appointments</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Content */}
      <Card>
        <CardContent className="pt-6">
          {activeTab === 'records' && renderMedicalRecords()}
          {activeTab === 'medications' && renderMedications()}
          {activeTab === 'appointments' && renderAppointments()}
        </CardContent>
      </Card>
    </div>
  );
}