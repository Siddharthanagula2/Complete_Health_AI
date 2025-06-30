import axios from 'axios';
import { AuthResponse, LoginCredentials, SignupData, PasswordReset } from '../types/auth';

// Use relative API path for all environments
const API_BASE_URL = '/api/auth';

// Create axios instance with default config
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      // Only redirect if we're not already on a public page
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup') && 
          !window.location.pathname.includes('/') &&
          !window.location.pathname.includes('/forgot-password')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export class AuthService {
  /**
   * User signup
   */
  static async signup(data: SignupData): Promise<AuthResponse> {
    try {
      // For demo purposes, simulate successful signup
      const mockUser = {
        id: Date.now().toString(),
        email: data.email,
        fullName: data.fullName,
        isEmailVerified: true,
        createdAt: new Date(),
        lastLogin: new Date()
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store token and user data
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(mockUser));

      return {
        success: true,
        token: mockToken,
        user: mockUser,
        message: 'Account created successfully!'
      };
    } catch (error: any) {
      console.error('Signup API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
        errors: error.response?.data?.errors
      };
    }
  }

  /**
   * User login
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // For demo purposes, simulate successful login
      const mockUser = {
        id: '1',
        email: credentials.email,
        fullName: 'Demo User',
        isEmailVerified: true,
        createdAt: new Date('2024-01-01'),
        lastLogin: new Date()
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store token and user data
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(mockUser));
      
      // Set remember me preference
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      return {
        success: true,
        token: mockToken,
        user: mockUser,
        message: 'Login successful!'
      };
    } catch (error: any) {
      console.error('Login API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        errors: error.response?.data?.errors
      };
    }
  }

  /**
   * User logout
   */
  static logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('rememberMe');
  }

  /**
   * Forgot password
   */
  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      // For demo purposes, simulate successful password reset request
      return {
        success: true,
        message: 'Password reset email sent successfully!'
      };
    } catch (error: any) {
      console.error('Forgot password API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset request failed'
      };
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(data: PasswordReset): Promise<AuthResponse> {
    try {
      // For demo purposes, simulate successful password reset
      return {
        success: true,
        message: 'Password reset successfully!'
      };
    } catch (error: any) {
      console.error('Reset password API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
        errors: error.response?.data?.errors
      };
    }
  }

  /**
   * Get current user from localStorage
   */
  static getCurrentUser() {
    try {
      const userStr = localStorage.getItem('authUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Get auth token from localStorage
   */
  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Verify token with server
   */
  static async verifyToken(): Promise<boolean> {
    try {
      // For demo purposes, always return true if token exists
      const token = this.getToken();
      return !!token;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  /**
   * Social login (Google, GitHub, etc.)
   */
  static async socialLogin(provider: string, token: string): Promise<AuthResponse> {
    try {
      // For demo purposes, simulate successful social login
      const mockUser = {
        id: Date.now().toString(),
        email: 'social@example.com',
        fullName: 'Social User',
        isEmailVerified: true,
        createdAt: new Date(),
        lastLogin: new Date()
      };

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(mockUser));

      return {
        success: true,
        token,
        user: mockUser,
        message: 'Social login successful!'
      };
    } catch (error: any) {
      console.error('Social login API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Social login failed'
      };
    }
  }
}