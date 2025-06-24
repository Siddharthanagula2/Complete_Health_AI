# Complete Health Tracker

A comprehensive health and wellness tracking application with AI-powered insights, now powered by Google Cloud Platform for enterprise-scale data management and HIPAA compliance.

## 🏗️ Architecture Overview

### Data Storage & Analytics Pipeline

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Firestore     │    │  Cloud Storage   │    │    BigQuery     │
│ (Primary DB)    │───▶│   (Data Lake)    │───▶│  (Analytics)    │
│                 │    │                  │    │                 │
│ • User Data     │    │ • Daily Exports  │    │ • ML Training   │
│ • Health Metrics│    │ • Anonymized PHI │    │ • Trend Analysis│
│ • Encrypted     │    │ • JSON Format    │    │ • Population    │
│   at Rest       │    │ • Partitioned    │    │   Health Stats  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Google Cloud Platform account
- GCP Project with billing enabled
- Service Account JSON key file

### 2. Environment Configuration

Create `server/.env` file with your service account JSON:

```bash
# Google OAuth (existing)
GOOGLE_CLIENT_ID=xxxxxxxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxxxxx

# Google Cloud Platform Service Account JSON (REQUIRED)
# Copy the entire content of your service account JSON file as a single line string
GOOGLE_APPLICATION_CREDENTIALS_JSON={xxxxxxx}

# Analytics Pipeline
GCS_ANALYTICS_BUCKET=xxxxxxxx
BIGQUERY_DATASET_ID=xxxxx

# Security
JWT_SECRET=your-secure-jwt-secret-here

# Server
PORT=xxxx
NODE_ENV=xxxxxxxxx
```

### 3. Install Dependencies & Setup

```bash
# Install all dependencies
npm install

# Setup GCP resources (buckets, datasets, tables)
npm run setup-gcp

# Start the application
npm run dev:full
```

## 🔥 Firestore Database Schema

### Collections Structure

```
users/
├── {userId}/
    ├── id: string
    ├── email: string
    ├── fullName: string
    ├── authProvider: 'email' | 'google'
    ├── createdAt: timestamp
    ├── dataClassification: 'PHI'
    └── encryptionStatus: 'encrypted_at_rest'

food_entries/
├── {entryId}/
    ├── userId: string
    ├── name: string
    ├── calories: number
    ├── protein: number
    ├── meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    ├── timestamp: timestamp
    └── dataClassification: 'PHI'

exercise_entries/
water_entries/
sleep_entries/
mood_entries/
```

## 📊 Analytics Pipeline

### Daily Data Export Process

1. **Scheduled Export** (2 AM UTC daily)
   - Extracts previous day's data from Firestore
   - Anonymizes user data (removes PII, keeps health metrics)
   - Uploads to Cloud Storage as JSON

2. **BigQuery Loading**
   - Automatically loads anonymized data into BigQuery tables
   - Partitioned by date for optimal query performance
   - Clustered by anonymous user ID

3. **Analytics Queries**
   - Population health trends
   - Exercise pattern analysis
   - Sleep quality correlations
   - Nutrition insights for ML training

### Manual Export

```bash
# Export yesterday's data manually
npm run export-analytics
```

## 🔐 HIPAA Compliance Features

### Data Encryption
- **At Rest**: Firestore automatically encrypts all data
- **In Transit**: All API calls use HTTPS/TLS
- **Service Account**: Secure authentication with JSON key

### Data Anonymization
- User IDs hashed with SHA-256 for analytics
- PII removed from exported datasets
- Health metrics preserved for research

### Access Controls
- Service account with minimal required permissions
- Role-based access control (RBAC)
- Audit logging enabled

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/signup` - Manual user registration
- `POST /api/auth/login` - Email/password login
- `GET /auth/google` - Google OAuth initiation
- `GET /auth/google/callback` - Google OAuth callback

### Health Data
- `POST /api/health/food` - Create food entry
- `GET /api/health/food` - Get user food entries
- `POST /api/health/exercise` - Create exercise entry
- `GET /api/health/exercise` - Get user exercise entries
- `POST /api/health/water` - Create water entry
- `GET /api/health/water` - Get user water entries
- `POST /api/health/sleep` - Create sleep entry
- `GET /api/health/sleep` - Get user sleep entries
- `POST /api/health/mood` - Create mood entry
- `GET /api/health/mood` - Get user mood entries
- `GET /api/health/summary` - Get aggregated health data

### Analytics
- `POST /api/analytics/export` - Manual data export
- `GET /api/analytics/trends/nutrition` - Population nutrition trends

## 🔧 Development Commands

```bash
# Start frontend + backend
npm run dev:full

# Backend only
npm run server

# Frontend only  
npm run dev

# Setup GCP resources
npm run setup-gcp

# Manual analytics export
npm run export-analytics

# Build for production
npm run build
```

## 📈 Monitoring & Observability

### Health Check
```bash
curl http://localhost:3001/health
```

### Logs
- Application logs include request tracking
- GCP operations logged with timestamps
- Error tracking with stack traces

### Metrics
- Daily export success/failure rates
- API response times
- Database query performance

## 🚀 Production Deployment

### Environment Variables for Production
```bash
# Update redirect URI for production
REDIRECT_URI=https://your-api-domain.com/auth/google/callback

# Production database settings
NODE_ENV=production
```

## 🔍 Troubleshooting

### Common Issues

1. **Service Account Authentication Error**
   ```bash
   # Verify JSON format in environment variable
   echo $GOOGLE_APPLICATION_CREDENTIALS_JSON | jq .
   ```

2. **Firestore Permission Denied**
   ```bash
   # Check service account has Datastore User role
   # Verify project_id matches in JSON
   ```

3. **BigQuery Dataset Not Found**
   ```bash
   # Run setup script again
   npm run setup-gcp
   ```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run server
```

## 📚 Additional Resources

- [Firestore Documentation](https://cloud.google.com/firestore/docs)
- [BigQuery ML Guide](https://cloud.google.com/bigquery-ml/docs)
- [HIPAA on GCP](https://cloud.google.com/security/compliance/hipaa)
- [Cloud Storage Best Practices](https://cloud.google.com/storage/docs/best-practices)

---

**🏥 HIPAA Compliance Note**: This implementation includes enterprise-grade security features for handling Protected Health Information (PHI). Ensure your GCP project has a signed Business Associate Agreement (BAA) with Google Cloud for production use.

**🔑 Service Account Security**: The service account JSON key contains sensitive credentials. Never commit this to version control or expose it publicly. Use environment variables and secure secret management in production.
