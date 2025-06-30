import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
        <p className="text-red-700 dark:text-red-400 text-sm">{message}</p>
      </div>
    </div>
  );
}