#!/usr/bin/env node

/**
 * Setup script for Google Cloud Platform resources
 * Run with: npm run setup-gcp
 */

const { storage, bigquery, projectId } = require('../config/gcp');
require('dotenv').config();

async function setupGCP() {
  console.log('🚀 Setting up Google Cloud Platform resources for CHT...\n');

  if (!projectId) {
    console.error('❌ GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is required');
    console.error('   Please set the full JSON content of your service account key file');
    process.exit(1);
  }

  console.log(`📊 Using Project ID: ${projectId}`);

  try {
    // Setup Cloud Storage
    console.log('\n📦 Setting up Cloud Storage...');
    const bucketName = process.env.GCS_ANALYTICS_BUCKET || 'cht-analytics-data-lake';
    
    try {
      const [bucketExists] = await storage.bucket(bucketName).exists();
      
      if (!bucketExists) {
        await storage.createBucket(bucketName, {
          location: 'US',
          storageClass: 'STANDARD',
          uniformBucketLevelAccess: true
        });
        console.log(`✅ Created bucket: ${bucketName}`);
      } else {
        console.log(`✅ Bucket already exists: ${bucketName}`);
      }
    } catch (error) {
      console.error(`❌ Error setting up Cloud Storage: ${error.message}`);
    }

    // Setup BigQuery
    console.log('\n📊 Setting up BigQuery...');
    const datasetId = process.env.BIGQUERY_DATASET_ID || 'cht_analytics';
    
    try {
      const [datasetExists] = await bigquery.dataset(datasetId).exists();
      
      if (!datasetExists) {
        await bigquery.createDataset(datasetId, {
          location: 'US',
          description: 'CHT Analytics Data Warehouse for ML and Trend Analysis'
        });
        console.log(`✅ Created dataset: ${datasetId}`);
      } else {
        console.log(`✅ Dataset already exists: ${datasetId}`);
      }

      // Create tables
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
          const [tableExists] = await bigquery.dataset(datasetId).table(table.name).exists();
          
          if (!tableExists) {
            await bigquery.dataset(datasetId).createTable(table.name, {
              schema: table.schema,
              timePartitioning: {
                type: 'DAY',
                field: 'timestamp'
              },
              clustering: {
                fields: ['anonymousUserId']
              }
            });
            console.log(`✅ Created table: ${table.name}`);
          } else {
            console.log(`✅ Table already exists: ${table.name}`);
          }
        } catch (error) {
          console.error(`❌ Error creating table ${table.name}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error setting up BigQuery: ${error.message}`);
    }

    console.log('\n🎉 GCP setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Ensure your .env file has GOOGLE_APPLICATION_CREDENTIALS_JSON set');
    console.log('2. Verify your service account has the following roles:');
    console.log('   - Cloud Datastore User (for Firestore)');
    console.log('   - Storage Admin (for Cloud Storage)');
    console.log('   - BigQuery Admin (for BigQuery)');
    console.log('3. Start your application with: npm run dev:full');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupGCP();
}

module.exports = setupGCP;