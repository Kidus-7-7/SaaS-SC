import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Redis from 'redis';
import regression from 'regression';

// Initialize Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Cache duration in seconds
const CACHE_DURATION = 3600; // 1 hour

export async function GET(req: NextRequest) {
  try {
    await redisClient.connect();

    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType');

    if (!location || !propertyType) {
      return NextResponse.json(
        { error: 'Location and property type are required' },
        { status: 400 }
      );
    }

    // Try to get cached data first
    const cacheKey = `market_analysis:${location}:${propertyType}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    // Fetch historical price data from Supabase
    const { data: historicalData, error } = await supabase
      .from('properties')
      .select('price, created_at')
      .eq('location', location)
      .eq('property_type', propertyType)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    if (!historicalData || historicalData.length === 0) {
      return NextResponse.json(
        { error: 'No historical data found for the specified criteria' },
        { status: 404 }
      );
    }

    // Prepare data for regression analysis
    const data = historicalData.map((item) => {
      const date = new Date(item.created_at);
      return [date.getTime(), item.price];
    });

    // Perform linear regression
    const result = regression.linear(data);
    const gradient = result.equation[0];
    const yIntercept = result.equation[1];
    const rSquared = result.r2;

    // Calculate current trend
    const trend = gradient > 0 ? 'Increasing' : gradient < 0 ? 'Decreasing' : 'Stable';

    // Calculate average price
    const averagePrice = historicalData.reduce((sum, item) => sum + item.price, 0) / historicalData.length;

    // Calculate price volatility (standard deviation)
    const variance = historicalData.reduce((sum, item) => {
      const diff = item.price - averagePrice;
      return sum + diff * diff;
    }, 0) / historicalData.length;
    const volatility = Math.sqrt(variance);

    // Prepare market analysis results
    const analysis = {
      trend,
      averagePrice,
      volatility,
      confidence: rSquared,
      priceRange: {
        min: Math.min(...historicalData.map(item => item.price)),
        max: Math.max(...historicalData.map(item => item.price)),
      },
      predictedTrend: {
        gradient,
        yIntercept,
        equation: result.string,
      },
      dataPoints: historicalData.length,
    };

    // Cache the results
    await redisClient.setEx(cacheKey, CACHE_DURATION, JSON.stringify(analysis));

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Market analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to perform market analysis' },
      { status: 500 }
    );
  } finally {
    await redisClient.disconnect();
  }
}
