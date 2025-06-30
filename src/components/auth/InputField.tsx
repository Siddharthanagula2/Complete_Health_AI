import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface InputFieldProps {
  label: string;
  type: 'text' | 'email' | 'password';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  success?: boolean;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
}

export function InputField({
  label,
  type,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  success,
  required = false,
  disabled = false,
  autoComplete,
  className = ''
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Determine if we have validation icons to show
  const hasValidationIcon = !!(error || success);
  const isPasswordField = type === 'password';

  const getInputClasses = () => {
    const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    // Adjust padding based on what icons are present
    let paddingRight = 'pr-4'; // Default padding
    
    if (isPasswordField && hasValidationIcon) {
      // Both password toggle and validation icon
      paddingRight = 'pr-20';
    } else if (isPasswordField || hasValidationIcon) {
      // Either password toggle OR validation icon
      paddingRight = 'pr-12';
    }
    
    if (error) {
      return `${baseClasses} ${paddingRight} border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/10`;
    }
    
    if (success) {
      return `${baseClasses} ${paddingRight} border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50 dark:bg-green-900/10`;
    }
    
    if (isFocused) {
      return `${baseClasses} ${paddingRight} border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white dark:bg-gray-800`;
    }
    
    return `${baseClasses} ${paddingRight} border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={getInputClasses()}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        
        {/* Icons container - positioned from right to left */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {/* Validation icon (rightmost when both are present) */}
          {hasValidationIcon && (
            <div className="flex-shrink-0">
              {error && <AlertCircle className="text-red-500" size={20} />}
              {success && <CheckCircle className="text-green-500" size={20} />}
            </div>
          )}
          
          {/* Password visibility toggle (left of validation icon when both are present) */}
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:text-gray-600 dark:focus:text-gray-300"
              tabIndex={-1}
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
          <AlertCircle size={14} className="mr-1" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}