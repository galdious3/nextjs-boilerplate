import { D1Database } from '@cloudflare/workers-types';
import { getFlightsByAirline } from '../dbFunctions';

export const runtime = 'edge';

export async function GET(request: Request, { env }: { env: { DB: D1Database } }) {
  try {
    const { searchParams } = new URL(request.url);
    const airlineId = searchParams.get('airlineId');
    
    if (!airlineId) {
      return Response.json({ error: 'Airline ID is required' }, { status: 400 });
    }
    
    const flights = await getFlightsByAirline(env.DB, parseInt(airlineId));
    return Response.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return Response.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}
