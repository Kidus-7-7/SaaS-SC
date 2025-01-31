import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false }
  }
)

// Helper function to calculate statistics
function calculateMarketStats(historicalData: any[]) {
  // Calculate average price
  const prices = historicalData.map(item => item.price);
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  // Calculate price volatility (standard deviation)
  const variance = prices.reduce((sum, price) => {
    const diff = price - averagePrice;
    return sum + diff * diff;
  }, 0) / prices.length;
  const volatility = Math.sqrt(variance);

  // Calculate price range
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };

  // Calculate price trend
  const trend = prices[prices.length - 1] > prices[0] ? 'Increasing' : 'Decreasing';

  return {
    trend,
    averagePrice,
    volatility,
    priceRange,
    dataPoints: prices.length,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('property_type');

    let query = supabase
      .from('market_data')
      .select('*')
      .limit(100);

    if (location) {
      query = query.eq('location', location);
    }

    if (propertyType) {
      query = query.eq('property_type', propertyType);
    }

    const { data: marketData, error } = await query;

    if (error) throw error;

    if (!marketData || marketData.length === 0) {
      return NextResponse.json(
        { error: 'No market data found for the specified criteria' },
        { status: 404 }
      );
    }

    const analysis = calculateMarketStats(marketData);

    return NextResponse.json({ data: analysis });
  } catch (error) {
    console.error('Market analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('market_data')
      .insert([body]);

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Market analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
