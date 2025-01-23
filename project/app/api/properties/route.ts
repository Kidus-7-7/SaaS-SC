import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = createRouteHandlerClient({ cookies });

    // Build query based on search params
    let query = supabase
      .from('properties')
      .select('*')
      .eq('type', searchParams.get('type') || 'buy');

    // Add filters if they exist
    if (searchParams.get('minPrice')) {
      query = query.gte('price', searchParams.get('minPrice'));
    }
    if (searchParams.get('maxPrice')) {
      query = query.lte('price', searchParams.get('maxPrice'));
    }
    if (searchParams.get('bedrooms')) {
      const bedrooms = searchParams.get('bedrooms')?.split(',');
      if (bedrooms?.length) {
        query = query.in('bedrooms', bedrooms);
      }
    }
    if (searchParams.get('propertyType')) {
      const types = searchParams.get('propertyType')?.split(',');
      if (types?.length) {
        query = query.in('property_type', types);
      }
    }
    if (searchParams.get('location')) {
      query = query.ilike('location', `%${searchParams.get('location')}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Properties API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
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
