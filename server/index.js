const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Load environment variables first
require('dotenv').config();

// Import custom modules
const { signupSchema } = require('./validation');
const firestoreService = require('./services/firestoreService');
const analyticsService = require('./services/analyticsService');
const AuthService = require('./auth');

const app = express();

// Environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Use localhost for development
const REDIRECT_URI = process.env.NODE_ENV === 'production' 
  ? 'https://api.your-app-domain.com/auth/google/callback'
  : 'http://localhost:3001/auth/google/callback';

// Security middleware
app.use(helmet());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to auth routes
app.use('/api/auth', authLimiter);

// CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Helper function to find or create user (for Google OAuth)
const findOrCreateUser = async (googleProfile) => {
  try {
    // Check if user exists
    let user = await firestoreService.findUserByEmail(googleProfile.email);
    
    if (!user) {
      // Create new user
      user = await firestoreService.createUser({
        email: googleProfile.email,
        fullName: googleProfile.name,
        profilePicture: googleProfile.picture,
        isEmailVerified: true,
        authProvider: 'google'
      });
      console.log('Created new user via Google OAuth:', user.email);
    } else {
      // Update last login
      user = await firestoreService.updateUser(user.id, { lastLogin: new Date() });
      console.log('User logged in via Google OAuth:', user.email);
    }
    
    return user;
  } catch (error) {
    console.error('Error in findOrCreateUser:', error);
    throw error;
  }
};

// ============================================================================
// MANUAL SIGNUP ENDPOINT - Updated for Firestore
// ============================================================================

app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('Manual signup attempt:', { email: req.body.email, fullName: req.body.fullName });

    // A. Input Validation
    const validationResult = signupSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const errors = {};
      validationResult.error.errors.forEach(error => {
        errors[error.path[0]] = error.message;
      });
      
      console.log('Validation failed:', errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const { fullName, email, password } = validationResult.data;

    // B. Check for Existing User
    const existingUser = await firestoreService.findUserByEmail(email);
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // C. Secure Password Hashing
    console.log('Hashing password...');
    const hashedPassword = await AuthService.hashPassword(password);

    // D. Create and Save New User in Firestore
    console.log('Creating new user in Firestore...');
    const newUser = await firestoreService.createUser({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      authProvider: 'email'
    });

    // E. Generate Session Token
    console.log('Generating session token...');
    const token = AuthService.generateToken(newUser);

    // F. Send Successful Response
    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    console.log('User created successfully in Firestore:', newUser.email);

    res.status(201).json({
      success: true,
      token,
      user: userResponse,
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Don't expose internal errors to client
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

// ============================================================================
// GOOGLE OAUTH ENDPOINTS - Updated for Firestore
// ============================================================================

// A. Initiation Endpoint: GET /auth/google
app.get('/auth/google', (req, res) => {
  if (!GOOGLE_CLIENT_ID) {
    return res.status(500).json({ 
      success: false, 
      message: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID environment variable.' 
    });
  }

  const scope = 'email profile';
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent`;

  console.log('Redirecting to Google OAuth with URL:', authUrl);
  res.redirect(authUrl);
});

// B. Callback Endpoint: GET /auth/google/callback
app.get('/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;

  console.log('Google callback received:', { code: !!code, error });

  if (error) {
    console.error('Google OAuth error:', error);
    return res.redirect(`http://localhost:5173/login?error=${encodeURIComponent('Google authentication failed')}`);
  }

  if (!code) {
    console.error('No authorization code received');
    return res.redirect(`http://localhost:5173/login?error=${encodeURIComponent('No authorization code received')}`);
  }

  try {
    console.log('Exchanging code for access token...');
    
    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI
    });

    const { access_token } = tokenResponse.data;
    console.log('Access token received');

    // Get user profile from Google
    const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const googleProfile = profileResponse.data;
    console.log('Google profile received:', googleProfile.email);

    // Find or create user in Firestore
    const user = await findOrCreateUser(googleProfile);

    // Generate JWT token
    const token = AuthService.generateToken(user);

    // Set token as cookie and redirect to dashboard
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('Redirecting to dashboard...');
    res.redirect('http://localhost:5173/dashboard');

  } catch (error) {
    console.error('Google OAuth error:', error.response?.data || error.message);
    res.redirect(`http://localhost:5173/login?error=${encodeURIComponent('Authentication failed')}`);
  }
});

// ============================================================================
// LOGIN ENDPOINT - Updated for Firestore
// ============================================================================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    console.log('Login attempt:', { email, rememberMe });

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user in Firestore
    const user = await firestoreService.findUserByEmail(email);
    if (!user || user.authProvider !== 'email') {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await AuthService.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login in Firestore
    const updatedUser = await firestoreService.updateUser(user.id, { lastLogin: new Date() });

    // Generate token
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      { 
        id: updatedUser.id, 
        email: updatedUser.email,
        fullName: updatedUser.fullName 
      },
      JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    // Remove password from response
    const { password: _, ...userResponse } = updatedUser;

    console.log('Login successful:', updatedUser.email);

    res.json({
      success: true,
      token,
      user: userResponse,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

// ============================================================================
// HEALTH DATA ENDPOINTS - New Firestore-based endpoints
// ============================================================================

// Create food entry
app.post('/api/health/food', AuthService.authenticateToken, async (req, res) => {
  try {
    const foodEntry = await firestoreService.createFoodEntry(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: foodEntry,
      message: 'Food entry created successfully'
    });
  } catch (error) {
    console.error('Error creating food entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create food entry'
    });
  }
});

// Get user food entries
app.get('/api/health/food', AuthService.authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const foodEntries = await firestoreService.getUserFoodEntries(
      req.user.id,
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    );
    
    res.json({
      success: true,
      data: foodEntries
    });
  } catch (error) {
    console.error('Error getting food entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get food entries'
    });
  }
});

