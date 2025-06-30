import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { 
  Pill, 
  Plus, 
  Clock, 
  Calendar, 
  Bell, 
  Edit, 
  Trash2, 
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { MedicationReminder } from '../types';
import { SupabaseHealthService } from '../services/supabaseHealthService';

export function MedicationReminders() {
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<MedicationReminder | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: 'daily',
    timeOfDay: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });

  // Load reminders
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await SupabaseHealthService.getMedicationReminders();
      
      if (response.success) {
        setReminders(response.data);
      } else {
        setError(response.error || 'Failed to load medication reminders');
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...formData.timeOfDay];
    newTimes[index] = value;
    setFormData(prev => ({
      ...prev,
      timeOfDay: newTimes
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeOfDay: [...prev.timeOfDay, '12:00']
    }));
  };

  const removeTimeSlot = (index: number) => {
    const newTimes = [...formData.timeOfDay];
    newTimes.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      timeOfDay: newTimes
    }));
  };

  const resetForm = () => {
    setFormData({
      medicationName: '',
      dosage: '',
      frequency: 'daily',
      timeOfDay: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    });
  };

  const handleAddReminder = async () => {
    try {
      setIsLoading(true);
      
      const reminderData = {
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        timeOfDay: formData.timeOfDay,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        notes: formData.notes || undefined
      };
      
      const response = await SupabaseHealthService.saveMedicationReminder(reminderData);
      
      if (response.success) {
        await fetchReminders();
        setIsAddModalOpen(false);
        resetForm();
      } else {
        setError(response.error || 'Failed to add medication reminder');
      }
    } catch (error) {
      console.error('Error adding reminder:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditReminder = async () => {
    if (!selectedReminder) return;
    
    try {
      setIsLoading(true);
      
      const reminderData = {
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        timeOfDay: formData.timeOfDay,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        notes: formData.notes || undefined
      };
      
      const response = await SupabaseHealthService.updateMedicationReminder(
        selectedReminder.id,
        reminderData
      );
      
      if (response.success) {
        await fetchReminders();
        setIsEditModalOpen(false);
        setSelectedReminder(null);
      } else {
        setError(response.error || 'Failed to update medication reminder');
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medication reminder?')) return;
    
    try {
      setIsLoading(true);
      
      const response = await SupabaseHealthService.deleteMedicationReminder(id);
      
      if (response.success) {
        await fetchReminders();
      } else {
        setError(response.error || 'Failed to delete medication reminder');
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (reminder: MedicationReminder) => {
    setSelectedReminder(reminder);
    setFormData({
      medicationName: reminder.medicationName,
      dosage: reminder.dosage,
      frequency: reminder.frequency,
      timeOfDay: reminder.timeOfDay,
      startDate: reminder.startDate.toISOString().split('T')[0],
      endDate: reminder.endDate ? reminder.endDate.toISOString().split('T')[0] : '',
      notes: reminder.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'twice-daily': return 'Twice Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'as-needed': return 'As Needed';
      default: return frequency;
    }
  };

  const formatTimeOfDay = (times: string[]) => {
    return times.map(time => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }).join(', ');
  };

  const isReminderActive = (reminder: MedicationReminder) => {
    const now = new Date();
    const startDate = new Date(reminder.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    if (now < startDate) return false;
    
    if (reminder.endDate) {
      const endDate = new Date(reminder.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (now > endDate) return false;
    }
    
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Pill className="text-purple-500" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Medication Reminders</h3>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add Medication
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Error Message */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertTriangle className="text-red-500 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Error</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Medications */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-white">Active Medications</h3>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Loading medications...</p>
            </div>
          ) : reminders.filter(r => isReminderActive(r)).length === 0 ? (
            <div className="text-center py-8">
              <Pill className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No active medication reminders</p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus size={16} className="mr-2" />
                Add Medication
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reminders
                .filter(reminder => isReminderActive(reminder))
                .map(reminder => (
                  <div key={reminder.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                          <Pill className="text-purple-500" size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{reminder.medicationName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.dosage}</p>
                          <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 dark:text-gray-400 space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{formatTimeOfDay(reminder.timeOfDay)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{getFrequencyText(reminder.frequency)}</span>
                            </div>
                          </div>
                          {reminder.notes && (
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">{reminder.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => openEditModal(reminder)}>
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteReminder(reminder.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inactive Medications */}
      {reminders.some(r => !isReminderActive(r)) && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white">Inactive Medications</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reminders
                .filter(reminder => !isReminderActive(reminder))
                .map(reminder => (
                  <div key={reminder.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <Pill className="text-gray-500" size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300">{reminder.medicationName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.dosage}</p>
                          <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 dark:text-gray-400 space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{formatTimeOfDay(reminder.timeOfDay)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{getFrequencyText(reminder.frequency)}</span>
                            </div>
                          </div>
                          {reminder.endDate && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Ended: {new Date(reminder.endDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => openEditModal(reminder)}>
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteReminder(reminder.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Medication Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Medication Reminder"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Medication Name
            </label>
            <input
              type="text"
              name="medicationName"
              value={formData.medicationName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Lisinopril, Vitamin D3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dosage
            </label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 10mg, 1 tablet"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequency
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="daily">Daily</option>
              <option value="twice-daily">Twice Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="as-needed">As Needed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time of Day
            </label>
            {formData.timeOfDay.map((time, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
                {formData.timeOfDay.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTimeSlot}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>Add another time</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Additional instructions or notes"
            />
          </div>

          <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Info className="text-blue-500 flex-shrink-0" size={20} />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Medication reminders will be displayed in your dashboard and can be synced with your calendar.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleAddReminder}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="mr-2" />
                  Add Medication
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Medication Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Medication Reminder"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Medication Name
            </label>
            <input
              type="text"
              name="medicationName"
              value={formData.medicationName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Lisinopril, Vitamin D3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dosage
            </label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 10mg, 1 tablet"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequency
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="daily">Daily</option>
              <option value="twice-daily">Twice Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="as-needed">As Needed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time of Day
            </label>
            {formData.timeOfDay.map((time, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
                {formData.timeOfDay.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTimeSlot}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>Add another time</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Additional instructions or notes"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleEditReminder}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="mr-2" />
                  Update Medication
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}