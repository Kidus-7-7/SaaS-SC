import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });

  // Get filter parameters
  const propertyType = searchParams.get('propertyType');
  const listingType = searchParams.get('listingType');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const city = searchParams.get('city');

  let query = supabase
    .from('properties')
    .select(`
      *,
      owner:owner_id(full_name, email),
      agent:agent_id(*)
    `)
    .eq('status', 'available');

  // Apply filters
  if (propertyType) query = query.eq('property_type', propertyType);
  if (listingType) query = query.eq('listing_type', listingType);
  if (minPrice) query = query.gte('price', minPrice);
  if (maxPrice) query = query.lte('price', maxPrice);
  if (city) query = query.ilike('city', `%${city}%`);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const json = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const propertyData = {
    ...json,
    owner_id: user.id,
    status: 'pending' // Admin needs to approve
  };

  const { data, error } = await supabase
    .from('properties')
    .insert(propertyData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: Send notification to admin
  
  return NextResponse.json(data);
}
