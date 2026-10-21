import React from 'react';

const variantClasses = {
  default: 'bg-bg-surface-2 text-text-secondary border border-border-color',
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  danger: 'bg-danger/10 text-danger border border-danger/20',
  info: 'bg-accent/10 text-accent border border-accent/20',
  purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
};

const Badge = ({ variant = 'default', children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
    {children}
  </span>
);

export default Badge;
