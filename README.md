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
GOOGLE_CLIENT_ID=24548426193-u0g18cp7js0fimlrhpr8dg4qc88rs0hi.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Google Cloud Platform Service Account JSON (REQUIRED)
# Copy the entire content of your service account JSON file as a single line string
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"fleet-goal-463720-m4","private_key_id":"dec7b0f1c1ac7f7f4355475bec2d7419b7e30c6c","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC41dNswRX7e8Ec\n35G5P6beRNXV0ejq94CQQ+sz74/TViCFJu06BmYNEBDfZSopPWt8CSWkrZFoiIpz\ngj04CvO867XYMZvdREALXLTQUZQvkYKHPfvf+EqDzBZInoBJLQDV1vTmRp2vLPKc\n9rMmo4Y6qJDJBcJnGzkCaMO0CufR3PGdM8sBssEECw9V/zb+ahlGVmyU9ab0Y017\nhxuSC1kAy54FWPubuZvcXv/YVcCCW+QqZCVolH3lnFE+5PsM9LeW/1cU1MbimMFs\nGd29zuSFhn1pTwpkApH18JkUY8wIy8c8qYZBVjh8l4KRQpCDpHnKhMQkLrJXVE02\nCFZ1WhPFAgMBAAECggEAB41yyHiLtoBw77lk7qeR4Nz5yqhh0F2q161zlv/Jcs6L\n1DtqD+gC07LRD0fGqFoibumMXuvAS5l7F5gxRzDcLJKKSVpRlTUWOg1tZ/u4k3vQ\nuq6TzavxsFJh1x3+5CT3tt7D/mrRQ6V31MxLarjdob6RV/cPx/9eERUJAu2h8yD2\nllMYqB9qIXSsAxGMBwlqguRymVn6fxzOyDvSTCxhHwpPnR6To+kIqACdTDZgT+H9\nghcB4OOd99fAnRgkMOyXumLkchvUdFwMUBIrcMDvp8HmLq220ZSMwSL4U7E4JVYa\nBTbvi0PDOFynp3u3X1fRMKZSMM/tD1bLTqb37p2iEQKBgQDaWvhZMy0VBUZefBWG\nr96U3WlaZZUUh90WQBR54rV1uXCFZCHInf/1q4/kNfuhDI3yIPnQBPQHu0ilwrQg\nvjZIuzH9DkqLsMAnpGCqe8+fhXOR1p1ub4MSk6+Ke2LBs3Tj7beR4FmASYr+DDRr\nYUHj5/XIF9F3rpBxunxaU/DSnQKBgQDYs3WPWC9cjA+Vt4Lkr6YIBJJqvKcvYs+p\n5a/lm3aI6KKMzmVUJ7Hjzyi/4JkSRYv3Drql2o9QxYIJ6WLord1fdbsgtI7clURc\nUZ/MhtbIgSnNagleJuZiuZvNLKs1n8HickqpzalcMbj0WvnkaMY+FQERB1pwu385\nP+MJi1iJSQKBgClIv+HlmiV6TNa6cTt47wWIY03zHN+33GZDkVuGMLbka9DcoMKU\nlPt3B4qnZj8J56Ca+YCKHzWDBHZKvNHgBNV1hzsIQ7HrpjkYjCpPpG7NxY8SW8uw\ni8CsaakuMPrcmkIqBOYw29s0jHICDrsqtVGI3uCJGFKfj7HhB3fwnPzFAoGBANbt\nv5bqByeKf1amSbvZ/xoKttIIxOU54vAGsNxRwlJuMfLoLxY1vLlPWYJeGFRICFeF\nE1i2mtio3J5KDeDruRoaIfyBOQTNQ50xFAZ+Yn9BpJ1pI1tvx6d5om7wc+texaV8\naFNceTLI2kH6DcoepSkkGgeyvF/9h2TX2a44uBqJAoGANJdb/JJkutTTK8punXsX\nFZLV6qi+dSR52DbrLksiVkml72NWCIHEyDhCKHvyQeaqMnqxTruB199aTGKMsuN+\ndxxN8LB5LknRuJf5MHdHlzCnBbzWSqJj04Ur80FB6UsPujsoqubivpeTAS5wmKS2\nLPMEnftIfXVYsufhJfZdOaM=\n-----END PRIVATE KEY-----\n","client_email":"cht-903@fleet-goal-463720-m4.iam.gserviceaccount.com","client_id":"118181433245967521687","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/cht-903%40fleet-goal-463720-m4.iam.gserviceaccount.com","universe_domain":"googleapis.com"}

# Analytics Pipeline
GCS_ANALYTICS_BUCKET=cht-analytics-data-lake
BIGQUERY_DATASET_ID=cht_analytics

# Security
JWT_SECRET=your-secure-jwt-secret-here

# Server
PORT=3001
NODE_ENV=development
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
