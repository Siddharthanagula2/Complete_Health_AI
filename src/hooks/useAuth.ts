import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase-client';
import { handleAuthError } from '@/utils/auth-helpers';

interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Initialize auth state
  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        if (session?.user) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: profile?.full_name || session.user.user_metadata?.full_name,
            avatarUrl: profile?.avatar_url
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: profile?.full_name || session.user.user_metadata?.full_name,
            avatarUrl: profile?.avatar_url
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Sign in function
  const signIn = useCallback(async (
    email: string, 
    password: string, 
    rememberMe: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: rememberMe
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
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Sign up function
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    fullName: string
  ): Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }> => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        return { 
          success: false, 
          error: handleAuthError(error) 
        };
      }
      
      // Check if email confirmation is required
      const requiresEmailConfirmation = !data.user?.identities?.[0]?.identity_data?.email_verified;
      
      return { 
        success: true,
        requiresEmailConfirmation
      };
    } catch (error) {
      return { 
        success: false, 
        error: handleAuthError(error) 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Sign out function
  const signOut = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { 
          success: false, 
          error: handleAuthError(error) 
        };
      }
      
      setUser(null);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: handleAuthError(error) 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Reset password function
  const resetPassword = useCallback(async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update password function
  const updatePassword = useCallback(async (
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };
}