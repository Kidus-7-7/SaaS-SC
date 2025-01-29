'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart2, Percent } from 'lucide-react';

interface MarketMetricsProps {
  metrics: {
    averagePrice: number;
    priceChange: number;
    volatility: number;
    confidence: number;
  };
}

export function MarketMetrics({ metrics }: MarketMetricsProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  const formatPercent = (value: number) => `${value}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-4 w-4 text-blue-500" />
          <h4 className="text-sm font-medium text-muted-foreground">
            Average Price
          </h4>
        </div>
        <p className="text-2xl font-bold mt-2">
          {formatCurrency(metrics.averagePrice)}
        </p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          {metrics.priceChange >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <h4 className="text-sm font-medium text-muted-foreground">
            Price Change
          </h4>
        </div>
        <p
          className={`text-2xl font-bold mt-2 ${
            metrics.priceChange >= 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {formatPercent(metrics.priceChange)}
        </p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-4 w-4 text-orange-500" />
          <h4 className="text-sm font-medium text-muted-foreground">
            Market Volatility
          </h4>
        </div>
        <p className="text-2xl font-bold mt-2">
          {formatPercent(metrics.volatility)}
        </p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Percent className="h-4 w-4 text-purple-500" />
          <h4 className="text-sm font-medium text-muted-foreground">
            Confidence Score
          </h4>
        </div>
        <p className="text-2xl font-bold mt-2">
          {formatPercent(metrics.confidence * 100)}
        </p>
      </Card>
    </div>
  );
}
