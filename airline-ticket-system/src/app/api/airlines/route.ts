import { D1Database } from '@cloudflare/workers-types';
import { getAirlines } from './dbFunctions';

export const runtime = 'edge';

export async function GET(request: Request, { env }: { env: { DB: D1Database } }) {
  try {
    const airlines = await getAirlines(env.DB);
    return Response.json(airlines);
  } catch (error) {
    console.error('Error fetching airlines:', error);
    return Response.json({ error: 'Failed to fetch airlines' }, { status: 500 });
  }
}
