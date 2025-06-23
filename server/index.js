const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const firestoreService = require('./services/firestoreService');
const aiInsightService = require('./services/aiInsightService');
const { signupSchema } = require('./validation');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3001/auth/google/callback';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login validation schema
const { z } = require('zod');
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  // REQUIRED DEBUG LOGGING - Log raw request body
  console.log('RAW SIGNUP REQUEST BODY:', req.body);
  
  try {
    console.log('Signup request received:', { ...req.body, password: '[REDACTED]', confirmPassword: '[REDACTED]' });
    
    const validationResult = signupSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.errors);
      const errors = {};
      validationResult.error.errors.forEach(error => {
        errors[error.path[0]] = error.message;
      });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const { fullName, email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await firestoreService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userData = {
      fullName,
      email,
      password: hashedPassword,
      authProvider: 'email',
      isEmailVerified: false,
      points: 0,
      level: 1,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    const userId = await firestoreService.createUser(userData);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId, 
        email,
        authProvider: 'email'
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Return user data (excluding password)
    const { password: _, ...userResponse } = userData;
    
    console.log('User created successfully:', userId);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        ...userResponse
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during signup'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received for email:', req.body.email);
    
    const validationResult = loginSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const errors = {};
      validationResult.error.errors.forEach(error => {
        errors[error.path[0]] = error.message;
      });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const { email, password } = validationResult.data;

    // Get user by email
    const user = await firestoreService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password for email users
    if (user.authProvider === 'email') {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: 'Please use Google sign-in for this account'
      });
    }

    // Update last login
    await firestoreService.updateUser(user.id, { lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        authProvider: user.authProvider
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Return user data (excluding password)
    const { password: _, ...userResponse } = user;
    
    console.log('Login successful for user:', user.id);
    res.json({
      success: true,
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await firestoreService.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    // In a real app, you would:
    // 1. Generate a secure reset token
    // 2. Store it in the database with expiration
    // 3. Send email with reset link
    
    console.log('Password reset requested for:', email);
    
    res.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Google OAuth routes
app.get('/auth/google', (req, res) => {
  console.log('Initiating Google OAuth flow');
  console.log('Redirect URI:', REDIRECT_URI);
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=openid%20profile%20email&` +
    `access_type=offline&` +
    `prompt=consent`;
  
  res.redirect(googleAuthUrl);
});

app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, error } = req.query;
    
    console.log('Google OAuth callback received');
    console.log('Authorization code present:', !!code);
    console.log('Error present:', !!error);
    
    if (error) {
      console.error('OAuth error:', error);
      return res.redirect(`http://localhost:5173/login?error=${encodeURIComponent('OAuth authorization failed')}`);
    }

    if (!code) {
      console.error('No authorization code received');
      return res.redirect(`http://localhost:5173/login?error=${encodeURIComponent('No authorization code received')}`);
    }

    console.log('Exchanging authorization code for access token');
    console.log('Using redirect_uri:', REDIRECT_URI);

    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI
    });

    console.log('Token exchange successful');
    const { access_token } = tokenResponse.data;

    // Get user profile from Google
    console.log('Fetching user profile from Google');
    const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    console.log('Profile fetch successful');
    const { id: googleId, email, name, picture } = profileResponse.data;

    // Check if user exists
    let user = await firestoreService.getUserByEmail(email);
    
    if (!user) {
      console.log('Creating new user from Google OAuth');
      // Create new user
      const userData = {
        fullName: name,
        email,
        googleId,
        authProvider: 'google',
        avatar: picture,
        isEmailVerified: true,
        points: 0,
        level: 1,
        createdAt: new Date(),
        lastLogin: new Date()
      };

      const userId = await firestoreService.createUser(userData);
      user = { id: userId, ...userData };
      console.log('New user created:', userId);
    } else {
      console.log('Existing user found, updating last login');
      // Update existing user
      await firestoreService.updateUser(user.id, { 
        lastLogin: new Date(),
        avatar: picture // Update avatar in case it changed
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        authProvider: 'google'
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    console.log('JWT token generated, redirecting to dashboard');
    
    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    
    // Log additional error details
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    
    res.redirect(`http://localhost:5173/login?error=${encodeURIComponent('Authentication failed')}`);
  }
});

// Health data endpoints with points system
app.post('/api/health/food', authenticateToken, async (req, res) => {
  try {
    const foodEntry = {
      ...req.body,
      userId: req.user.userId,
      timestamp: new Date()
    };

    const entryId = await firestoreService.createFoodEntry(foodEntry);
    
    // Award points for food logging
    await firestoreService.awardPoints(req.user.userId, 10);
    
    res.status(201).json({
      success: true,
      id: entryId,
      pointsAwarded: 10
    });
  } catch (error) {
    console.error('Error creating food entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create food entry'
    });
  }
});

app.get('/api/health/food', authenticateToken, async (req, res) => {
  try {
    const entries = await firestoreService.getFoodEntries(req.user.userId);
    res.json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching food entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food entries'
    });
  }
});

