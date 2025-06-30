# Complete Health Tracker

A comprehensive health and wellness tracking application with AI-powered insights, built with React, TypeScript, and Supabase.

## 🚀 Features

### 🔐 **Complete Authentication System**
- **Email/Password Authentication** - Secure signup and login with Supabase Auth
- **Email Verification** - Required email confirmation for new accounts
- **Password Reset** - Secure password reset flow with email links
- **Social Login** - Google OAuth integration
- **Protected Routes** - Secure navigation with authentication checks
- **Session Management** - Persistent login with automatic token refresh

### 📊 **Health Tracking**
- **Nutrition Logging** - Track meals, calories, macros with barcode scanning
- **Exercise Tracking** - Log workouts, GPS tracking, heart rate monitoring
- **Water Intake** - Simple hydration tracking with daily goals
- **Sleep Monitoring** - Track sleep duration, quality, and patterns
- **Mood Tracking** - Daily mood logging with factors and notes
- **Weight Management** - Progress tracking towards health goals

### 🤖 **AI-Powered Features**
- **AI Health Coach** - Personalized recommendations and insights
- **Predictive Analytics** - Early health warnings and trend analysis
- **Smart Meal Planning** - AI-generated meal plans based on goals
- **Voice Interactions** - Voice-to-text logging and AI responses
- **Health Correlations** - Discover patterns in your health data

### 🏆 **Gamification & Social**
- **Achievement System** - Unlock badges and earn points
- **Streak Tracking** - Build healthy habits with daily streaks
- **Community Challenges** - Compete with friends and community
- **Leaderboards** - Track progress against others
- **Family Dashboard** - Monitor family health (with privacy controls)

### 🏥 **Medical Integration**
- **Provider Portal** - Healthcare professional dashboard
- **Medical Records** - Secure storage of health records
- **Lab Results** - Integration with medical test results
- **Medication Tracking** - Prescription and supplement management
- **HIPAA Compliance** - Enterprise-grade security for health data

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth with email verification
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Deployment**: Netlify with serverless functions
- **Icons**: Lucide React
- **Validation**: Zod schema validation
- **Routing**: React Router v6

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd complete-health-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env` and add your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Database Schema

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create health_data table
CREATE TABLE health_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  data_type TEXT NOT NULL,
  data_value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for health_data
CREATE POLICY "Users can view own health data" ON health_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health data" ON health_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health data" ON health_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health data" ON health_data
  FOR DELETE USING (auth.uid() = user_id);
```

### 5. Configure Authentication

In your Supabase dashboard:

1. Go to Authentication > Settings
2. Enable email confirmations
3. Set up email templates (optional)
4. Configure OAuth providers (Google, etc.)

### 6. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔧 Configuration

### Email Authentication
- Email verification is **required** by default
- Users must confirm their email before they can sign in
- Password reset uses secure email links

### Environment Variables
```env
# Required
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_APP_ENV=development
```

### Supabase Configuration
- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- Real-time subscriptions for live updates
- Automatic session management

## 📱 Features Overview

### Authentication Flow
1. **Sign Up**: Email + password with verification required
2. **Email Confirmation**: Users must click email link to activate account
3. **Sign In**: Email + password authentication
4. **Password Reset**: Secure email-based password reset
5. **Social Login**: Google OAuth integration
6. **Session Management**: Automatic token refresh and persistence

### Health Data Management
- **Local Storage**: Offline-first with localStorage backup
- **Supabase Sync**: Real-time sync with cloud database
- **Data Privacy**: All health data is encrypted and user-owned
- **Export/Import**: Full data portability

### Security Features
- **Row Level Security**: Database-level access control
- **Email Verification**: Required for account activation
- **Secure Password Reset**: Time-limited reset tokens
- **HTTPS Only**: All communications encrypted
- **Input Validation**: Client and server-side validation

## 🚀 Deployment

### Netlify Deployment

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on git push

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## 🔍 Troubleshooting

### Common Issues

1. **Email Verification Not Working**
   - Check Supabase email settings
   - Verify SMTP configuration
   - Check spam folder

2. **Authentication Errors**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure email confirmation is enabled

3. **Database Connection Issues**
   - Verify environment variables
   - Check Supabase project status
   - Review database policies

### Debug Mode
```bash
# Enable debug logging
VITE_DEBUG=true npm run dev
```

## 📚 API Documentation

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/signin` - Sign in user
- `POST /auth/signout` - Sign out user
- `POST /auth/reset-password` - Request password reset
- `PUT /auth/update-password` - Update password

### Health Data
- `GET /api/health/summary` - Get health summary
- `POST /api/health/food` - Log food entry
- `POST /api/health/exercise` - Log exercise
- `POST /api/health/water` - Log water intake
- `POST /api/health/sleep` - Log sleep data
- `POST /api/health/mood` - Log mood entry

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@completehealth.app or join our Discord community.

---

**🏥 Health Data Privacy**: This application is designed with privacy-first principles. All health data is encrypted, user-owned, and never shared without explicit consent. The app is built to be HIPAA-compliant for healthcare provider use.

**🔐 Security**: Built with enterprise-grade security features including Row Level Security, email verification, and secure authentication flows.