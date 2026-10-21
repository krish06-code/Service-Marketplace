import React from 'react';

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

const LoadingSpinner = ({ size = 'md', className = '' }) => (
  <div className={`${sizeClasses[size]} rounded-full border-accent/20 border-t-accent animate-spin ${className}`} />
);

export const PageLoader = () => (
  <div className="min-h-screen bg-bg-primary flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-text-muted text-sm">Loading...</p>
    </div>
  </div>
);

export default LoadingSpinner;
