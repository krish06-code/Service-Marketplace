import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', size = 'md', isLoading, disabled, className = '', ...rest }) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none select-none';

  const variants = {
    primary: 'bg-accent hover:bg-accent-dark text-white rounded-xl shadow-[0_4px_14px_rgba(244,91,53,0.30)] hover:shadow-[0_6px_20px_rgba(244,91,53,0.40)] hover:-translate-y-0.5',
    secondary: 'border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-xl',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 rounded-xl',
    danger: 'bg-danger hover:bg-red-600 text-white rounded-xl shadow-[0_4px_14px_rgba(239,68,68,0.25)]',
    outline: 'border border-border-color text-text-secondary hover:border-accent hover:text-accent rounded-xl bg-transparent',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
