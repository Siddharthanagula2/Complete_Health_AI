import { createClient } from '@supabase/supabase-js';
import { AuthResponse, SignupData, PasswordReset, LoginCredentials, AuthUser } from '../types/auth';

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
   * User login with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return {
            success: false,
            message: 'Invalid email or password. Please check your credentials and try again.',
            errors: { email: 'Invalid credentials', password: 'Invalid credentials' }
          };
        }

        if (error.message.includes('Email not confirmed')) {
          return {
            success: false,
            message: 'Please confirm your email address before signing in.',
            errors: { email: 'Email not confirmed' }
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
          message: 'Login failed. Please try again.'
        };
      }

      // Get user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', data.user.id)
        .single();

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || credentials.email,
        fullName: profile?.full_name || data.user.user_metadata?.full_name || '',
        avatarUrl: profile?.avatar_url || data.user.user_metadata?.avatar_url,
        isEmailVerified: data.user.email_confirmed_at !== null,
        createdAt: new Date(data.user.created_at)
      };

      return {
        success: true,
        message: 'Login successful!',
        user
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      // Get user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email || '',
        fullName: profile?.full_name || user.user_metadata?.full_name || '',
        avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url,
        isEmailVerified: user.email_confirmed_at !== null,
        createdAt: new Date(user.created_at)
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Get user profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', session.user.id)
          .single();

        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          fullName: profile?.full_name || session.user.user_metadata?.full_name || '',
          avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url,
          isEmailVerified: session.user.email_confirmed_at !== null,
          createdAt: new Date(session.user.created_at)
        };

        callback(user);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Send password reset email
   */
  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.'
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
   * Reset password with new password
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