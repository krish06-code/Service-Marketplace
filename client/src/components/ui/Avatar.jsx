import React from 'react';
import { User } from 'lucide-react';

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

const Avatar = ({ src, alt, size = 'md', fallback, className = '' }) => {
  const [imgError, setImgError] = React.useState(false);
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={`${sizeClass} rounded-full object-cover border border-border-color ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center border border-border-color shrink-0 ${className}`}>
      {fallback ? (
        <span className="font-semibold text-white leading-none">
          {fallback.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
        </span>
      ) : (
        <User className="h-1/2 w-1/2 text-white" />
      )}
    </div>
  );
};

export default Avatar;
