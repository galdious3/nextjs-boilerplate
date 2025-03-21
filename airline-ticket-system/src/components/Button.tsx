import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'success' | 'danger' | 'default';
  className?: string;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'default', 
  className = '',
  icon,
  type = 'button',
  disabled = false
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-md transition-all duration-200 font-bold flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    default: 'bg-gray-200 text-black hover:bg-gray-300'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
