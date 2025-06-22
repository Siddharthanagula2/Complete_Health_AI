const { firestore } = require('../config/gcp');
const { FieldValue } = require('@google-cloud/firestore');
const crypto = require('crypto');

class FirestoreService {
  constructor() {
    this.db = firestore;
    this.collections = {
      users: 'users',
      healthMetrics: 'health_metrics',
      foodEntries: 'food_entries',
      exerciseEntries: 'exercise_entries',
      sleepEntries: 'sleep_entries',
      moodEntries: 'mood_entries',
      waterEntries: 'water_entries',
      gpsWorkouts: 'gps_workouts',
      medicalRecords: 'medical_records',
      achievements: 'achievements',
      socialChallenges: 'social_challenges',
      aiInsights: 'ai_insights'
    };
  }

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================

  async createUser(userData) {
    try {
      const userRef = this.db.collection(this.collections.users).doc();
      const userId = userRef.id;
      
      const user = {
        id: userId,
        ...userData,
        email: userData.email.toLowerCase().trim(),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        lastLogin: FieldValue.serverTimestamp(),
        isEmailVerified: userData.isEmailVerified || false,
        authProvider: userData.authProvider || 'email',
        // HIPAA compliance: Add data classification
        dataClassification: 'PHI', // Protected Health Information
        encryptionStatus: 'encrypted_at_rest'
      };

      await userRef.set(user);
      
      // Return user with converted timestamps
      const createdUser = await userRef.get();
      const userData_result = createdUser.data();
      
      // Convert Firestore timestamps to JavaScript Dates
      if (userData_result.createdAt && userData_result.createdAt.toDate) {
        userData_result.createdAt = userData_result.createdAt.toDate();
      }
      if (userData_result.updatedAt && userData_result.updatedAt.toDate) {
        userData_result.updatedAt = userData_result.updatedAt.toDate();
      }
      if (userData_result.lastLogin && userData_result.lastLogin.toDate) {
        userData_result.lastLogin = userData_result.lastLogin.toDate();
      }
      
      return { id: userId, ...userData_result };
    } catch (error) {
      console.error('Error creating user in Firestore:', error);
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      const snapshot = await this.db
        .collection(this.collections.users)
        .where('email', '==', email.toLowerCase().trim())
        .where('isDeleted', '!=', true) // Exclude soft-deleted users
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const userData = doc.data();
      
      // Convert Firestore timestamps to JavaScript Dates
      if (userData.createdAt && userData.createdAt.toDate) {
        userData.createdAt = userData.createdAt.toDate();
      }
      if (userData.updatedAt && userData.updatedAt.toDate) {
        userData.updatedAt = userData.updatedAt.toDate();
      }
      if (userData.lastLogin && userData.lastLogin.toDate) {
        userData.lastLogin = userData.lastLogin.toDate();
      }
      
      return { id: doc.id, ...userData };
    } catch (error) {
      console.error('Error finding user by email in Firestore:', error);
      throw error;
    }
  }

  async findUserById(userId) {
    try {
      const doc = await this.db
        .collection(this.collections.users)
        .doc(userId)
        .get();

      if (!doc.exists) {
        return null;
      }

      const userData = doc.data();
      
      // Convert Firestore timestamps to JavaScript Dates
      if (userData.createdAt && userData.createdAt.toDate) {
        userData.createdAt = userData.createdAt.toDate();
      }
      if (userData.updatedAt && userData.updatedAt.toDate) {
        userData.updatedAt = userData.updatedAt.toDate();
      }
      if (userData.lastLogin && userData.lastLogin.toDate) {
        userData.lastLogin = userData.lastLogin.toDate();
      }

      return { id: doc.id, ...userData };
    } catch (error) {
      console.error('Error finding user by ID in Firestore:', error);
      throw error;
    }
  }

