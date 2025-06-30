import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Heart, CheckCircle } from 'lucide-react';
import { InputField } from '../../components/auth/InputField';
import { SocialButton } from '../../components/auth/SocialButton';
import { LoadingSpinner } from '../../components/auth/LoadingSpinner';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema } from '../../utils/validation';
import { LoginCredentials } from '../../types/auth';
import { SupabaseAuthService } from '../../services/supabaseAuthService';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState('');
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/dashboard';

  // Check if there's a success message in location state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
    setPageLoading(false);
  }, [location.state]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    } else {
      setPageLoading(false);
    }
  }, [isAuthenticated, navigate, from]);

  // Check for error in URL params (from OAuth callback)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get('error');
    const token = urlParams.get('token');
    
    if (error) {
      setSubmitError(decodeURIComponent(error));
    }
    
    // Handle OAuth success with token
    if (token) {
      navigate(from, { replace: true });
    }
  }, [location.search, navigate, from]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }

    // Clear email confirmation state
    if (needsEmailConfirmation) {
      setNeedsEmailConfirmation(false);
    }

    // Clear success message
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field on blur
    validateField(name);
  };

  const validateField = (fieldName: string) => {
    try {
      loginSchema.pick({ [fieldName]: true }).parse({ [fieldName]: formData[fieldName as keyof LoginCredentials] });
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    } catch (error: any) {
      const fieldError = error.errors?.[0]?.message || 'Invalid input';
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }));
    }
  };

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setNeedsEmailConfirmation(false);
    setSuccessMessage('');
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await login(formData);
      
      if (response.success) {
        navigate(from, { replace: true });
      } else {
        if (response.message?.includes('confirm') || response.message?.includes('verification')) {
          setNeedsEmailConfirmation(true);
        }
        setSubmitError(response.message || 'Login failed');
        if (response.errors) {
          setErrors(response.errors);
        }
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await SupabaseAuthService.socialLogin('google');
      if (!response.success) {
        setSubmitError(response.message || 'Google login failed');
      }
      // If successful, the redirect will happen automatically
    } catch (error) {
      setSubmitError('Google login is currently unavailable');
    }
  };

  const handleResendConfirmation = async () => {
    try {
      const response = await SupabaseAuthService.resendConfirmation(formData.email);
      if (response.success) {
        setSubmitError('');
        setNeedsEmailConfirmation(false);
        // Show success message
        setSuccessMessage('Confirmation email sent! Please check your inbox.');
      } else {
        setSubmitError(response.message || 'Failed to resend confirmation email');
      }
    } catch (error) {
      setSubmitError('Failed to resend confirmation email');
    }
  };

  if (pageLoading) {
    return <LoadingScreen message="Preparing login..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Heart className="text-white" size={24} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to continue your health journey
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submit Error */}
            {submitError && !needsEmailConfirmation && !submitError.includes('sent') && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <p className="text-red-700 dark:text-red-400 text-sm">{submitError}</p>
                </div>
              </div>
            )}

            {/* Email Confirmation Notice */}
            {needsEmailConfirmation && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="text-yellow-500 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm font-medium">
                      Email Confirmation Required
                    </p>
                    <p className="text-yellow-600 dark:text-yellow-300 text-sm mt-1">
                      Please check your email and click the confirmation link before signing in.
                    </p>
                    <button
                      type="button"
                      onClick={handleResendConfirmation}
                      className="text-yellow-700 dark:text-yellow-400 text-sm font-medium underline mt-2 hover:no-underline"
                    >
                      Resend confirmation email
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {(successMessage || (submitError && submitError.includes('sent'))) && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <p className="text-green-700 dark:text-green-400 text-sm">{successMessage || submitError}</p>
                </div>
              </div>
            )}

            {/* Email */}
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Enter your email address"
              error={touched.email ? errors.email : ''}
              required
              autoComplete="email"
            />

            {/* Password */}
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Enter your password"
              error={touched.password ? errors.password : ''}
              required
              autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
              </label>
              
              <Link
                to="/forgot-password"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <SocialButton
              provider="google"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            />
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}