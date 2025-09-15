import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className={`animate-spin rounded-full border-4 border-blue-200 ${sizeClasses[size]}`}></div>
        <div className={`animate-spin rounded-full border-4 border-transparent border-t-blue-500 absolute top-0 left-0 ${sizeClasses[size]}`}></div>
        <div className={`animate-pulse rounded-full bg-blue-500 absolute top-2 left-2 ${size === 'small' ? 'w-4 h-4' : size === 'medium' ? 'w-6 h-6' : 'w-8 h-8'}`}></div>
      </div>
      <p className="mt-6 text-gray-600 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