  async updateUser(userId, updates) {
    try {
      const userRef = this.db.collection(this.collections.users).doc(userId);
      
      const updateData = {
        ...updates,
        updatedAt: FieldValue.serverTimestamp()
      };

      await userRef.update(updateData);
      
      const updatedDoc = await userRef.get();
      const userData = updatedDoc.data();
      
      // Convert Firestore timestamps to JavaScript Dates
      if (userData.createdAt && userData.createdAt.toDate) {
        userData.createdAt = userData.createdAt.toDate();
      }
      if (userData.updatedAt && userData.updatedAt.toDate) {
        userData.updatedAt = userData.updatedAt.toDate();
      }
      if (userData.lastLogin && userData.lastLogin.toDate) {
        userData.lastLogin = userData.lastLogin.toDate();
      }
      
      return { id: userId, ...userData };
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      // Soft delete for HIPAA compliance - don't actually delete PHI
      await this.updateUser(userId, {
        isDeleted: true,
        deletedAt: FieldValue.serverTimestamp(),
        // Anonymize PII while keeping health data for research
        email: `deleted_${crypto.randomUUID()}@deleted.com`,
        fullName: 'Deleted User'
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting user in Firestore:', error);
      throw error;
    }
  }

  // ============================================================================
  // FOOD ENTRIES
  // ============================================================================

  async createFoodEntry(userId, foodData) {
    try {
      const entryRef = this.db.collection(this.collections.foodEntries).doc();
      
      const entry = {
        id: entryRef.id,
        userId,
        ...foodData,
        timestamp: FieldValue.serverTimestamp(),
        dataClassification: 'PHI'
      };

      await entryRef.set(entry);
      
      const createdEntry = await entryRef.get();
      const entryData = createdEntry.data();
      
      // Convert timestamp
      if (entryData.timestamp && entryData.timestamp.toDate) {
        entryData.timestamp = entryData.timestamp.toDate();
      }
      
      return { id: entryRef.id, ...entryData };
    } catch (error) {
      console.error('Error creating food entry in Firestore:', error);
      throw error;
    }
  }

  async getUserFoodEntries(userId, startDate = null, endDate = null) {
    try {
      let query = this.db
        .collection(this.collections.foodEntries)
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc');

      if (startDate && endDate) {
        query = query
          .where('timestamp', '>=', startDate)
          .where('timestamp', '<=', endDate);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert timestamp
        if (data.timestamp && data.timestamp.toDate) {
          data.timestamp = data.timestamp.toDate();
        }
        return { id: doc.id, ...data };
      });
    } catch (error) {
      console.error('Error getting user food entries from Firestore:', error);
      throw error;
    }
  }

  // ============================================================================
  // EXERCISE ENTRIES
  // ============================================================================

  async createExerciseEntry(userId, exerciseData) {
    try {
      const entryRef = this.db.collection(this.collections.exerciseEntries).doc();
      
      const entry = {
        id: entryRef.id,
        userId,
        ...exerciseData,
        timestamp: FieldValue.serverTimestamp(),
        dataClassification: 'PHI'
      };

      await entryRef.set(entry);
      
      const createdEntry = await entryRef.get();
      const entryData = createdEntry.data();
      
      // Convert timestamp
      if (entryData.timestamp && entryData.timestamp.toDate) {
        entryData.timestamp = entryData.timestamp.toDate();
      }
      
      return { id: entryRef.id, ...entryData };
    } catch (error) {
      console.error('Error creating exercise entry in Firestore:', error);
      throw error;
    }
  }

  async getUserExerciseEntries(userId, startDate = null, endDate = null) {
    try {
      let query = this.db
        .collection(this.collections.exerciseEntries)
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc');

      if (startDate && endDate) {
        query = query
          .where('timestamp', '>=', startDate)
          .where('timestamp', '<=', endDate);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert timestamp
        if (data.timestamp && data.timestamp.toDate) {
          data.timestamp = data.timestamp.toDate();
        }
        return { id: doc.id, ...data };
      });
    } catch (error) {
      console.error('Error getting user exercise entries from Firestore:', error);
      throw error;
    }
  }

  // ============================================================================
  // WATER ENTRIES
  // ============================================================================

  async createWaterEntry(userId, waterData) {
    try {
      const entryRef = this.db.collection(this.collections.waterEntries).doc();
      
      const entry = {
        id: entryRef.id,
        userId,
        ...waterData,
        timestamp: FieldValue.serverTimestamp(),
        dataClassification: 'PHI'
      };

      await entryRef.set(entry);
      
      const createdEntry = await entryRef.get();
      const entryData = createdEntry.data();
      
      // Convert timestamp
      if (entryData.timestamp && entryData.timestamp.toDate) {
        entryData.timestamp = entryData.timestamp.toDate();
      }
      
      return { id: entryRef.id, ...entryData };
    } catch (error) {
      console.error('Error creating water entry in Firestore:', error);
      throw error;
    }
  }

