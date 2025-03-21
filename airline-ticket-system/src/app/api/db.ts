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

// Database API functions
export async function getAirlines(db: D1Database) {
  const airlines = await db.prepare('SELECT * FROM airlines ORDER BY name').all();
  return airlines.results;
}

export async function getCities(db: D1Database) {
  const cities = await db.prepare('SELECT * FROM cities ORDER BY name').all();
  return cities.results;
}

export async function getFlightsByAirline(db: D1Database, airlineId: number) {
  const flights = await db.prepare(`
    SELECT fs.id, fs.airline_id, fs.from_city_id, fs.to_city_id, fs.day_of_week, 
           fs.departure_time, fs.arrival_time, c.name as to_city_name
    FROM flight_schedules fs
    JOIN cities c ON fs.to_city_id = c.id
    WHERE fs.airline_id = ?
    ORDER BY c.name, fs.day_of_week, fs.departure_time
  `)
  .bind(airlineId)
  .all();
  
  return flights.results;
}

export async function getFlightPrice(db: D1Database, fromCityId: number, toCityId: number) {
  const price = await db.prepare(`
    SELECT price FROM flight_prices 
    WHERE from_city_id = ? AND to_city_id = ?
  `)
  .bind(fromCityId, toCityId)
  .first();
  
  return price ? (price.price as number) : 0;
}

export async function createBooking(
  db: D1Database, 
  passengerName: string,
  flightScheduleId: number,
  travelClass: string,
  bagsCount: number,
  medicalDiscount: boolean,
  finalPrice: number
) {
  const result = await db.prepare(`
    INSERT INTO bookings (
      passenger_name, flight_schedule_id, travel_class, 
      bags_count, medical_discount, final_price, booking_date
    ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `)
  .bind(
    passengerName,
    flightScheduleId,
    travelClass,
    bagsCount,
    medicalDiscount ? 1 : 0,
    finalPrice
  )
  .run();
  
  return result.success;
}

export async function getAllBookings(db: D1Database) {
  const bookings = await db.prepare(`
    SELECT b.id, b.passenger_name, a.name as airline_name, c.name as destination, 
           fs.day_of_week, fs.departure_time, b.travel_class, b.bags_count, 
           b.medical_discount, b.final_price, b.booking_date
    FROM bookings b
    JOIN flight_schedules fs ON b.flight_schedule_id = fs.id
    JOIN airlines a ON fs.airline_id = a.id
    JOIN cities c ON fs.to_city_id = c.id
    ORDER BY b.booking_date DESC
  `).all();
  
  return bookings.results;
}

export async function deleteBooking(db: D1Database, bookingId: number) {
  const result = await db.prepare('DELETE FROM bookings WHERE id = ?')
    .bind(bookingId)
    .run();
    
  return result.success;
}
