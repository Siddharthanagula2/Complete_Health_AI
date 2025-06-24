import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
import { BigQuery } from '@google-cloud/bigquery';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

console.log('🚀 Starting GCP Setup...\n');

// Validate environment variables
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  console.error('❌ GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is required');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  console.log('✅ Service account JSON parsed successfully');
  console.log(`📋 Project ID: ${serviceAccount.project_id}`);
  console.log(`📧 Service Account Email: ${serviceAccount.client_email}\n`);
} catch (error) {
  console.error('❌ Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON format:', error.message);
  process.exit(1);
}

// Initialize GCP clients
const firestore = new Firestore({
  projectId: serviceAccount.project_id,
  credentials: serviceAccount
});

const storage = new Storage({
  projectId: serviceAccount.project_id,
  credentials: serviceAccount
});

const bigquery = new BigQuery({
  projectId: serviceAccount.project_id,
  credentials: serviceAccount
});

const bucketName = process.env.GCS_ANALYTICS_BUCKET || 'cht-analytics-data-lake';
const datasetId = process.env.BIGQUERY_DATASET_ID || 'cht_analytics';

async function setupFirestore() {
  console.log('🔥 Setting up Firestore...');
  
  try {
    // Test Firestore connection
    const testDoc = firestore.collection('_test').doc('connection');
    await testDoc.set({ timestamp: new Date(), test: true });
    await testDoc.delete();
    
    console.log('✅ Firestore connection successful');
    
    // Create indexes (if needed)
    console.log('📝 Firestore indexes will be created automatically on first query');
    
  } catch (error) {
    console.error('❌ Firestore setup failed:', error.message);
    throw error;
  }
}

async function setupCloudStorage() {
  console.log('☁️ Setting up Cloud Storage...');
  
  try {
    const bucket = storage.bucket(bucketName);
    
    // Check if bucket exists
    const [exists] = await bucket.exists();
    
    if (!exists) {
      console.log(`📦 Creating bucket: ${bucketName}`);
      await storage.createBucket(bucketName, {
        location: 'US',
        storageClass: 'STANDARD',
        uniformBucketLevelAccess: true
      });
      console.log(`✅ Bucket ${bucketName} created successfully`);
    } else {
      console.log(`✅ Bucket ${bucketName} already exists`);
    }
    
    // Test bucket access
    await bucket.getMetadata();
    console.log('✅ Cloud Storage access verified');
    
  } catch (error) {
    console.error('❌ Cloud Storage setup failed:', error.message);
    throw error;
  }
}

async function setupBigQuery() {
  console.log('📊 Setting up BigQuery...');
  
  try {
    const dataset = bigquery.dataset(datasetId);
    
    // Check if dataset exists
    const [exists] = await dataset.exists();
    
    if (!exists) {
      console.log(`📋 Creating dataset: ${datasetId}`);
      await bigquery.createDataset(datasetId, {
        location: 'US',
        description: 'Complete Health Tracker Analytics Dataset'
      });
      console.log(`✅ Dataset ${datasetId} created successfully`);
    } else {
      console.log(`✅ Dataset ${datasetId} already exists`);
    }
    
    // Create tables
    await createBigQueryTables(dataset);
    
  } catch (error) {
    console.error('❌ BigQuery setup failed:', error.message);
    throw error;
  }
}

