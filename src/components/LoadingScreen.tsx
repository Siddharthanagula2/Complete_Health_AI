import React from 'react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingScreen({ 
  message = 'Loading...', 
  fullScreen = true,
  className = ''
}: LoadingScreenProps) {
  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-200 dark:border-emerald-800 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-emerald-500 border-emerald-200 dark:border-t-emerald-400 dark:border-emerald-800 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">{message}</p>
      </div>
    </div>
  );
}