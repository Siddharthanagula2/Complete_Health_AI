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