// Create exercise entry
app.post('/api/health/exercise', AuthService.authenticateToken, async (req, res) => {
  try {
    const exerciseEntry = await firestoreService.createExerciseEntry(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: exerciseEntry,
      message: 'Exercise entry created successfully'
    });
  } catch (error) {
    console.error('Error creating exercise entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create exercise entry'
    });
  }
});

// Get user exercise entries
app.get('/api/health/exercise', AuthService.authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const exerciseEntries = await firestoreService.getUserExerciseEntries(
      req.user.id,
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    );
    
    res.json({
      success: true,
      data: exerciseEntries
    });
  } catch (error) {
    console.error('Error getting exercise entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get exercise entries'
    });
  }
});

// Create water entry
app.post('/api/health/water', AuthService.authenticateToken, async (req, res) => {
  try {
    const waterEntry = await firestoreService.createWaterEntry(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: waterEntry,
      message: 'Water entry created successfully'
    });
  } catch (error) {
    console.error('Error creating water entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create water entry'
    });
  }
});

// Get user water entries
app.get('/api/health/water', AuthService.authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const waterEntries = await firestoreService.getUserWaterEntries(
      req.user.id,
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    );
    
    res.json({
      success: true,
      data: waterEntries
    });
  } catch (error) {
    console.error('Error getting water entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get water entries'
    });
  }
});

// Create sleep entry
app.post('/api/health/sleep', AuthService.authenticateToken, async (req, res) => {
  try {
    const sleepEntry = await firestoreService.createSleepEntry(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: sleepEntry,
      message: 'Sleep entry created successfully'
    });
  } catch (error) {
    console.error('Error creating sleep entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sleep entry'
    });
  }
});

// Get user sleep entries
app.get('/api/health/sleep', AuthService.authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const sleepEntries = await firestoreService.getUserSleepEntries(
      req.user.id,
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    );
    
    res.json({
      success: true,
      data: sleepEntries
    });
  } catch (error) {
    console.error('Error getting sleep entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get sleep entries'
    });
  }
});

// Create mood entry
app.post('/api/health/mood', AuthService.authenticateToken, async (req, res) => {
  try {
    const moodEntry = await firestoreService.createMoodEntry(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: moodEntry,
      message: 'Mood entry created successfully'
    });
  } catch (error) {
    console.error('Error creating mood entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mood entry'
    });
  }
});

// Get user mood entries
app.get('/api/health/mood', AuthService.authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const moodEntries = await firestoreService.getUserMoodEntries(
      req.user.id,
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    );
    
    res.json({
      success: true,
      data: moodEntries
    });
  } catch (error) {
    console.error('Error getting mood entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mood entries'
    });
  }
});

// Get aggregated user health data
app.get('/api/health/summary', AuthService.authenticateToken, async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    const summary = await firestoreService.getAggregatedUserData(req.user.id, timeframe);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error getting health summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get health summary'
    });
  }
});

// ============================================================================
// ANALYTICS ENDPOINTS
// ============================================================================

// Trigger manual data export (admin only)
app.post('/api/analytics/export', AuthService.authenticateToken, async (req, res) => {
  try {
    // In production, add admin role check here
    const result = await analyticsService.exportDailyData();
    res.json({
      success: true,
      data: result,
      message: 'Data export completed successfully'
    });
  } catch (error) {
    console.error('Error in manual data export:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data'
    });
  }
});

// Get population health trends
app.get('/api/analytics/trends/nutrition', AuthService.authenticateToken, async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    const trends = await analyticsService.getPopulationHealthTrends(timeframe);
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Error getting nutrition trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get nutrition trends'
    });
  }
});

// ============================================================================
// EXISTING ENDPOINTS
// ============================================================================

// Forgot password endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('Password reset request:', { email });

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user in Firestore
    const user = await firestoreService.findUserByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    // In a real app, you would:
    // 1. Generate a secure reset token
    // 2. Store it in Firestore with expiration
    // 3. Send email with reset link

    console.log('Password reset email would be sent to:', email);

    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

// Token verification endpoint
app.get('/api/auth/verify', (req, res) => {
  try {
    const token = AuthService.extractTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const decoded = AuthService.verifyToken(token);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

// Protected route example
app.get('/api/user/profile', AuthService.authenticateToken, async (req, res) => {
  try {
    const user = await firestoreService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password, ...userProfile } = user;
    res.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred'
    });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test Firestore connection
    const testQuery = await firestoreService.db.collection('users').limit(1).get();
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        firestore: 'connected',
        analytics: 'initialized'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Redirect URI: ${REDIRECT_URI}`);
  console.log('🔧 Environment variables:');
  console.log('- GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Not set');
  console.log('- GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Not set');
  console.log('- GOOGLE_APPLICATION_CREDENTIALS_JSON:', process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ? '✅ Set' : '❌ Not set');
  console.log('- JWT_SECRET:', JWT_SECRET !== 'your-jwt-secret-key' ? '✅ Set' : '⚠️  Using default');
  console.log('🔥 Firestore initialized and ready');
  console.log('📊 Analytics pipeline initialized');
});