  async getUserWaterEntries(userId, startDate = null, endDate = null) {
    try {
      let query = this.db
        .collection(this.collections.waterEntries)
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc');

      if (startDate && endDate) {
        query = query
          .where('timestamp', '>=', startDate)
          .where('timestamp', '<=', endDate);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert timestamp
        if (data.timestamp && data.timestamp.toDate) {
          data.timestamp = data.timestamp.toDate();
        }
        return { id: doc.id, ...data };
      });
    } catch (error) {
      console.error('Error getting user water entries from Firestore:', error);
      throw error;
    }
  }

  // ============================================================================
  // SLEEP ENTRIES
  // ============================================================================

  async createSleepEntry(userId, sleepData) {
    try {
      const entryRef = this.db.collection(this.collections.sleepEntries).doc();
      
      const entry = {
        id: entryRef.id,
        userId,
        ...sleepData,
        timestamp: FieldValue.serverTimestamp(),
        dataClassification: 'PHI'
      };

      await entryRef.set(entry);
      
      const createdEntry = await entryRef.get();
      const entryData = createdEntry.data();
      
      // Convert timestamp
      if (entryData.timestamp && entryData.timestamp.toDate) {
        entryData.timestamp = entryData.timestamp.toDate();
      }
      
      return { id: entryRef.id, ...entryData };
    } catch (error) {
      console.error('Error creating sleep entry in Firestore:', error);
      throw error;
    }
  }

  async getUserSleepEntries(userId, startDate = null, endDate = null) {
    try {
      let query = this.db
        .collection(this.collections.sleepEntries)
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc');

      if (startDate && endDate) {
        query = query
          .where('timestamp', '>=', startDate)
          .where('timestamp', '<=', endDate);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert timestamp
        if (data.timestamp && data.timestamp.toDate) {
          data.timestamp = data.timestamp.toDate();
        }
        return { id: doc.id, ...data };
      });
    } catch (error) {
      console.error('Error getting user sleep entries from Firestore:', error);
      throw error;
    }
  }

  // ============================================================================
  // MOOD ENTRIES
  // ============================================================================

  async createMoodEntry(userId, moodData) {
    try {
      const entryRef = this.db.collection(this.collections.moodEntries).doc();
      
      const entry = {
        id: entryRef.id,
        userId,
        ...moodData,
        timestamp: FieldValue.serverTimestamp(),
        dataClassification: 'PHI'
      };

      await entryRef.set(entry);
      
      const createdEntry = await entryRef.get();
      const entryData = createdEntry.data();
      
      // Convert timestamp
      if (entryData.timestamp && entryData.timestamp.toDate) {
        entryData.timestamp = entryData.timestamp.toDate();
      }
      
      return { id: entryRef.id, ...entryData };
    } catch (error) {
      console.error('Error creating mood entry in Firestore:', error);
      throw error;
    }
  }

  async getUserMoodEntries(userId, startDate = null, endDate = null) {
    try {
      let query = this.db
        .collection(this.collections.moodEntries)
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc');

      if (startDate && endDate) {
        query = query
          .where('timestamp', '>=', startDate)
          .where('timestamp', '<=', endDate);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert timestamp
        if (data.timestamp && data.timestamp.toDate) {
          data.timestamp = data.timestamp.toDate();
        }
        return { id: doc.id, ...data };
      });
    } catch (error) {
      console.error('Error getting user mood entries from Firestore:', error);
      throw error;
    }
  }

  // ============================================================================
  // ANALYTICS & AGGREGATION
  // ============================================================================

  async getAggregatedUserData(userId, timeframe = '30d') {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      // Calculate start date based on timeframe
      switch (timeframe) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      // Get all health data for the timeframe
      const [foodEntries, exerciseEntries, waterEntries, sleepEntries, moodEntries] = await Promise.all([
        this.getUserFoodEntries(userId, startDate, endDate),
        this.getUserExerciseEntries(userId, startDate, endDate),
        this.getUserWaterEntries(userId, startDate, endDate),
        this.getUserSleepEntries(userId, startDate, endDate),
        this.getUserMoodEntries(userId, startDate, endDate)
      ]);

      return {
        timeframe,
        startDate,
        endDate,
        summary: {
          totalFoodEntries: foodEntries.length,
          totalExerciseEntries: exerciseEntries.length,
          totalWaterEntries: waterEntries.length,
          totalSleepEntries: sleepEntries.length,
          totalMoodEntries: moodEntries.length,
          avgCaloriesPerDay: this.calculateAvgCaloriesPerDay(foodEntries),
          avgExerciseMinutesPerDay: this.calculateAvgExercisePerDay(exerciseEntries),
          avgWaterIntakePerDay: this.calculateAvgWaterPerDay(waterEntries),
          avgSleepHoursPerDay: this.calculateAvgSleepPerDay(sleepEntries),
          avgMoodRating: this.calculateAvgMoodRating(moodEntries)
        },
        data: {
          foodEntries,
          exerciseEntries,
          waterEntries,
          sleepEntries,
          moodEntries
        }
      };
    } catch (error) {
      console.error('Error getting aggregated user data from Firestore:', error);
      throw error;
    }
  }

  // ============================================================================
  // HELPER METHODS FOR ANALYTICS
  // ============================================================================

  calculateAvgCaloriesPerDay(foodEntries) {
    if (!foodEntries.length) return 0;
    const totalCalories = foodEntries.reduce((sum, entry) => sum + (entry.calories * (entry.quantity || 1)), 0);
    const uniqueDays = new Set(foodEntries.map(entry => 
      entry.timestamp.toDateString()
    )).size;
    return Math.round(totalCalories / Math.max(uniqueDays, 1));
  }

  calculateAvgExercisePerDay(exerciseEntries) {
    if (!exerciseEntries.length) return 0;
    const totalMinutes = exerciseEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const uniqueDays = new Set(exerciseEntries.map(entry => 
      entry.timestamp.toDateString()
    )).size;
    return Math.round(totalMinutes / Math.max(uniqueDays, 1));
  }

  calculateAvgWaterPerDay(waterEntries) {
    if (!waterEntries.length) return 0;
    const totalAmount = waterEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const uniqueDays = new Set(waterEntries.map(entry => 
      entry.timestamp.toDateString()
    )).size;
    return Math.round(totalAmount / Math.max(uniqueDays, 1));
  }

  calculateAvgSleepPerDay(sleepEntries) {
    if (!sleepEntries.length) return 0;
    const totalHours = sleepEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return Math.round((totalHours / sleepEntries.length) * 10) / 10;
  }

  calculateAvgMoodRating(moodEntries) {
    if (!moodEntries.length) return 0;
    const totalRating = moodEntries.reduce((sum, entry) => sum + entry.rating, 0);
    return Math.round((totalRating / moodEntries.length) * 10) / 10;
  }

  // ============================================================================
  // BATCH OPERATIONS FOR ANALYTICS EXPORT
  // ============================================================================

  async getAnonymizedDataForExport(startDate, endDate) {
    try {
      console.log(`📊 Exporting anonymized data from ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      // Get all collections data within date range
      const collections = [
        'food_entries',
        'exercise_entries',
        'water_entries', 
        'sleep_entries',
        'mood_entries'
      ];

      const exportData = {};

      for (const collectionName of collections) {
        const snapshot = await this.db
          .collection(collectionName)
          .where('timestamp', '>=', startDate)
          .where('timestamp', '<=', endDate)
          .get();

        // Anonymize the data - remove PII but keep health metrics
        exportData[collectionName] = snapshot.docs.map(doc => {
          const data = doc.data();
          
          // Convert Firestore timestamps to ISO strings
          const processedData = { ...data };
          if (processedData.timestamp && processedData.timestamp.toDate) {
            processedData.timestamp = processedData.timestamp.toDate().toISOString();
          }
          
          return {
            // Generate anonymous user ID hash
            anonymousUserId: crypto.createHash('sha256').update(data.userId).digest('hex'),
            // Keep all health data but remove identifying information
            ...Object.fromEntries(
              Object.entries(processedData).filter(([key]) => 
                !['userId', 'email', 'fullName', 'profilePicture'].includes(key)
              )
            ),
            exportedAt: new Date().toISOString()
          };
        });
      }

      return exportData;
    } catch (error) {
      console.error('Error getting anonymized data for export from Firestore:', error);
      throw error;
    }
  }
}

module.exports = new FirestoreService();