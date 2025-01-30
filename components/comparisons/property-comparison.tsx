"use client";

import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import { PropertyComparison as PropertyComparisonType } from '@/types/saved-features';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ComparisonFeature {
  name: string;
  key: keyof Property | string;
  format?: (value: any) => string;
}

const COMPARISON_FEATURES: ComparisonFeature[] = [
  { name: 'Price', key: 'price', format: (price) => `${price.toLocaleString()} ETB` },
  { name: 'Type', key: 'property_type' },
  { name: 'Status', key: 'status' },
  { name: 'Bedrooms', key: 'bedrooms' },
  { name: 'Bathrooms', key: 'bathrooms' },
  { name: 'Area', key: 'area_sqm', format: (area) => `${area} m²` },
  { name: 'Location', key: 'city' },
];

export function PropertyComparison() {
  const [comparisons, setComparisons] = useState<PropertyComparisonType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisons();
  }, []);

  const fetchComparisons = async () => {
    try {
      const response = await fetch('/api/comparisons');
      const data = await response.json();
      setComparisons(data);
    } catch (error) {
      console.error('Error fetching comparisons:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComparison = async (id: string) => {
    try {
      await fetch(`/api/comparisons?id=${id}`, {
        method: 'DELETE',
      });
      setComparisons(comparisons.filter(comp => comp.id !== id));
    } catch (error) {
      console.error('Error deleting comparison:', error);
    }
  };

  if (loading) {
    return <div>Loading comparisons...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Property Comparisons</h2>
      {comparisons.length === 0 ? (
        <p>No property comparisons yet.</p>
      ) : (
        comparisons.map((comparison) => (
          <Card key={comparison.id} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Comparison {comparison.id.slice(0, 8)}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteComparison(comparison.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    {comparison.properties?.map((property) => (
                      <TableHead key={property.id}>
                        {property.title}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPARISON_FEATURES.map((feature) => (
                    <TableRow key={feature.key}>
                      <TableCell className="font-medium">
                        {feature.name}
                      </TableCell>
                      {comparison.properties?.map((property) => (
                        <TableCell key={property.id}>
                          {feature.format
                            ? feature.format(property[feature.key as keyof Property])
                            : property[feature.key as keyof Property]?.toString()}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {comparison.notes && (
              <div className="mt-4">
                <h4 className="font-semibold">Notes</h4>
                <p className="text-gray-600">{comparison.notes}</p>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
