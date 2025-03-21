import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  className = ''
}: CheckboxProps) {
  return (
    <div className={`form-group flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
      />
      <label className="form-label mb-0">{label}</label>
    </div>
  );
}
