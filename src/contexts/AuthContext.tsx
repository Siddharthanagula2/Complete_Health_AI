import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, AuthContextType, LoginCredentials, SignupData, PasswordReset } from '../types/auth';
import { AuthService } from '../services/authService';
import { mockUser } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app start
    const initializeAuth = async () => {
      // --- DEVELOPER MODE: Auto-login with mock user ---
      setUser({
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.name,
        isEmailVerified: true,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      setIsLoading(false);
      // --- End of developer mode code ---

      /*
      // Original authentication logic (commented out for developer mode)
      try {
        const currentUser = AuthService.getCurrentUser();
        const token = AuthService.getToken();
        
        if (currentUser && token) {
          // Verify token is still valid
          const isValid = await AuthService.verifyToken();
          if (isValid) {
            setUser(currentUser);
          } else {
            // Token is invalid, clear storage
            AuthService.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        AuthService.logout();
      } finally {
        setIsLoading(false);
      }
      */
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(credentials);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.signup(data);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    return await AuthService.forgotPassword(email);
  };

  const resetPassword = async (data: PasswordReset) => {
    return await AuthService.resetPassword(data);
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