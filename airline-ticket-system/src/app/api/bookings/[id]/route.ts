import { D1Database } from '@cloudflare/workers-types';
import { deleteBooking } from '../../dbFunctions';

export const runtime = 'edge';

export async function DELETE(
  request: Request,
  { params, env }: { params: { id: string }; env: { DB: D1Database } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid booking ID' }, { status: 400 });
    }
    
    const success = await deleteBooking(env.DB, id);
    
    if (success) {
      return Response.json({ success: true });
    } else {
      return Response.json({ error: 'Booking not found or could not be deleted' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    return Response.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
