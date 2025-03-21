import React from 'react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function Header({ title, onBack, showBackButton = false }: HeaderProps) {
  return (
    <header className="bg-blue-500 text-white py-4 px-6 shadow-md flex items-center justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      
      {showBackButton && onBack && (
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
        >
          العودة للقائمة الرئيسية
        </button>
      )}
    </header>
  );
}
