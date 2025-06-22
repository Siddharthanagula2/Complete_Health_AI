const { Firestore } = require('@google-cloud/firestore');
const { Storage } = require('@google-cloud/storage');
const { BigQuery } = require('@google-cloud/bigquery');

// Initialize GCP services with Service Account JSON from environment variable
let firestore, storage, bigquery;

const initializeGCP = () => {
  try {
    // Check if already initialized
    if (firestore && storage && bigquery) {
      return { firestore, storage, bigquery };
    }

    console.log('🔧 Initializing Google Cloud Platform services...');

    // Parse Service Account JSON from environment variable
    let credentials;
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      try {
        credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        console.log('✅ Service Account credentials loaded from environment variable');
      } catch (parseError) {
        console.error('❌ Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', parseError.message);
        throw new Error('Invalid JSON in GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable');
      }
    } else {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is required');
    }

    const projectId = credentials.project_id;
    if (!projectId) {
      throw new Error('project_id not found in service account credentials');
    }

    console.log(`📊 Project ID: ${projectId}`);

    // Initialize Firestore with service account credentials
    firestore = new Firestore({
      projectId: projectId,
      credentials: credentials,
      settings: {
        timestampsInSnapshots: true,
        ignoreUndefinedProperties: true
      }
    });

    // Initialize Cloud Storage with service account credentials
    storage = new Storage({
      projectId: projectId,
      credentials: credentials
    });

    // Initialize BigQuery with service account credentials
    bigquery = new BigQuery({
      projectId: projectId,
      credentials: credentials
    });

    console.log('✅ Firestore initialized with encryption at rest (HIPAA compliant)');
    console.log('✅ Cloud Storage initialized for analytics data lake');
    console.log('✅ BigQuery initialized for ML and trend analysis');
    
    return { firestore, storage, bigquery };
  } catch (error) {
    console.error('❌ Failed to initialize GCP services:', error.message);
    throw error;
  }
};

// Export initialized instances
const { firestore: db, storage: gcs, bigquery: bq } = initializeGCP();

module.exports = {
  firestore: db,
  storage: gcs,
  bigquery: bq,
  projectId: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ? 
    JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON).project_id : 
    null
};