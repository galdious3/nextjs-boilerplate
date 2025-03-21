import React from 'react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-500 text-white py-6 px-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">نظام إدارة حجز تذاكر الطيران</h1>
        <div className="flex justify-center mt-2">
          <div className="text-white/70 flex items-center gap-2">
            <span>✦</span>
            <span>✦</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-6">
          <div className="logo-circle">
            <span className="text-6xl text-white">✈</span>
          </div>
          <p className="text-xl text-gray-700 flex items-center gap-2">
            <span className="text-blue-500">•</span>
            <span>سافر بأمان وراحة مع أفضل خدمات الحجز</span>
            <span className="text-blue-500">•</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-6 w-full max-w-md animate-fadeIn">
          <Link href="/booking" className="w-full">
            <Button 
              variant="primary" 
              className="w-full text-xl py-4"
              icon={<span>+</span>}
            >
              حجز تذكرة جديدة
            </Button>
          </Link>
          
          <Link href="/bookings" className="w-full">
            <Button 
              variant="default" 
              className="w-full text-xl py-4"
              icon={<span>≡</span>}
            >
              عرض جميع الحجوزات
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 text-center text-gray-600">
        <p>© {new Date().getFullYear()} نظام إدارة حجز تذاكر الطيران</p>
      </footer>
    </main>
  );
}
