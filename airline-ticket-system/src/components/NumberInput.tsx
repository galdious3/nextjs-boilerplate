import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export default function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = ''
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  const increment = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  return (
    <div className={`form-group ${className}`}>
      <label className="form-label">{label}</label>
      <div className="flex">
        <button
          type="button"
          onClick={decrement}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-none rounded-l-md border border-gray-200"
        >
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className="form-control rounded-none border-x-0 text-center"
        />
        <button
          type="button"
          onClick={increment}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-l-none rounded-r-md border border-gray-200"
        >
          +
        </button>
      </div>
    </div>
  );
}
