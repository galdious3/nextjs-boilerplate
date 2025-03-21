'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BookingsTable from '@/components/BookingsTable';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { BookingWithDetails } from '@/lib/db';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Show confirmation dialog
    if (!confirm(`هل أنت متأكد من حذف الحجز رقم ${id}؟`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted booking from the state
        setBookings(bookings.filter(booking => booking.id !== id));
        alert('تم حذف الحجز بنجاح!');
      } else {
        const error = await response.json();
        alert(`خطأ في حذف الحجز: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('حدث خطأ أثناء حذف الحجز');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header title="جميع الحجوزات" showBackButton onBack={() => router.push('/')} />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-black font-bold">جاري تحميل الحجوزات...</p>
            </div>
          ) : (
            <>
              <BookingsTable bookings={bookings} onDelete={handleDelete} />
              
              <div className="mt-6 flex justify-center gap-4">
                <Button
                  variant="primary"
                  onClick={fetchBookings}
                  className="px-6"
                  disabled={isLoading || isDeleting}
                >
                  <span className="text-white font-bold">تحديث القائمة</span>
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => router.push('/booking')}
                  className="px-6"
                >
                  <span className="text-black font-bold">حجز تذكرة جديدة</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
