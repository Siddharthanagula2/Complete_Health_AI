import { createClient } from '@supabase/supabase-js';
import { AuthResponse, SignupData, PasswordReset } from '../types/auth';

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