async function createBigQueryTables(dataset) {
  const tables = [
    {
      name: 'user_analytics',
      schema: [
        { name: 'anonymous_user_id', type: 'STRING', mode: 'REQUIRED' },
        { name: 'date', type: 'DATE', mode: 'REQUIRED' },
        { name: 'age_group', type: 'STRING', mode: 'NULLABLE' },
        { name: 'gender', type: 'STRING', mode: 'NULLABLE' },
        { name: 'activity_level', type: 'STRING', mode: 'NULLABLE' },
        { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' }
      ]
    },
    {
      name: 'nutrition_analytics',
      schema: [
        { name: 'anonymous_user_id', type: 'STRING', mode: 'REQUIRED' },
        { name: 'date', type: 'DATE', mode: 'REQUIRED' },
        { name: 'total_calories', type: 'FLOAT', mode: 'NULLABLE' },
        { name: 'total_protein', type: 'FLOAT', mode: 'NULLABLE' },
        { name: 'total_carbs', type: 'FLOAT', mode: 'NULLABLE' },
        { name: 'total_fat', type: 'FLOAT', mode: 'NULLABLE' },
        { name: 'meal_count', type: 'INTEGER', mode: 'NULLABLE' },
        { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' }
      ]
    },
    {
      name: 'exercise_analytics',
      schema: [
        { name: 'anonymous_user_id', type: 'STRING', mode: 'REQUIRED' },
        { name: 'date', type: 'DATE', mode: 'REQUIRED' },
        { name: 'total_duration', type: 'INTEGER', mode: 'NULLABLE' },
        { name: 'total_calories_burned', type: 'FLOAT', mode: 'NULLABLE' },
        { name: 'exercise_types', type: 'STRING', mode: 'REPEATED' },
        { name: 'workout_count', type: 'INTEGER', mode: 'NULLABLE' },
        { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' }
      ]
    },
    {
      name: 'wellness_analytics',
      schema: [
        { name: 'anonymous_user_id', type: 'STRING', mode: 'REQUIRED' },
        { name: 'date', type: 'DATE', mode: 'REQUIRED' },
        { name: 'water_intake', type: 'FLOAT', mode: 'NULLABLE' },
        { name: 'sleep_duration', type: 'FLOAT', mode: 'NULLABLE' },
        { name: 'sleep_quality', type: 'FLOAT', mode: 'NULLABLE' },
        { name: 'mood_rating', type: 'FLOAT', mode: 'NULLABLE' },
        { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' }
      ]
    }
  ];

  for (const tableConfig of tables) {
    try {
      const table = dataset.table(tableConfig.name);
      const [exists] = await table.exists();
      
      if (!exists) {
        console.log(`📋 Creating table: ${tableConfig.name}`);
        await dataset.createTable(tableConfig.name, {
          schema: tableConfig.schema,
          timePartitioning: {
            type: 'DAY',
            field: 'date'
          },
          clustering: {
            fields: ['anonymous_user_id']
          }
        });
        console.log(`✅ Table ${tableConfig.name} created successfully`);
      } else {
        console.log(`✅ Table ${tableConfig.name} already exists`);
      }
    } catch (error) {
      console.error(`❌ Failed to create table ${tableConfig.name}:`, error.message);
      throw error;
    }
  }
}

async function verifySetup() {
  console.log('🔍 Verifying setup...');
  
  try {
    // Test Firestore
    const testDoc = firestore.collection('_setup_test').doc('verification');
    await testDoc.set({ verified: true, timestamp: new Date() });
    await testDoc.delete();
    console.log('✅ Firestore verification passed');
    
    // Test Cloud Storage
    const bucket = storage.bucket(bucketName);
    await bucket.getMetadata();
    console.log('✅ Cloud Storage verification passed');
    
    // Test BigQuery
    const dataset = bigquery.dataset(datasetId);
    await dataset.getMetadata();
    console.log('✅ BigQuery verification passed');
    
  } catch (error) {
    console.error('❌ Setup verification failed:', error.message);
    throw error;
  }
}

async function main() {
  try {
    await setupFirestore();
    await setupCloudStorage();
    await setupBigQuery();
    await verifySetup();
    
    console.log('\n🎉 GCP Setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • Firestore: Ready for health data storage`);
    console.log(`   • Cloud Storage: Bucket "${bucketName}" ready for analytics exports`);
    console.log(`   • BigQuery: Dataset "${datasetId}" with analytics tables created`);
    console.log('\n🚀 You can now start the application with: npm run dev:full');
    
  } catch (error) {
    console.error('\n💥 Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Verify your service account has the required IAM roles:');
    console.log('      • Cloud Datastore User (for Firestore)');
    console.log('      • Storage Admin (for Cloud Storage)');
    console.log('      • BigQuery Data Editor (for BigQuery)');
    console.log('   2. Ensure the following APIs are enabled:');
    console.log('      • Firestore API');
    console.log('      • Cloud Storage API');
    console.log('      • BigQuery API');
    console.log('   3. Check that your GOOGLE_APPLICATION_CREDENTIALS_JSON is valid JSON');
    process.exit(1);
  }
}

main();