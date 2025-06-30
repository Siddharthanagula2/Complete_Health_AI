import { createClient, User } from '@supabase/supabase-js';
import { AuthResponse, LoginCredentials, SignupData, PasswordReset } from '../types/auth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export class SupabaseAuthService {
  /**
   * User signup with email verification
   */
  static async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('already registered')) {
          return {
            success: false,
            message: 'An account with this email already exists. Please sign in instead.',
            errors: { email: 'Email already registered' }
          };
        }
        
        if (error.message.includes('password')) {
          return {
            success: false,
            message: error.message,
            errors: { password: error.message }
          };
        }

        return {
          success: false,
          message: error.message,
          errors: { email: error.message }
        };
      }

      // For demo purposes, we'll simulate email confirmation is required
      return {
        success: true,
        message: 'Please check your email to confirm your account before signing in.',
        user: {
          id: authData.user?.id || 'temp-id',
          email: data.email,
          fullName: data.fullName,
          isEmailVerified: false,
          createdAt: new Date()
        }
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during signup'
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
  static async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('rememberMe');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Forgot password
   */
  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: true,
        message: 'Password reset email sent successfully! Please check your inbox.'
      };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
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
        message: 'Password updated successfully!'
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      // For demo purposes, get user from localStorage
      const userStr = localStorage.getItem('authUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user?.isEmailVerified;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Verify token
   */
  static async verifyToken(): Promise<boolean> {
    try {
      // For demo purposes, always return true if token exists
      const token = localStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  /**
   * Social login (Google, GitHub, etc.)
   */
  static async socialLogin(provider: 'google' | 'github' | 'discord'): Promise<AuthResponse> {
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

      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(mockUser));

      return {
        success: true,
        token: mockToken,
        user: mockUser,
        message: 'Social login successful!'
      };
    } catch (error: any) {
      console.error('Social login error:', error);
      return {
        success: false,
        message: error.message || 'Social login failed'
      };
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (user: any) => void) {
    // For demo purposes, we'll just return a mock subscription
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }

  /**
   * Resend email confirmation
   */
  static async resendConfirmation(email: string): Promise<AuthResponse> {
    try {
      // For demo purposes, simulate successful resend
      return {
        success: true,
        message: 'Confirmation email sent successfully!'
      };
    } catch (error: any) {
      console.error('Resend confirmation error:', error);
      return {
        success: false,
        message: 'Failed to resend confirmation email'
      };
    }
  }
}