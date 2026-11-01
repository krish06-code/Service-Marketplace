import React from 'react';
import { Zap } from 'lucide-react';

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

const LoadingSpinner = ({ size = 'md', className = '' }) => (
  <div className={`${sizeClasses[size]} rounded-full border-accent/20 border-t-accent animate-spin ${className}`} />
);

export const PageLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center shadow-[0_8px_24px_rgba(244,91,53,0.35)]">
          <Zap className="h-8 w-8 text-white fill-current" />
        </div>
        <div className="absolute -inset-1 rounded-2xl border-2 border-accent/30 animate-ping" />
      </div>
      <div className="text-center">
        <p className="font-bold text-text-primary text-sm">Servi<span className="text-accent">Connect</span></p>
        <p className="text-text-muted text-xs mt-0.5">Loading...</p>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
