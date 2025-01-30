'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { PriceChart } from '@/components/market-analysis/PriceChart';
import { MarketMetrics } from '@/components/market-analysis/MarketMetrics';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function MarketAnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleAnalyze = async () => {
    if (!location || !propertyType) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/market-analysis?location=${encodeURIComponent(
          location
        )}&propertyType=${encodeURIComponent(propertyType)}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch market analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Market Analysis</h1>
        <p className="text-muted-foreground">
          Analyze property market trends and get price predictions based on
          historical data.
        </p>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Property Type</label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleAnalyze}
              disabled={loading || !location || !propertyType}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analyze Market
            </Button>
          </div>
        </div>
      </Card>

      {data && (
        <div className="space-y-6">
          <MarketMetrics metrics={data.metrics} />
          <PriceChart
            historicalData={data.historicalPrices}
            predictions={data.predictions}
          />
        </div>
      )}
    </div>
  );
}
