import React from 'react';

const Input = React.forwardRef(({ label, error, hint, icon: Icon, className = '', ...rest }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-text-muted" />
          </div>
        )}
        <input
          ref={ref}
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-danger focus:ring-danger focus:border-danger' : ''} ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-text-muted">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
