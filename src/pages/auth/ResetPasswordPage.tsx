import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Heart } from 'lucide-react';
import { InputField } from '../../components/auth/InputField';
import { PasswordStrengthIndicator } from '../../components/auth/PasswordStrengthIndicator';
import { LoadingSpinner } from '../../components/auth/LoadingSpinner';
import { LoadingScreen } from '../../components/LoadingScreen';
import { passwordResetSchema } from '../../utils/validation';
import { SupabaseAuthService } from '../../services/supabaseAuthService';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  // Check for access token in URL
  useEffect(() => {
    const checkToken = async () => {
      try {
        setIsPageLoading(true);
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        if (!accessToken && !refreshToken) {
          setSubmitError('Invalid or expired reset link. Please request a new password reset.');
          setIsValidToken(false);
        } else {
          // Verify token is valid
          setIsValidToken(true);
        }
      } catch (error) {
        setSubmitError('Invalid or expired reset link. Please request a new password reset.');
        setIsValidToken(false);
      } finally {
        setIsPageLoading(false);
      }
    };
    
    checkToken();
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      const fieldSchema = passwordResetSchema.pick({ [fieldName]: true });
      fieldSchema.parse({ 
        token: 'dummy-token', // Required for schema but not used in field validation
        [fieldName]: formData[fieldName as keyof typeof formData] 
      });
      
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
      passwordResetSchema.parse({
        token: 'dummy-token', // Required for schema
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        if (err.path[0] !== 'token') {
          newErrors[err.path[0]] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);
    
    if (!validateForm()) {
      return;
    }

    const accessToken = searchParams.get('access_token');
    if (!accessToken) {
      setSubmitError('Invalid reset link. Please request a new password reset.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await SupabaseAuthService.resetPassword({
        token: accessToken,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      if (response.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Password updated successfully! Please log in with your new password.' }
          });
        }, 3000);
      } else {
        setSubmitError(response.message || 'Failed to reset password');
        if (response.errors) {
          setErrors(response.errors);
        }
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return <LoadingScreen message="Verifying reset link..." />;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-500" size={32} />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Password Updated!
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your password has been successfully updated. You will be redirected to the login page shortly.
            </p>
            
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-sm text-gray-500">Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-500" size={32} />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Invalid Reset Link
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This password reset link is invalid or has expired. Please request a new password reset.
            </p>
            
            <button
              onClick={() => navigate('/forgot-password')}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
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
            Reset Your Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your new password below
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submit Error */}
            {submitError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <p className="text-red-700 dark:text-red-400 text-sm">{submitError}</p>
                </div>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <InputField
                label="New Password"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="Enter your new password"
                error={touched.newPassword ? errors.newPassword : ''}
                required
                autoComplete="new-password"
              />
              <PasswordStrengthIndicator password={formData.newPassword} />
            </div>

            {/* Confirm Password */}
            <InputField
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Confirm your new password"
              error={touched.confirmPassword ? errors.confirmPassword : ''}
              success={formData.confirmPassword && formData.newPassword === formData.confirmPassword && !errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !!submitError}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}