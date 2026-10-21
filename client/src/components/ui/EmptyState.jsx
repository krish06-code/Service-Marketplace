import React from 'react';
import Button from './Button';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {Icon && (
      <div className="mb-4 p-4 rounded-full bg-bg-surface-2 border border-border-color">
        <Icon className="h-10 w-10 text-text-muted" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
    {description && <p className="text-text-muted text-sm max-w-sm mb-6">{description}</p>}
    {action && (
      <Button variant={action.variant || 'primary'} onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
);

export default EmptyState;
