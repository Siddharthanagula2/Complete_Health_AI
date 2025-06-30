import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SuccessMessage } from '@/components/ui/SuccessMessage';

// Define the validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

// Type for our form data
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    
    try {
      // Send password reset email with Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        setServerError(error.message);
        return;
      }
      
      setSuccessMessage(`Password reset instructions sent to ${data.email}. Please check your inbox.`);
    } catch (error) {
      console.error('Forgot password error:', error);
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Reset Password</h2>
        
        <ErrorMessage message={serverError || ''} className="mb-6" />
        <SuccessMessage message={successMessage || ''} className="mb-6" />
        
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !!successMessage}
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to login</span>
          </a>
        </div>
      </div>
    </div>
  );
}