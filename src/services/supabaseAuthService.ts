import { supabase } from '../lib/supabase'
import { AuthResponse, LoginCredentials, SignupData, PasswordReset } from '../types/auth'
import type { User } from '@supabase/supabase-js'

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
          }
        }
      })

      if (error) {
        return {
          success: false,
          message: error.message,
          errors: { email: error.message }
        }
      }

      if (authData.user && !authData.user.email_confirmed_at) {
        return {
          success: true,
          message: 'Please check your email to confirm your account before signing in.',
          user: this.transformUser(authData.user)
        }
      }

      // Create user profile
      if (authData.user) {
        await this.createUserProfile(authData.user, data.fullName)
      }

      return {
        success: true,
        message: 'Account created successfully!',
        user: authData.user ? this.transformUser(authData.user) : undefined,
        token: authData.session?.access_token
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred during signup'
      }
    }
  }

  /**
   * User login
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        return {
          success: false,
          message: error.message,
          errors: { email: error.message }
        }
      }

      if (!data.user?.email_confirmed_at) {
        return {
          success: false,
          message: 'Please confirm your email address before signing in.'
        }
      }

      return {
        success: true,
        message: 'Login successful!',
        user: this.transformUser(data.user),
        token: data.session?.access_token
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred during login'
      }
    }
  }

  /**
   * User logout
   */
  static async logout(): Promise<void> {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  /**
   * Forgot password
   */
  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return {
          success: false,
          message: error.message
        }
      }

      return {
        success: true,
        message: 'Password reset email sent successfully!'
      }
    } catch (error: any) {
      console.error('Forgot password error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(data: PasswordReset): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      })

      if (error) {
        return {
          success: false,
          message: error.message,
          errors: { newPassword: error.message }
        }
      }

      return {
        success: true,
        message: 'Password updated successfully!'
      }
    } catch (error: any) {
      console.error('Reset password error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user ? this.transformUser(user) : null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  /**
   * Get current session
   */
  static async getCurrentSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    } catch (error) {
      console.error('Error getting current session:', error)
      return null
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession()
      return !!session?.user
    } catch (error) {
      console.error('Error checking authentication:', error)
      return false
    }
  }

  /**
   * Verify token
   */
  static async verifyToken(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession()
      return !!session?.access_token
    } catch (error) {
      console.error('Token verification failed:', error)
      return false
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
      })

      if (error) {
        return {
          success: false,
          message: error.message
        }
      }

      return {
        success: true,
        message: 'Redirecting to social login...'
      }
    } catch (error: any) {
      console.error('Social login error:', error)
      return {
        success: false,
        message: 'Social login failed'
      }
    }
  }

  /**
   * Create user profile in database
   */
  private static async createUserProfile(user: User, fullName: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error creating user profile:', error)
      }
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
  }

  /**
   * Transform Supabase user to our AuthUser type
   */
  private static transformUser(user: User) {
    return {
      id: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name || user.email!.split('@')[0],
      isEmailVerified: !!user.email_confirmed_at,
      createdAt: new Date(user.created_at),
      lastLogin: new Date()
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ? this.transformUser(session.user) : null
      callback(user)
    })
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: { fullName?: string; avatarUrl?: string }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No user found')
      }

      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName
        }
      })

      if (authError) {
        throw authError
      }

      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: updates.fullName,
          avatar_url: updates.avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) {
        throw profileError
      }

      return {
        success: true,
        message: 'Profile updated successfully!'
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      }
    }
  }

  /**
   * Resend email confirmation
   */
  static async resendConfirmation(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        return {
          success: false,
          message: error.message
        }
      }

      return {
        success: true,
        message: 'Confirmation email sent successfully!'
      }
    } catch (error: any) {
      console.error('Resend confirmation error:', error)
      return {
        success: false,
        message: 'Failed to resend confirmation email'
      }
    }
  }
}