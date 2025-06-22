const admin = require('firebase-admin');
const { Firestore } = require('@google-cloud/firestore');

// Initialize Firebase Admin SDK
let firebaseApp;
let db;

const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (firebaseApp) {
      return { firebaseApp, db };
    }

    // Initialize with service account key or default credentials
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Using service account key file
      firebaseApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
      });
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Using service account key from environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
      });
    } else {
      // Using default credentials (for Cloud Run, Compute Engine, etc.)
      firebaseApp = admin.initializeApp({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
      });
    }

    // Initialize Firestore with encryption at rest (default)
    db = new Firestore({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      // Firestore automatically encrypts data at rest for HIPAA compliance
      settings: {
        timestampsInSnapshots: true,
        ignoreUndefinedProperties: true
      }
    });

    console.log('✅ Firebase and Firestore initialized successfully');
    console.log(`📊 Project ID: ${process.env.GOOGLE_CLOUD_PROJECT_ID}`);
    
    return { firebaseApp, db };
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
    throw error;
  }
};

// Export initialized instances
const { firebaseApp: app, db: firestore } = initializeFirebase();

module.exports = {
  admin,
  firestore,
  app
};