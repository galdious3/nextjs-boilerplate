'use client';

import React from 'react';
import { BookingWithDetails } from '@/lib/db';
import { getDayName, formatPrice } from '@/lib/db';

interface BookingsTableProps {
  bookings: BookingWithDetails[];
  onDelete: (id: number) => void;
}

export default function BookingsTable({ bookings, onDelete }: BookingsTableProps) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th className="text-black font-bold">معرف الحجز</th>
            <th className="text-black font-bold">اسم المسافر</th>
            <th className="text-black font-bold">شركة الطيران</th>
            <th className="text-black font-bold">الوجهة</th>
            <th className="text-black font-bold">يوم السفر</th>
            <th className="text-black font-bold">وقت المغادرة</th>
            <th className="text-black font-bold">درجة السفر</th>
            <th className="text-black font-bold">عدد الحقائب</th>
            <th className="text-black font-bold">خصم طبي</th>
            <th className="text-black font-bold">السعر النهائي</th>
            <th className="text-black font-bold">تاريخ الحجز</th>
            <th className="text-black font-bold">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="animate-fadeIn">
              <td className="text-black">{booking.id}</td>
              <td className="text-black">{booking.passenger_name}</td>
              <td className="text-black">{booking.airline_name}</td>
              <td className="text-black">{booking.destination}</td>
              <td className="text-black">{getDayName(booking.day_of_week)}</td>
              <td className="text-black">{booking.departure_time}</td>
              <td className="text-black">{booking.travel_class}</td>
              <td className="text-black">{booking.bags_count}</td>
              <td className="text-black">{booking.medical_discount ? 'نعم' : 'لا'}</td>
              <td className="text-black font-bold">{formatPrice(booking.final_price)}</td>
              <td className="text-black">{new Date(booking.booking_date).toLocaleString('ar-SA')}</td>
              <td>
                <button
                  onClick={() => onDelete(booking.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={12} className="text-center py-8 text-gray-700 font-bold">
                لا توجد حجوزات
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
