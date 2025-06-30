import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Define the validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false)
});

// Type for our form data
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsLoading(true);
    
    try {
      // Sign in with Supabase
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
        options: {
          // Set session persistence based on rememberMe
          persistSession: data.rememberMe
        }
      });
      
      if (error) {
        // Handle specific error messages
        if (error.message.includes('Invalid login credentials')) {
          setServerError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setServerError('Please verify your email address before signing in.');
        } else {
          setServerError(error.message);
        }
        return;
      }
      
      if (authData.user) {
        // Successful login, redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
        
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
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
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
                placeholder="your.email@example.com"
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

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
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
                placeholder="••••••••"
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
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 rounded focus:ring-emerald-600 focus:ring-offset-gray-800"
                {...register('rememberMe')}
              />
              <span className="text-sm text-gray-300">Remember me</span>
            </label>
            
            <a
              href="/forgot-password"
              className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Forgot password?
            </a>
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
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <a
              href="/signup"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}