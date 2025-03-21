import React from 'react';

interface SelectProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'اختر...',
  required = false,
  className = ''
}: SelectProps) {
  return (
    <div className={`form-group ${className}`}>
      <label className="form-label">{label}</label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="form-control"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
