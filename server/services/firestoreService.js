const { Firestore } = require('@google-cloud/firestore');

// Initialize Firestore
let db;

try {
  // Parse the service account JSON from environment variable
  const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  
  db = new Firestore({
    projectId: serviceAccount.project_id,
    credentials: serviceAccount
  });
  
  console.log('✅ Firestore initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firestore:', error.message);
  process.exit(1);
}

class FirestoreService {
  // User operations
  async createUser(userData) {
    try {
      const userRef = db.collection('users').doc();
      await userRef.set({
        ...userData,
        createdAt: new Date(),
        points: userData.points || 0,
        level: userData.level || 1
      });
      return userRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        return null;
      }
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const userDoc = snapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  async updateUser(userId, updates) {
    try {
      await db.collection('users').doc(userId).update({
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Points and leveling system
  async awardPoints(userId, points) {
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      const currentPoints = userData.points || 0;
      const currentLevel = userData.level || 1;
      const newPoints = currentPoints + points;
      
      // Calculate new level (every 1000 points = 1 level)
      const newLevel = Math.floor(newPoints / 1000) + 1;
      
      await userRef.update({
        points: newPoints,
        level: newLevel,
        updatedAt: new Date()
      });
      
      return { newPoints, newLevel, leveledUp: newLevel > currentLevel };
    } catch (error) {
      console.error('Error awarding points:', error);
      throw error;
    }
  }

  // Food entries
  async createFoodEntry(entryData) {
    try {
      const entryRef = db.collection('food_entries').doc();
      await entryRef.set({
        ...entryData,
        createdAt: new Date()
      });
      return entryRef.id;
    } catch (error) {
      console.error('Error creating food entry:', error);
      throw error;
    }
  }

  async getFoodEntries(userId, limit = 100) {
    try {
      const entriesRef = db.collection('food_entries');
      const snapshot = await entriesRef
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting food entries:', error);
      throw error;
    }
  }

  // Exercise entries
  async createExerciseEntry(entryData) {
    try {
      const entryRef = db.collection('exercise_entries').doc();
      await entryRef.set({
        ...entryData,
        createdAt: new Date()
      });
      return entryRef.id;
    } catch (error) {
      console.error('Error creating exercise entry:', error);
      throw error;
    }
  }

  async getExerciseEntries(userId, limit = 100) {
    try {
      const entriesRef = db.collection('exercise_entries');
      const snapshot = await entriesRef
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting exercise entries:', error);
      throw error;
    }
  }

  // Water entries
  async createWaterEntry(entryData) {
    try {
      const entryRef = db.collection('water_entries').doc();
      await entryRef.set({
        ...entryData,
        createdAt: new Date()
      });
      return entryRef.id;
    } catch (error) {
      console.error('Error creating water entry:', error);
      throw error;
    }
  }

  async getWaterEntries(userId, limit = 100) {
    try {
      const entriesRef = db.collection('water_entries');
      const snapshot = await entriesRef
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting water entries:', error);
      throw error;
    }
  }

  // Sleep entries
  async createSleepEntry(entryData) {
    try {
      const entryRef = db.collection('sleep_entries').doc();
      await entryRef.set({
        ...entryData,
        createdAt: new Date()
      });
      return entryRef.id;
    } catch (error) {
      console.error('Error creating sleep entry:', error);
      throw error;
    }
  }

  async getSleepEntries(userId, limit = 100) {
    try {
      const entriesRef = db.collection('sleep_entries');
      const snapshot = await entriesRef
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting sleep entries:', error);
      throw error;
    }
  }

  // Mood entries
  async createMoodEntry(entryData) {
    try {
      const entryRef = db.collection('mood_entries').doc();
      await entryRef.set({
        ...entryData,
        createdAt: new Date()
      });
      return entryRef.id;
    } catch (error) {
      console.error('Error creating mood entry:', error);
      throw error;
    }
  }

  async getMoodEntries(userId, limit = 100) {
    try {
      const entriesRef = db.collection('mood_entries');
      const snapshot = await entriesRef
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting mood entries:', error);
      throw error;
    }
  }

  // Analytics queries for AI insights
  async getRecentHealthData(userId, days = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const [foodEntries, exerciseEntries, waterEntries, sleepEntries, moodEntries] = await Promise.all([
        this.getEntriesSince('food_entries', userId, cutoffDate),
        this.getEntriesSince('exercise_entries', userId, cutoffDate),
        this.getEntriesSince('water_entries', userId, cutoffDate),
        this.getEntriesSince('sleep_entries', userId, cutoffDate, 'date'),
        this.getEntriesSince('mood_entries', userId, cutoffDate)
      ]);

      return {
        food: foodEntries,
        exercise: exerciseEntries,
        water: waterEntries,
        sleep: sleepEntries,
        mood: moodEntries
      };
    } catch (error) {
      console.error('Error getting recent health data:', error);
      throw error;
    }
  }

  async getEntriesSince(collection, userId, sinceDate, dateField = 'timestamp') {
    try {
      const entriesRef = db.collection(collection);
      const snapshot = await entriesRef
        .where('userId', '==', userId)
        .where(dateField, '>=', sinceDate)
        .orderBy(dateField, 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting ${collection} since ${sinceDate}:`, error);
      throw error;
    }
  }
}

module.exports = new FirestoreService();