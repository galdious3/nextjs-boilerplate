import React from 'react';

interface FormInputProps {
  label: string;
  type?: 'text' | 'number' | 'email' | 'password';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  className = ''
}: FormInputProps) {
  return (
    <div className={`form-group ${className}`}>
      <label className="form-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="form-control"
      />
    </div>
  );
}
