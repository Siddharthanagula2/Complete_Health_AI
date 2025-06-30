import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, AuthContextType, LoginCredentials, SignupData, PasswordReset } from '../types/auth';
import { SupabaseAuthService } from '../services/supabaseAuthService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const currentUser = await SupabaseAuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen to auth state changes
    const { data: { subscription } } = SupabaseAuthService.onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await SupabaseAuthService.login(credentials);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during login'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      const response = await SupabaseAuthService.signup(data);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during signup'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await SupabaseAuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      return await SupabaseAuthService.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  };

  const resetPassword = async (data: PasswordReset) => {
    try {
      return await SupabaseAuthService.resetPassword(data);
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}