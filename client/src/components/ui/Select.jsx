import React from 'react';

const Select = ({ label, error, options = [], className = '', ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
    <select
      className={`input-field appearance-none cursor-pointer ${error ? 'border-danger' : ''} ${className}`}
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-bg-surface text-text-primary">
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-danger">{error}</p>}
  </div>
);

export default Select;
