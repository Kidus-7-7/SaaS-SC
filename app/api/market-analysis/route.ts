import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Redis from 'redis';
import * as tf from '@tensorflow/tfjs';
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

    if (error) throw error;

    // Prepare data for regression analysis
    const regressionData = historicalData.map((d, i) => [
      i,
      d.price,
    ]);

    // Perform linear regression
    const result = regression.linear(regressionData);
    const gradient = result.equation[0];
    const yIntercept = result.equation[1];

    // Generate predictions for the next 6 months
    const predictions = Array.from({ length: 6 }, (_, i) => {
      const x = regressionData.length + i;
      const predictedPrice = gradient * x + yIntercept;
      const date = new Date();
      date.setMonth(date.getMonth() + i + 1);
      return {
        date: date.toISOString(),
        price: Math.round(predictedPrice),
      };
    });

    // Calculate market metrics
    const prices = historicalData.map(d => d.price);
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const priceChange = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;
    
    // Calculate volatility (standard deviation)
    const variance = prices.reduce((sum, price) => {
      return sum + Math.pow(price - averagePrice, 2);
    }, 0) / prices.length;
    const volatility = Math.sqrt(variance);

    const analysisResults = {
      historicalPrices: historicalData,
      predictions,
      metrics: {
        averagePrice: Math.round(averagePrice),
        priceChange: Math.round(priceChange * 100) / 100,
        volatility: Math.round((volatility / averagePrice) * 100) / 100,
        confidence: Math.round(result.r2 * 100) / 100, // R-squared value as confidence
      },
    };

    // Cache the results
    await redisClient.setEx(
      cacheKey,
      CACHE_DURATION,
      JSON.stringify(analysisResults)
    );

    return NextResponse.json(analysisResults);
  } catch (error) {
    console.error('Market Analysis Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze market data' },
      { status: 500 }
    );
  } finally {
    await redisClient.disconnect();
  }
}
