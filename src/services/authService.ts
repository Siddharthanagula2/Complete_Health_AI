import axios from 'axios';
import { AuthResponse, LoginCredentials, SignupData, PasswordResetRequest, PasswordReset } from '../types/auth';

// Dynamic API base URL - uses relative path for production (Netlify functions) and localhost for development
const API_BASE_URL = import.meta.env.PROD
  ? '/.netlify/functions/index/api/auth'
  : 'http://localhost:3001/api/auth';

// Create axios instance with default config
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
      window.location.href = '/login';
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
      const response = await authAPI.post('/signup', data);
      return response.data;
    } catch (error: any) {
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
      const response = await authAPI.post('/login', credentials);
      const { token, user } = response.data;
      
      if (token) {
        // Store token and user data
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(user));
        
        // Set remember me preference
        if (credentials.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
      }
      
      return response.data;
    } catch (error: any) {
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
      const response = await authAPI.post('/forgot-password', { email });
      return response.data;
    } catch (error: any) {
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
      const response = await authAPI.post('/reset-password', data);
      return response.data;
    } catch (error: any) {
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
    } catch {
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
      const response = await authAPI.get('/verify');
      return response.data.valid;
    } catch {
      return false;
    }
  }

  /**
   * Social login (Google, GitHub, etc.)
   */
  static async socialLogin(provider: string, token: string): Promise<AuthResponse> {
    try {
      const response = await authAPI.post(`/social/${provider}`, { token });
      const { token: authToken, user } = response.data;
      
      if (authToken) {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('authUser', JSON.stringify(user));
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Social login failed'
      };
    }
  }
}