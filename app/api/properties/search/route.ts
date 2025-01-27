import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SearchFilters } from '@/types/search';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const filters: SearchFilters = await req.json();

    let query = supabase
      .from('properties')
      .select(`
        *,
        owner:owner_id(*),
        agent:agent_id(*)
      `);

    // Apply filters
    if (filters.priceRange) {
      query = query
        .gte('price', filters.priceRange.min)
        .lte('price', filters.priceRange.max);
    }

    if (filters.propertyType?.length) {
      query = query.in('property_type', filters.propertyType);
    }

    if (filters.listingType?.length) {
      query = query.in('listing_type', filters.listingType);
    }

    if (filters.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms);
    }

    if (filters.bathrooms) {
      query = query.eq('bathrooms', filters.bathrooms);
    }

    if (filters.areaSqm) {
      query = query
        .gte('area_sqm', filters.areaSqm.min)
        .lte('area_sqm', filters.areaSqm.max);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    // Handle geographic search
    if (filters.coordinates) {
      const { latitude, longitude, radius } = filters.coordinates;
      // Using PostGIS for geographic search
      query = query.raw(`
        ST_DWithin(
          ST_MakePoint(longitude, latitude)::geography,
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ${radius * 1000}
        )
      `);
    }

    // Handle bounding box search
    if (filters.boundingBox) {
      const { north, south, east, west } = filters.boundingBox;
      query = query
        .gte('latitude', south)
        .lte('latitude', north)
        .gte('longitude', west)
        .lte('longitude', east);
    }

    const { data: properties, error, count } = await query
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      properties,
      total: count || 0,
      filters
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search properties' },
      { status: 500 }
    );
  }
}
