import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SuccessMessage } from '@/components/ui/SuccessMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Define the validation schema
const passwordResetSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Type for our form data
type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

export default function PasswordResetForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields }
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  // Get current password value for strength indicator
  const password = watch('password');

  // Check for access token in URL
  useEffect(() => {
    const checkToken = async () => {
      try {
        setIsPageLoading(true);
        
        // Get hash parameters from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        if (!accessToken || type !== 'recovery') {
          setServerError('Invalid or expired reset link. Please request a new password reset.');
          setIsValidToken(false);
          return;
        }
        
        // Set the session with the tokens
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });
        
        if (error) {
          setServerError('Invalid or expired reset link. Please request a new password reset.');
          setIsValidToken(false);
          return;
        }
        
        setIsValidToken(true);
      } catch (error) {
        console.error('Error checking token:', error);
        setServerError('Invalid or expired reset link. Please request a new password reset.');
        setIsValidToken(false);
      } finally {
        setIsPageLoading(false);
      }
    };
    
    checkToken();
  }, []);

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, color: 'red' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    const colors = ['red', 'red', 'orange', 'yellow', 'green', 'green'];
    return { score, color: colors[score] };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: PasswordResetFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    
    try {
      // Update password with Supabase
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (error) {
        setServerError(error.message);
        return;
      }
      
      setSuccessMessage('Your password has been successfully updated!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-300">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertCircle className="text-red-500" size={32} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Invalid Reset Link
          </h1>
          
          <p className="text-gray-300 mb-6">
            This password reset link is invalid or has expired. Please request a new password reset.
          </p>
          
          <a
            href="/forgot-password"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Request New Reset Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Reset Your Password</h2>
        
        <ErrorMessage message={serverError || ''} className="mb-6" />
        <SuccessMessage message={successMessage || ''} className="mb-6" />
        
        {!successMessage && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 bg-gray-700 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-600 focus:border-red-500 focus:ring-red-900/50'
                      : touchedFields.password && !errors.password
                      ? 'border-green-600 focus:border-green-500 focus:ring-green-900/50'
                      : 'border-gray-600 focus:border-emerald-500 focus:ring-emerald-900/50'
                  } text-white`}
                  placeholder="Create a strong password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-red-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  <span>{errors.password.message}</span>
                </p>
              )}
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2 mt-2">
                  {/* Strength bar */}
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength.score
                            ? passwordStrength.color === 'red' ? 'bg-red-500' :
                              passwordStrength.color === 'orange' ? 'bg-orange-500' :
                              passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                              'bg-green-500'
                            : 'bg-gray-600'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  
                  {/* Strength label */}
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${
                      passwordStrength.color === 'red' ? 'text-red-400' :
                      passwordStrength.color === 'orange' ? 'text-orange-400' :
                      passwordStrength.color === 'yellow' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {passwordStrength.score === 1 ? 'Very Weak' :
                       passwordStrength.score === 2 ? 'Weak' :
                       passwordStrength.score === 3 ? 'Fair' :
                       passwordStrength.score === 4 ? 'Good' : 'Strong'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {passwordStrength.score}/5
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 bg-gray-700 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-red-600 focus:border-red-500 focus:ring-red-900/50'
                      : touchedFields.confirmPassword && !errors.confirmPassword
                      ? 'border-green-600 focus:border-green-500 focus:ring-green-900/50'
                      : 'border-gray-600 focus:border-emerald-500 focus:ring-emerald-900/50'
                  } text-white`}
                  placeholder="Confirm your password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="text-sm text-red-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  <span>{errors.confirmPassword.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}