app.post('/api/health/exercise', authenticateToken, async (req, res) => {
  try {
    const exerciseEntry = {
      ...req.body,
      userId: req.user.userId,
      timestamp: new Date()
    };

    const entryId = await firestoreService.createExerciseEntry(exerciseEntry);
    
    // Award points for exercise logging (more points for longer workouts)
    const basePoints = 25;
    const durationBonus = Math.floor(req.body.duration / 10) * 5; // 5 points per 10 minutes
    const totalPoints = basePoints + durationBonus;
    
    await firestoreService.awardPoints(req.user.userId, totalPoints);
    
    res.status(201).json({
      success: true,
      id: entryId,
      pointsAwarded: totalPoints
    });
  } catch (error) {
    console.error('Error creating exercise entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create exercise entry'
    });
  }
});

app.get('/api/health/exercise', authenticateToken, async (req, res) => {
  try {
    const entries = await firestoreService.getExerciseEntries(req.user.userId);
    res.json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching exercise entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exercise entries'
    });
  }
});

app.post('/api/health/water', authenticateToken, async (req, res) => {
  try {
    const waterEntry = {
      ...req.body,
      userId: req.user.userId,
      timestamp: new Date()
    };

    const entryId = await firestoreService.createWaterEntry(waterEntry);
    
    // Award points for water logging
    await firestoreService.awardPoints(req.user.userId, 5);
    
    res.status(201).json({
      success: true,
      id: entryId,
      pointsAwarded: 5
    });
  } catch (error) {
    console.error('Error creating water entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create water entry'
    });
  }
});

app.get('/api/health/water', authenticateToken, async (req, res) => {
  try {
    const entries = await firestoreService.getWaterEntries(req.user.userId);
    res.json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching water entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch water entries'
    });
  }
});

app.post('/api/health/sleep', authenticateToken, async (req, res) => {
  try {
    const sleepEntry = {
      ...req.body,
      userId: req.user.userId,
      date: new Date(req.body.date)
    };

    const entryId = await firestoreService.createSleepEntry(sleepEntry);
    
    // Award points for sleep logging
    await firestoreService.awardPoints(req.user.userId, 15);
    
    res.status(201).json({
      success: true,
      id: entryId,
      pointsAwarded: 15
    });
  } catch (error) {
    console.error('Error creating sleep entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sleep entry'
    });
  }
});

app.get('/api/health/sleep', authenticateToken, async (req, res) => {
  try {
    const entries = await firestoreService.getSleepEntries(req.user.userId);
    res.json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching sleep entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sleep entries'
    });
  }
});

app.post('/api/health/mood', authenticateToken, async (req, res) => {
  try {
    const moodEntry = {
      ...req.body,
      userId: req.user.userId,
      timestamp: new Date()
    };

    const entryId = await firestoreService.createMoodEntry(moodEntry);
    
    // Award points for mood logging
    await firestoreService.awardPoints(req.user.userId, 5);
    
    res.status(201).json({
      success: true,
      id: entryId,
      pointsAwarded: 5
    });
  } catch (error) {
    console.error('Error creating mood entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mood entry'
    });
  }
});

app.get('/api/health/mood', authenticateToken, async (req, res) => {
  try {
    const entries = await firestoreService.getMoodEntries(req.user.userId);
    res.json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mood entries'
    });
  }
});

// AI Insights endpoint
app.get('/api/insights', authenticateToken, async (req, res) => {
  try {
    console.log('Generating AI insights for user:', req.user.userId);
    const insights = await aiInsightService.generateInsights(req.user.userId);
    
    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate insights'
    });
  }
});

// User profile endpoint
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await firestoreService.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove sensitive data
    const { password, ...userProfile } = user;
    
    res.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Google OAuth redirect URI: ${REDIRECT_URI}`);
});