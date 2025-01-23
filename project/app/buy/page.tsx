// app/buy/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/properties/property-card';
import { usePropertyFilters } from '@/lib/hooks/use-property-filters';
import { Property } from '@/lib/types/property';

interface PropertyGridProps {
  type: 'rent' | 'buy';
}

export function PropertyGrid({ type }: PropertyGridProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const { filters, filteredProperties } = usePropertyFilters(properties, type);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const params = new URLSearchParams({
          type,
          priceMin: filters.priceRange[0].toString(),
          priceMax: filters.priceRange[1].toString(),
          description: filters.keyword,
        });
        const response = await fetch(`http://localhost:3001/api/properties?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters, type]);

  return (
    <div className="lg:col-span-3">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading properties...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p>No properties found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

const BuyPage = () => {
  return (
    <div>
      <h1>Buy Properties</h1>
      <PropertyGrid type="buy" />
    </div>
  );
};

export { BuyPage };
export default BuyPage;
