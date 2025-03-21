import { D1Database } from '@cloudflare/workers-types';

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
