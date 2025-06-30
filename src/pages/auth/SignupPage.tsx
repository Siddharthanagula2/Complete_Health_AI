import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Heart, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { signupSchema, getPasswordStrength } from '../../utils/validation';
import { LoadingSpinner } from '../../components/auth/LoadingSpinner';
import { LoadingScreen } from '../../components/LoadingScreen';
import { SupabaseAuthService } from '../../services/supabaseAuthService';

// Extract the type from the zod schema
type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, isValid, isDirty }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  });

  // Get current password value for strength indicator
  const password = watch('password');
  const passwordStrength = getPasswordStrength(password || '');

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await SupabaseAuthService.isAuthenticated();
        if (isAuthenticated) {
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setPageLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Form submission handler
  const onSubmit = async (data: SignupFormData) => {
    setSubmitError('');
    setIsLoading(true);
    
    try {
      const response = await SupabaseAuthService.signup({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        agreeToTerms: data.agreeToTerms
      });
      
      if (response.success) {
        if (response.message?.includes('email') || response.message?.includes('confirm')) {
          setSignupSuccess(true);
        } else {
          navigate('/dashboard');
        }
      } else {
        setSubmitError(response.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const email = watch('email');
    if (!email) return;
    
    try {
      setIsLoading(true);
      const response = await SupabaseAuthService.resendConfirmation(email);
      if (response.success) {
        setSubmitError('Confirmation email sent again! Please check your inbox.');
      } else {
        setSubmitError(response.message || 'Failed to resend confirmation email');
      }
    } catch (error) {
      setSubmitError('Failed to resend confirmation email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      const response = await SupabaseAuthService.socialLogin('google');
      if (!response.success) {
        setSubmitError(response.message || 'Google signup failed');
      }
      // If successful, the redirect will happen automatically
    } catch (error) {
      setSubmitError('Google signup is currently unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return <LoadingScreen message="Preparing signup..." />;
  }

  // Show success page if signup was successful but needs email confirmation
  if (signupSuccess) {
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
              Check Your Email
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent a confirmation link to <strong>{watch('email')}</strong>. 
              Please check your email and click the link to activate your account.
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              
              <button
                onClick={handleResendConfirmation}
                disabled={isLoading}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Resend confirmation email'}
              </button>
            </div>
            
            <div className="mt-8">
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Back to login
              </Link>
            </div>
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
            Create Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start your journey to better health today
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Submit Error */}
            {submitError && !submitError.includes('sent') && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <p className="text-red-700 dark:text-red-400 text-sm">{submitError}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {submitError && submitError.includes('sent') && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <p className="text-green-700 dark:text-green-400 text-sm">{submitError}</p>
                </div>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/10'
                      : touchedFields.fullName && !errors.fullName
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50 dark:bg-green-900/10'
                      : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-200 bg-white dark:bg-gray-800'
                  } text-gray-900 dark:text-white`}
                  placeholder="Enter your full name"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="text-red-500" size={20} />
                  </div>
                )}
                {touchedFields.fullName && !errors.fullName && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="text-green-500" size={20} />
                  </div>
                )}
              </div>
              {errors.fullName && (
                <p id="fullName-error" className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  <span>{errors.fullName.message}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/10'
                      : touchedFields.email && !errors.email
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50 dark:bg-green-900/10'
                      : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-200 bg-white dark:bg-gray-800'
                  } text-gray-900 dark:text-white`}
                  placeholder="Enter your email address"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register('email')}
                />
                {errors.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="text-red-500" size={20} />
                  </div>
                )}
                {touchedFields.email && !errors.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="text-green-500" size={20} />
                  </div>
                )}
              </div>
              {errors.email && (
                <p id="email-error" className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/10'
                      : touchedFields.password && !errors.password
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50 dark:bg-green-900/10'
                      : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-200 bg-white dark:bg-gray-800'
                  } text-gray-900 dark:text-white`}
                  placeholder="Create a strong password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-red-600 dark:text-red-400 flex items-center">
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
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  
                  {/* Strength label */}
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${
                      passwordStrength.color === 'red' ? 'text-red-600 dark:text-red-400' :
                      passwordStrength.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                      passwordStrength.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {passwordStrength.score === 1 ? 'Very Weak' :
                       passwordStrength.score === 2 ? 'Weak' :
                       passwordStrength.score === 3 ? 'Fair' :
                       passwordStrength.score === 4 ? 'Good' : 'Strong'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {passwordStrength.score}/5
                    </span>
                  </div>
                  
                  {/* Requirements */}
                  {passwordStrength.feedback.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Password must include:</p>
                      <ul className="space-y-1">
                        {passwordStrength.feedback.map((requirement, index) => (
                          <li key={index} className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/10'
                      : touchedFields.confirmPassword && !errors.confirmPassword
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50 dark:bg-green-900/10'
                      : 'border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-200 bg-white dark:bg-gray-800'
                  } text-gray-900 dark:text-white`}
                  placeholder="Confirm your password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  <span>{errors.confirmPassword.message}</span>
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  aria-invalid={!!errors.agreeToTerms}
                  aria-describedby={errors.agreeToTerms ? "agreeToTerms-error" : undefined}
                  {...register('agreeToTerms')}
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              {errors.agreeToTerms && (
                <p id="agreeToTerms-error" className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  <span>{errors.agreeToTerms.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (!isDirty || !isValid)}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
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

          {/* Social Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 border rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}