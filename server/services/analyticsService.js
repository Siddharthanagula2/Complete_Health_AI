const { storage, bigquery, projectId } = require('../config/gcp');
const firestoreService = require('./firestoreService');
const cron = require('node-cron');

class AnalyticsService {
  constructor() {
    this.storage = storage;
    this.bigquery = bigquery;
    this.projectId = projectId;
    
    this.bucketName = process.env.GCS_ANALYTICS_BUCKET || 'cht-analytics-data-lake';
    this.datasetId = process.env.BIGQUERY_DATASET_ID || 'cht_analytics';
    
    this.initializeBucket();
    this.initializeBigQueryDataset();
    this.scheduleDataExport();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  async initializeBucket() {
    try {
      const [bucketExists] = await this.storage.bucket(this.bucketName).exists();
      
      if (!bucketExists) {
        console.log(`📦 Creating Cloud Storage bucket: ${this.bucketName}`);
        await this.storage.createBucket(this.bucketName, {
          location: 'US',
          storageClass: 'STANDARD',
          uniformBucketLevelAccess: true
        });
        console.log(`✅ Bucket ${this.bucketName} created successfully`);
      } else {
        console.log(`✅ Bucket ${this.bucketName} already exists`);
      }
    } catch (error) {
      console.error('❌ Error initializing Cloud Storage bucket:', error);
    }
  }

  async initializeBigQueryDataset() {
    try {
      const [datasetExists] = await this.bigquery.dataset(this.datasetId).exists();
      
      if (!datasetExists) {
        console.log(`📊 Creating BigQuery dataset: ${this.datasetId}`);
        await this.bigquery.createDataset(this.datasetId, {
          location: 'US',
          description: 'CHT Analytics Data Warehouse for ML and Trend Analysis'
        });
        console.log(`✅ Dataset ${this.datasetId} created successfully`);
        
        // Create tables
        await this.createBigQueryTables();
      } else {
        console.log(`✅ Dataset ${this.datasetId} already exists`);
      }
    } catch (error) {
      console.error('❌ Error initializing BigQuery dataset:', error);
    }
  }

  async createBigQueryTables() {
    const tables = [
      {
        name: 'food_entries',
        schema: [
          { name: 'anonymousUserId', type: 'STRING', mode: 'REQUIRED' },
          { name: 'name', type: 'STRING' },
          { name: 'calories', type: 'FLOAT' },
          { name: 'protein', type: 'FLOAT' },
          { name: 'carbs', type: 'FLOAT' },
          { name: 'fat', type: 'FLOAT' },
          { name: 'fiber', type: 'FLOAT' },
          { name: 'meal', type: 'STRING' },
          { name: 'quantity', type: 'FLOAT' },
          { name: 'timestamp', type: 'TIMESTAMP' },
          { name: 'exportedAt', type: 'TIMESTAMP' }
        ]
      },
      {
        name: 'exercise_entries',
        schema: [
          { name: 'anonymousUserId', type: 'STRING', mode: 'REQUIRED' },
          { name: 'name', type: 'STRING' },
          { name: 'type', type: 'STRING' },
          { name: 'duration', type: 'INTEGER' },
          { name: 'calories', type: 'FLOAT' },
          { name: 'intensity', type: 'STRING' },
          { name: 'timestamp', type: 'TIMESTAMP' },
          { name: 'exportedAt', type: 'TIMESTAMP' }
        ]
      },
      {
        name: 'water_entries',
        schema: [
          { name: 'anonymousUserId', type: 'STRING', mode: 'REQUIRED' },
          { name: 'amount', type: 'FLOAT' },
          { name: 'timestamp', type: 'TIMESTAMP' },
          { name: 'exportedAt', type: 'TIMESTAMP' }
        ]
      },
      {
        name: 'sleep_entries',
        schema: [
          { name: 'anonymousUserId', type: 'STRING', mode: 'REQUIRED' },
          { name: 'duration', type: 'FLOAT' },
          { name: 'quality', type: 'INTEGER' },
          { name: 'bedtime', type: 'STRING' },
          { name: 'wakeTime', type: 'STRING' },
          { name: 'timestamp', type: 'TIMESTAMP' },
          { name: 'exportedAt', type: 'TIMESTAMP' }
        ]
      },
      {
        name: 'mood_entries',
        schema: [
          { name: 'anonymousUserId', type: 'STRING', mode: 'REQUIRED' },
          { name: 'rating', type: 'INTEGER' },
          { name: 'factors', type: 'STRING', mode: 'REPEATED' },
          { name: 'timestamp', type: 'TIMESTAMP' },
          { name: 'exportedAt', type: 'TIMESTAMP' }
        ]
      }
    ];

    for (const table of tables) {
      try {
        await this.bigquery.dataset(this.datasetId).createTable(table.name, {
          schema: table.schema,
          timePartitioning: {
            type: 'DAY',
            field: 'timestamp'
          },
          clustering: {
            fields: ['anonymousUserId']
          }
        });
        console.log(`✅ Created BigQuery table: ${table.name}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`✅ BigQuery table ${table.name} already exists`);
        } else {
          console.error(`❌ Error creating table ${table.name}:`, error);
        }
      }
    }
  }

  // ============================================================================
  // DATA EXPORT PIPELINE
  // ============================================================================

  async exportDailyData(date = new Date()) {
    try {
      console.log(`🚀 Starting daily data export for ${date.toDateString()}`);
      
      // Calculate date range (previous day)
      const startDate = new Date(date);
      startDate.setDate(date.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setDate(date.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);

      // Get anonymized data from Firestore
      const anonymizedData = await firestoreService.getAnonymizedDataForExport(startDate, endDate);
      
      // Upload to Cloud Storage
      const fileName = `daily-export-${startDate.toISOString().split('T')[0]}.json`;
      await this.uploadToCloudStorage(anonymizedData, fileName);
      
      // Load into BigQuery
      await this.loadIntoBigQuery(anonymizedData);
      
      console.log(`✅ Daily data export completed for ${date.toDateString()}`);
      
      return {
        success: true,
        exportDate: startDate,
        fileName,
        recordCounts: Object.fromEntries(
          Object.entries(anonymizedData).map(([key, value]) => [key, value.length])
        )
      };
    } catch (error) {
      console.error('❌ Error in daily data export:', error);
      throw error;
    }
  }

  async uploadToCloudStorage(data, fileName) {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(`daily-exports/${fileName}`);
      
      await file.save(JSON.stringify(data, null, 2), {
        metadata: {
          contentType: 'application/json',
          metadata: {
            exportedAt: new Date().toISOString(),
            dataClassification: 'anonymized_phi',
            purpose: 'analytics_ml_training'
          }
        }
      });
      
      console.log(`📦 Uploaded ${fileName} to Cloud Storage`);
    } catch (error) {
      console.error('❌ Error uploading to Cloud Storage:', error);
      throw error;
    }
  }

  async loadIntoBigQuery(data) {
    try {
      const dataset = this.bigquery.dataset(this.datasetId);
      
      for (const [tableName, records] of Object.entries(data)) {
        if (records.length === 0) continue;
        
        const table = dataset.table(tableName);
        
        // Transform data for BigQuery
        const transformedRecords = records.map(record => ({
          ...record,
          timestamp: record.timestamp,
          exportedAt: new Date().toISOString()
        }));
        
        await table.insert(transformedRecords);
        console.log(`📊 Loaded ${records.length} records into BigQuery table: ${tableName}`);
      }
    } catch (error) {
      console.error('❌ Error loading into BigQuery:', error);
      throw error;
    }
  }

  // ============================================================================
  // SCHEDULED EXPORT
  // ============================================================================

  scheduleDataExport() {
    // Schedule daily export at 2 AM UTC
    cron.schedule('0 2 * * *', async () => {
      try {
        console.log('⏰ Starting scheduled daily data export...');
        await this.exportDailyData();
      } catch (error) {
        console.error('❌ Scheduled export failed:', error);
      }
    }, {
      timezone: 'UTC'
    });
    
    console.log('⏰ Scheduled daily data export at 2:00 AM UTC');
  }

  // ============================================================================
  // ANALYTICS QUERIES
  // ============================================================================

  async runAnalyticsQuery(query) {
    try {
      const [job] = await this.bigquery.createQueryJob({
        query,
        location: 'US'
      });
      
      const [rows] = await job.getQueryResults();
      return rows;
    } catch (error) {
      console.error('❌ Error running analytics query:', error);
      throw error;
    }
  }

  async getPopulationHealthTrends(timeframe = '30d') {
    const query = `
      SELECT 
        DATE(timestamp) as date,
        COUNT(DISTINCT anonymousUserId) as active_users,
        AVG(calories) as avg_calories,
        AVG(protein) as avg_protein,
        AVG(carbs) as avg_carbs,
        AVG(fat) as avg_fat
      FROM \`${this.projectId}.${this.datasetId}.food_entries\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${timeframe.replace('d', '')} DAY)
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `;
    
    return await this.runAnalyticsQuery(query);
  }

  async getExerciseTrends(timeframe = '30d') {
    const query = `
      SELECT 
        DATE(timestamp) as date,
        type as exercise_type,
        COUNT(*) as session_count,
        AVG(duration) as avg_duration,
        AVG(calories) as avg_calories_burned
      FROM \`${this.projectId}.${this.datasetId}.exercise_entries\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${timeframe.replace('d', '')} DAY)
      GROUP BY DATE(timestamp), type
      ORDER BY date DESC, session_count DESC
    `;
    
    return await this.runAnalyticsQuery(query);
  }

  async getSleepQualityTrends(timeframe = '30d') {
    const query = `
      SELECT 
        DATE(timestamp) as date,
        AVG(duration) as avg_sleep_duration,
        AVG(quality) as avg_sleep_quality,
        COUNT(DISTINCT anonymousUserId) as users_tracked
      FROM \`${this.projectId}.${this.datasetId}.sleep_entries\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${timeframe.replace('d', '')} DAY)
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `;
    
    return await this.runAnalyticsQuery(query);
  }
}

module.exports = new AnalyticsService();