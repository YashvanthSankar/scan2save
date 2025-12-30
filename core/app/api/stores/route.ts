import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data: stores, error } = await supabase
      .from('Store')
      .select('*')
      .eq('isActive', true)
      .order('name');

    if (error) throw error;

    return NextResponse.json({ success: true, stores });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storeId, name, location, lat, lng } = body;

    if (!storeId || !name || !location) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { data: store, error } = await supabase
      .from('Store')
      .insert({
        storeId: storeId.toUpperCase().replace(/\s/g, '_'),
        name,
        location,
        lat: lat || 0,
        lng: lng || 0,
        isActive: true,
        qrPayload: {
          storeId: storeId.toUpperCase().replace(/\s/g, '_'),
          name,
          location,
          timestamp: Date.now()
        }
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, store });
  } catch (error) {
    console.error('Error creating store:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create store' },
      { status: 500 }
    );
  }
}
