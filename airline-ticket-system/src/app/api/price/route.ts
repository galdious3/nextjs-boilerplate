import { D1Database } from '@cloudflare/workers-types';
import { getFlightPrice } from '../dbFunctions';

export const runtime = 'edge';

export async function GET(request: Request, { env }: { env: { DB: D1Database } }) {
  try {
    const { searchParams } = new URL(request.url);
    const fromCityId = searchParams.get('fromCityId');
    const toCityId = searchParams.get('toCityId');
    
    if (!fromCityId || !toCityId) {
      return Response.json({ error: 'From city ID and to city ID are required' }, { status: 400 });
    }
    
    const price = await getFlightPrice(env.DB, parseInt(fromCityId), parseInt(toCityId));
    return Response.json({ price });
  } catch (error) {
    console.error('Error fetching price:', error);
    return Response.json({ error: 'Failed to fetch price' }, { status: 500 });
  }
}
