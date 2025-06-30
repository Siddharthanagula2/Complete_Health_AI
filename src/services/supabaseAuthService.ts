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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        // Check for specific error messages
        if (error.message.includes('Email not confirmed')) {
          return {
            success: false,
            message: 'Please confirm your email address before signing in. Check your inbox for a confirmation link.',
            errors: { email: 'Email not confirmed' }
          };
        }

        if (error.message.includes('Invalid login credentials')) {
          return {
            success: false,
            message: 'Invalid email or password. Please try again.',
            errors: { password: 'Invalid login credentials' }
          };
        }

        return {
          success: false,
          message: error.message,
          errors: { email: error.message }
        };
      }

      if (!data.user) {
        return {
          success: false,
          message: 'Login failed. Please try again.',
        };
      }

      // Set remember me preference
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      return {
        success: true,
        token: data.session?.access_token || '',
        user: {
          id: data.user.id,
          email: data.user.email || '',
          fullName: data.user.user_metadata?.full_name || 'User',
          isEmailVerified: data.user.email_confirmed_at !== null,
          createdAt: new Date(data.user.created_at),
          lastLogin: new Date()
        },
        message: 'Login successful!'
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during login'
      };
    }
  }

  /**
   * User logout
   */
  static async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
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
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

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
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) return null;
      
      return {
        id: data.user.id,
        email: data.user.email || '',
        fullName: data.user.user_metadata?.full_name || 'User',
        isEmailVerified: data.user.email_confirmed_at !== null,
        createdAt: new Date(data.user.created_at),
        lastLogin: new Date()
      };
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
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Social login (Google, GitHub, etc.)
   */
  static async socialLogin(provider: 'google' | 'github' | 'discord'): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      // This will redirect the user to the OAuth provider
      // The success response will be handled when the user is redirected back
      return {
        success: true,
        message: 'Redirecting to login provider...'
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
    return supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || 'User',
          isEmailVerified: session.user.email_confirmed_at !== null,
          createdAt: new Date(session.user.created_at),
          lastLogin: new Date()
        };
        callback(user);
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });
  }

  /**
   * Resend email confirmation
   */
  static async resendConfirmation(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

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