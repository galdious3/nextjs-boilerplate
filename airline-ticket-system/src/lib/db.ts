import { D1Database } from '@cloudflare/workers-types';

export interface Airline {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface FlightPrice {
  id: number;
  from_city_id: number;
  to_city_id: number;
  price: number;
}

export interface FlightSchedule {
  id: number;
  airline_id: number;
  from_city_id: number;
  to_city_id: number;
  day_of_week: number;
  departure_time: string;
  arrival_time: string;
  airline_name?: string;
  from_city_name?: string;
  to_city_name?: string;
}

export interface Booking {
  id: number;
  passenger_name: string;
  flight_schedule_id: number;
  travel_class: string;
  bags_count: number;
  medical_discount: boolean;
  final_price: number;
  booking_date: string;
}

export interface BookingWithDetails extends Booking {
  airline_name: string;
  destination: string;
  day_of_week: number;
  departure_time: string;
}

// Helper function to get day name in Arabic
export function getDayName(dayOfWeek: number): string {
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  return days[dayOfWeek];
}

// Helper function to format price
export function formatPrice(price: number): string {
  return price.toFixed(2) + " دولار";
}

// Helper function to calculate final price
export function calculateFinalPrice(
  basePrice: number,
  travelClass: string,
  bagsCount: number,
  medicalDiscount: boolean
): number {
  let classMultiplier = 1.0;
  
  switch (travelClass) {
    case "درجة رجال الأعمال":
      classMultiplier = 1.5;
      break;
    case "الدرجة الأولى":
      classMultiplier = 2.0;
      break;
  }
  
  const bagsPrice = bagsCount * 50; // $50 per bag
  const discountMultiplier = medicalDiscount ? 0.8 : 1.0; // 20% medical discount
  
  return (basePrice * classMultiplier + bagsPrice) * discountMultiplier;
}
