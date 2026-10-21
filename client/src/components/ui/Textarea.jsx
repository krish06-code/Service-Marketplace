import React from 'react';

const Textarea = ({ label, error, hint, className = '', ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
    <textarea
      className={`input-field min-h-[100px] resize-y ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''} ${className}`}
      {...rest}
    />
    {error && <p className="text-xs text-danger">{error}</p>}
    {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
  </div>
);

export default Textarea;
