'use client';

import { PropertyCard } from './property-card';
import { usePropertyFilters } from '@/lib/hooks/use-property-filters';
import { properties } from '@/lib/data/properties';

interface PropertyGridProps {
  type: 'rent' | 'buy';
}

export function PropertyGrid({ type }: PropertyGridProps) {
  const { filteredProperties } = usePropertyFilters(properties, type);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}