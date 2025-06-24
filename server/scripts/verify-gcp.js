import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

console.log('🔍 Verifying GCP Configuration...\n');

// Check if environment variable exists
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  console.error('❌ GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is missing');
  console.log('\n💡 Solution:');
  console.log('   1. Create a service account in Google Cloud Console');
  console.log('   2. Download the JSON key file');
  console.log('   3. Copy the entire JSON content as a single line string');
  console.log('   4. Add it to your server/.env file as GOOGLE_APPLICATION_CREDENTIALS_JSON');
  process.exit(1);
}

// Validate JSON format
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  console.log('✅ Service account JSON format is valid');
} catch (error) {
  console.error('❌ Invalid JSON format in GOOGLE_APPLICATION_CREDENTIALS_JSON');
  console.error('Error:', error.message);
  console.log('\n💡 Solution:');
  console.log('   1. Ensure the JSON is properly escaped');
  console.log('   2. Remove any line breaks or extra spaces');
  console.log('   3. Verify all quotes are properly escaped');
  process.exit(1);
}

// Validate required fields
const requiredFields = [
  'type',
  'project_id',
  'private_key_id',
  'private_key',
  'client_email',
  'client_id',
  'auth_uri',
  'token_uri'
];

const missingFields = requiredFields.filter(field => !serviceAccount[field]);

if (missingFields.length > 0) {
  console.error('❌ Missing required fields in service account JSON:');
  missingFields.forEach(field => console.error(`   • ${field}`));
  console.log('\n💡 Solution:');
  console.log('   1. Download a fresh service account JSON from Google Cloud Console');
  console.log('   2. Ensure you downloaded the complete file');
  process.exit(1);
}

console.log('✅ All required fields present in service account JSON');

// Display configuration summary
console.log('\n📋 Configuration Summary:');
console.log(`   • Project ID: ${serviceAccount.project_id}`);
console.log(`   • Service Account Email: ${serviceAccount.client_email}`);
console.log(`   • Service Account Type: ${serviceAccount.type}`);

// Check optional environment variables
const bucketName = process.env.GCS_ANALYTICS_BUCKET || 'cht-analytics-data-lake';
const datasetId = process.env.BIGQUERY_DATASET_ID || 'cht_analytics';

console.log(`   • Cloud Storage Bucket: ${bucketName}`);
console.log(`   • BigQuery Dataset: ${datasetId}`);

console.log('\n✅ GCP Configuration verification completed successfully!');
console.log('\n🚀 Next steps:');
console.log('   1. Run: npm run setup-gcp');
console.log('   2. Start the application: npm run dev:full');

console.log('\n🔐 Required IAM Roles for your service account:');
console.log('   • Cloud Datastore User (for Firestore)');
console.log('   • Storage Admin (for Cloud Storage)');
console.log('   • BigQuery Data Editor (for BigQuery)');

console.log('\n🔌 Required APIs to enable in Google Cloud Console:');
console.log('   • Firestore API');
console.log('   • Cloud Storage API');
console.log('   • BigQuery API');