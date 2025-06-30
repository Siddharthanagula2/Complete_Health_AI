import { supabase } from '../lib/supabase'
import { FoodEntry, ExerciseEntry, WaterEntry, SleepEntry, MoodEntry } from '../types'

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