import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, AlertCircle, Heart } from 'lucide-react';
import { InputField } from '../../components/auth/InputField';
import { PasswordStrengthIndicator } from '../../components/auth/PasswordStrengthIndicator';
import { SocialButton } from '../../components/auth/SocialButton';
import { LoadingSpinner } from '../../components/auth/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { signupSchema } from '../../utils/validation';
import { SignupData } from '../../types/auth';

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<SignupData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState('');

  // Check for error in URL params (from OAuth callback)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get('error');
    if (error) {
      setSubmitError(decodeURIComponent(error));
    }
  }, [location.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing/changing
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
      // Create a partial schema for the specific field
      const fieldSchema = signupSchema.pick({ [fieldName]: true });
      fieldSchema.parse({ [fieldName]: formData[fieldName as keyof SignupData] });
      
      // Clear error if validation passes
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
      signupSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      
      // Process all validation errors
      error.errors?.forEach((err: any) => {
        const fieldName = err.path[0];
        newErrors[fieldName] = err.message;
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
    
    // Validate the entire form
    if (!validateForm()) {
      // REQUIRED DEBUG LOGGING
      console.log('VALIDATION ERRORS:', errors);
      return;
    }
    
    try {
      const response = await signup(formData);
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        setSubmitError(response.message || 'Signup failed');
        if (response.errors) {
          setErrors(response.errors);
          // REQUIRED DEBUG LOGGING for server errors
          console.log('VALIDATION ERRORS:', response.errors);
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleSignup = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'http://localhost:3001/auth/google';
  };

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

            {/* Full Name */}
            <InputField
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Enter your full name"
              error={touched.fullName ? errors.fullName : ''}
              required
              autoComplete="name"
            />

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
            <div className="space-y-2">
              <InputField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="Create a strong password"
                error={touched.password ? errors.password : ''}
                required
                autoComplete="new-password"
              />
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            {/* Confirm Password */}
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Confirm your password"
              error={touched.confirmPassword ? errors.confirmPassword : ''}
              success={formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            {/* Terms Agreement */}
            <div className="space-y-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              
              {/* REQUIRED: Dedicated error display for agreeToTerms */}
              {touched.agreeToTerms && errors.agreeToTerms && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>{errors.agreeToTerms}</span>
                </p>
              )}
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
          <div className="space-y-3">
            <SocialButton
              provider="google"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            />
          </div>

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