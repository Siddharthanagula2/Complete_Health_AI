import { createClient } from '@/lib/supabase-client';

// Error handling helper for authentication
export const handleAuthError = (error: any): string => {
  console.error('Auth error:', error);
  
  // Handle known Supabase error messages
  if (typeof error === 'object' && error !== null) {
    const errorMessage = error.message || error.error_description || '';
    
    if (errorMessage.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    
    if (errorMessage.includes('Email not confirmed')) {
      return 'Please verify your email address before signing in.';
    }
    
    if (errorMessage.includes('already registered')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    
    if (errorMessage.includes('password')) {
      return errorMessage;
    }
    
    if (errorMessage) {
      return errorMessage;
    }
  }
  
  // Generic error message as fallback
  return 'An unexpected error occurred. Please try again.';
};

// Check if user session is valid
export const validateSession = async (): Promise<boolean> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session validation error:', error);
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
};

// Sign out helper with error handling
export const signOut = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { 
        success: false, 
        error: handleAuthError(error) 
      };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: handleAuthError(error) 
    };
  }
};

// Reset password helper
export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      return { 
        success: false, 
        error: handleAuthError(error) 
      };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: handleAuthError(error) 
    };
  }
};

// Update password helper
export const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      return { 
        success: false, 
        error: handleAuthError(error) 
      };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: handleAuthError(error) 
    };
  }
};

// Resend confirmation email helper
export const resendConfirmationEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = createClient();
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
        error: handleAuthError(error) 
      };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: handleAuthError(error) 
    };
  }
};