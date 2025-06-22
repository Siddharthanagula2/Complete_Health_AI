import React from 'react';
import { getPasswordStrength } from '../../utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className = '' }: PasswordStrengthIndicatorProps) {
  const { score, feedback, color } = getPasswordStrength(password);
  
  if (!password) return null;

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Strength bar */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              level <= score
                ? strengthColors[color as keyof typeof strengthColors]
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      
      {/* Strength label */}
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${
          color === 'red' ? 'text-red-600' :
          color === 'orange' ? 'text-orange-600' :
          color === 'yellow' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {strengthLabels[score - 1] || 'Very Weak'}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {score}/5
        </span>
      </div>
      
      {/* Requirements */}
      {feedback.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">Password must include:</p>
          <ul className="space-y-1">
            {feedback.map((requirement, index) => (
              <li key={index} className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}