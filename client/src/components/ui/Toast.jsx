import React from 'react';

const Toast = ({ type = 'info', message, onClose }) => {
  const typeClasses = {
    info: 'bg-bg-surface-2 border-accent',
    success: 'bg-bg-surface-2 border-success text-success',
    error: 'bg-bg-surface-2 border-danger text-danger',
    warning: 'bg-bg-surface-2 border-warning text-warning',
  };

  return (
    <div className={`flex items-center justify-between p-4 mb-2 rounded-lg border-l-4 shadow-md ${typeClasses[type]} min-w-[300px] animate-slide-up`}>
      <span className="text-sm font-medium text-text-primary">{message}</span>
      <button onClick={onClose} className="text-text-muted hover:text-text-primary ml-4">
        &times;
      </button>
    </div>
  );
};

export default Toast;
