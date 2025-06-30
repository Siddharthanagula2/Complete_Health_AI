import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  className?: string;
}

export function SuccessMessage({ message, className = '' }: SuccessMessageProps) {
  if (!message) return null;
  
  return (
    <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
        <p className="text-green-700 dark:text-green-400 text-sm">{message}</p>
      </div>
    </div>
  );
}