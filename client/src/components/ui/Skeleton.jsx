import React from 'react';

const Skeleton = ({ className = '', variant = 'rect' }) => {
  const base = 'animate-pulse bg-gradient-to-r from-bg-surface-2 via-border-color to-bg-surface-2 bg-[length:200%_100%]';
  const shapes = {
    rect: 'rounded-lg',
    text: 'rounded h-4',
    circle: 'rounded-full',
  };
  return <div className={`${base} ${shapes[variant] || shapes.rect} ${className}`} style={{ backgroundPosition: 'right center', animation: 'shimmer 1.5s infinite' }} />;
};

export const SkeletonCard = () => (
  <div className="card p-5 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton variant="circle" className="h-12 w-12" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
    <Skeleton className="h-20" />
    <div className="flex gap-2">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 flex-1" />
    </div>
  </div>
);

export const SkeletonList = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export default Skeleton;
