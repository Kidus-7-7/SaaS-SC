import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const filters = await request.json()
    let query = supabase.from('properties').select('*')

    // Apply filters
    if (filters.price) {
      const { min, max } = filters.price
      if (min) query = query.gte('price', min)
      if (max) query = query.lte('price', max)
    }

    if (filters.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms)
    }

    if (filters.bathrooms) {
      query = query.eq('bathrooms', filters.bathrooms)
    }

    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType)
    }

    // Location-based search
    if (filters.coordinates) {
      const { latitude, longitude, radius } = filters.coordinates
      
      // Using a simpler bounding box approach instead of PostGIS
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)
      const radiusInDegrees = radius / 111.32 // approximate degrees for km at equator

      query = query
        .gte('latitude', lat - radiusInDegrees)
        .lte('latitude', lat + radiusInDegrees)
        .gte('longitude', lng - radiusInDegrees)
        .lte('longitude', lng + radiusInDegrees)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ 
      properties: data,
      count: data.length 
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
