import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

// Define the validation schema
const signupSchema = z.object({
  fullName: z.string()
    .min(4, 'Full name must be at least 4 characters')
    .max(50, 'Full name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
    .refine(
      (name) => {
        const words = name.trim().split(/\s+/);
        return words.length >= 2;
      },
      {
        message: 'Please enter both first and last name'
      }
    ),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Type for our form data
type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const navigate = useNavigate();
  const supabase = createClientComponentClient<Database>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  
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
  const email = watch('email');

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

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    setIsLoading(true);
    
    try {
      // Sign up with Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('already registered')) {
          setServerError('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('password')) {
          setServerError(error.message);
        } else {
          setServerError(error.message);
        }
        return;
      }
      
      // Check if email confirmation is required
      if (authData.user && !authData.user.identities?.[0]?.identity_data?.email_verified) {
        setSignupSuccess(true);
      } else {
        // If no email confirmation required, redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        setServerError(error.message);
      } else {
        setServerError('Confirmation email sent again! Please check your inbox.');
      }
    } catch (error) {
      setServerError('Failed to resend confirmation email');
    } finally {
      setIsLoading(false);
    }
  };

  // Show success page if signup was successful but needs email confirmation
  if (signupSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Check Your Email
          </h1>
          
          <p className="text-gray-300 mb-6">
            We've sent a confirmation link to <strong>{email}</strong>. 
            Please check your email and click the link to activate your account.
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <button
              onClick={handleResendConfirmation}
              disabled={isLoading}
              className="text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Resend confirmation email'}
            </button>
          </div>
          
          <div className="mt-8">
            <a
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Back to login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
        
        {/* Error Message */}
        {serverError && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-400 text-sm">{serverError}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="fullName"
                type="text"
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? 'border-red-600 focus:border-red-500 focus:ring-red-900/50'
                    : touchedFields.fullName && !errors.fullName
                    ? 'border-green-600 focus:border-green-500 focus:ring-green-900/50'
                    : 'border-gray-600 focus:border-emerald-500 focus:ring-emerald-900/50'
                } text-white`}
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
              <p id="fullName-error" className="text-sm text-red-500 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                <span>{errors.fullName.message}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-600 focus:border-red-500 focus:ring-red-900/50'
                    : touchedFields.email && !errors.email
                    ? 'border-green-600 focus:border-green-500 focus:ring-green-900/50'
                    : 'border-gray-600 focus:border-emerald-500 focus:ring-emerald-900/50'
                } text-white`}
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
              <p id="email-error" className="text-sm text-red-500 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password <span className="text-red-500">*</span>
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

          {/* Terms Agreement */}
          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <input
                id="agreeToTerms"
                type="checkbox"
                className="mt-1 w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 rounded focus:ring-emerald-600 focus:ring-offset-gray-800"
                aria-invalid={!!errors.agreeToTerms}
                aria-describedby={errors.agreeToTerms ? "agreeToTerms-error" : undefined}
                {...register('agreeToTerms')}
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-300">
                I agree to the{' '}
                <a href="/terms" className="text-emerald-400 hover:text-emerald-300 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-emerald-400 hover:text-emerald-300 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            {errors.agreeToTerms && (
              <p id="agreeToTerms-error" className="text-sm text-red-500 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                <span>{errors.agreeToTerms.message}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (!isDirty || !isValid)}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}