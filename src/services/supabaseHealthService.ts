import { supabase } from '../lib/supabase'
import { FoodEntry, ExerciseEntry, WaterEntry, SleepEntry, MoodEntry, MedicationReminder } from '../types'

export class SupabaseHealthService {
  /**
   * Save health data to Supabase
   */
  static async saveHealthData(dataType: string, data: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('health_data')
        .insert({
          user_id: user.id,
          data_type: dataType,
          data_value: data,
          created_at: new Date().toISOString()
        })

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error: any) {
      console.error('Error saving health data:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get health data from Supabase
   */
  static async getHealthData(dataType: string, limit = 100) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('health_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('data_type', dataType)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return { success: true, data: data || [] }
    } catch (error: any) {
      console.error('Error getting health data:', error)
      return { success: false, error: error.message, data: [] }
    }
  }

  /**
   * Save food entry
   */
  static async saveFoodEntry(entry: Omit<FoodEntry, 'id'>) {
    return this.saveHealthData('food_entry', entry)
  }

  /**
   * Get food entries
   */
  static async getFoodEntries(limit = 100) {
    return this.getHealthData('food_entry', limit)
  }

  /**
   * Save exercise entry
   */
  static async saveExerciseEntry(entry: Omit<ExerciseEntry, 'id'>) {
    return this.saveHealthData('exercise_entry', entry)
  }

  /**
   * Get exercise entries
   */
  static async getExerciseEntries(limit = 100) {
    return this.getHealthData('exercise_entry', limit)
  }

  /**
   * Save water entry
   */
  static async saveWaterEntry(entry: Omit<WaterEntry, 'id'>) {
    return this.saveHealthData('water_entry', entry)
  }

  /**
   * Get water entries
   */
  static async getWaterEntries(limit = 100) {
    return this.getHealthData('water_entry', limit)
  }

  /**
   * Save sleep entry
   */
  static async saveSleepEntry(entry: Omit<SleepEntry, 'id'>) {
    return this.saveHealthData('sleep_entry', entry)
  }

  /**
   * Get sleep entries
   */
  static async getSleepEntries(limit = 100) {
    return this.getHealthData('sleep_entry', limit)
  }

  /**
   * Save mood entry
   */
  static async saveMoodEntry(entry: Omit<MoodEntry, 'id'>) {
    return this.saveHealthData('mood_entry', entry)
  }

  /**
   * Get mood entries
   */
  static async getMoodEntries(limit = 100) {
    return this.getHealthData('mood_entry', limit)
  }

  /**
   * Save medication reminder
   */
  static async saveMedicationReminder(reminder: Omit<MedicationReminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('medication_reminders')
        .insert({
          user_id: user.id,
          medication_name: reminder.medicationName,
          dosage: reminder.dosage,
          frequency: reminder.frequency,
          time_of_day: reminder.timeOfDay,
          start_date: reminder.startDate,
          end_date: reminder.endDate,
          notes: reminder.notes
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return { 
        success: true, 
        data: {
          id: data.id,
          userId: data.user_id,
          medicationName: data.medication_name,
          dosage: data.dosage,
          frequency: data.frequency,
          timeOfDay: data.time_of_day,
          startDate: new Date(data.start_date),
          endDate: data.end_date ? new Date(data.end_date) : undefined,
          notes: data.notes,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        } as MedicationReminder
      }
    } catch (error: any) {
      console.error('Error saving medication reminder:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get medication reminders
   */
  static async getMedicationReminders() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('medication_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return { 
        success: true, 
        data: (data || []).map(item => ({
          id: item.id,
          userId: item.user_id,
          medicationName: item.medication_name,
          dosage: item.dosage,
          frequency: item.frequency,
          timeOfDay: item.time_of_day,
          startDate: new Date(item.start_date),
          endDate: item.end_date ? new Date(item.end_date) : undefined,
          notes: item.notes,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at)
        })) as MedicationReminder[]
      }
    } catch (error: any) {
      console.error('Error getting medication reminders:', error)
      return { success: false, error: error.message, data: [] }
    }
  }

  /**
   * Update medication reminder
   */
  static async updateMedicationReminder(id: string, updates: Partial<Omit<MedicationReminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const updateData: any = {}
      
      if (updates.medicationName !== undefined) updateData.medication_name = updates.medicationName
      if (updates.dosage !== undefined) updateData.dosage = updates.dosage
      if (updates.frequency !== undefined) updateData.frequency = updates.frequency
      if (updates.timeOfDay !== undefined) updateData.time_of_day = updates.timeOfDay
      if (updates.startDate !== undefined) updateData.start_date = updates.startDate
      if (updates.endDate !== undefined) updateData.end_date = updates.endDate
      if (updates.notes !== undefined) updateData.notes = updates.notes

      const { data, error } = await supabase
        .from('medication_reminders')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return { 
        success: true, 
        data: {
          id: data.id,
          userId: data.user_id,
          medicationName: data.medication_name,
          dosage: data.dosage,
          frequency: data.frequency,
          timeOfDay: data.time_of_day,
          startDate: new Date(data.start_date),
          endDate: data.end_date ? new Date(data.end_date) : undefined,
          notes: data.notes,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        } as MedicationReminder
      }
    } catch (error: any) {
      console.error('Error updating medication reminder:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Delete medication reminder
   */
  static async deleteMedicationReminder(id: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('medication_reminders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error: any) {
      console.error('Error deleting medication reminder:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Delete health data entry
   */
  static async deleteHealthData(id: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('health_data')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error: any) {
      console.error('Error deleting health data:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get user's health summary
   */
  static async getHealthSummary(days = 7) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('health_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Group data by type
      const summary = {
        food_entries: data?.filter(d => d.data_type === 'food_entry') || [],
        exercise_entries: data?.filter(d => d.data_type === 'exercise_entry') || [],
        water_entries: data?.filter(d => d.data_type === 'water_entry') || [],
        sleep_entries: data?.filter(d => d.data_type === 'sleep_entry') || [],
        mood_entries: data?.filter(d => d.data_type === 'mood_entry') || []
      }

      return { success: true, data: summary }
    } catch (error: any) {
      console.error('Error getting health summary:', error)
      return { success: false, error: error.message, data: null }
    }
  }
}