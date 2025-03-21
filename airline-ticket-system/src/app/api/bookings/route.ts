import { D1Database } from '@cloudflare/workers-types';
import { getAllBookings, createBooking } from '../dbFunctions';

export const runtime = 'edge';

export async function GET(request: Request, { env }: { env: { DB: D1Database } }) {
  try {
    const bookings = await getAllBookings(env.DB);
    return Response.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return Response.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request, { env }: { env: { DB: D1Database } }) {
  try {
    const body = await request.json();
    const { passengerName, flightScheduleId, travelClass, bagsCount, medicalDiscount, finalPrice } = body;
    
    // Validate required fields
    if (!passengerName || !flightScheduleId || !travelClass) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const success = await createBooking(
      env.DB,
      passengerName,
      flightScheduleId,
      travelClass,
      bagsCount,
      medicalDiscount,
      finalPrice
    );
    
    if (success) {
      return Response.json({ success: true });
    } else {
      return Response.json({ error: 'Failed to create booking' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    return Response.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
