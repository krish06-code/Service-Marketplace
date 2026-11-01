import React from 'react';

const variantClasses = {
  default: 'bg-bg-surface text-text-secondary border border-border-color',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger: 'bg-red-50 text-red-600 border border-red-200',
  info: 'bg-accent/10 text-accent border border-accent/20',
  purple: 'bg-violet-50 text-violet-600 border border-violet-200',
};

const Badge = ({ variant = 'default', children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}>
    {children}
  </span>
);

export default Badge;
