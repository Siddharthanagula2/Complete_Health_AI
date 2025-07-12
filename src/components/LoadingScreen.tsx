import React from 'react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({ message = 'Loading...', fullScreen = true }: LoadingScreenProps) {
  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}