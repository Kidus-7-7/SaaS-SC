'use client';

import { FC } from 'react';
import { PropertyList } from './PropertyList';
import { usePropertyFilters } from '@/lib/hooks/use-property-filters';

interface PropertyGridProps {
  type: 'sale' | 'rent';
}

const PropertyGrid: FC<PropertyGridProps> = ({ type }) => {
  const { filters } = usePropertyFilters([], type);

  // Convert number[] to string for PropertyList
  const adaptedFilters = {
    bedrooms: filters.bedrooms.length > 0 ? String(filters.bedrooms[0]) : 'any',
    bathrooms: filters.bathrooms.length > 0 ? String(filters.bathrooms[0]) : 'any',
    exactMatch: filters.exactMatch ?? false
  };

  return (
    <div>
      <PropertyList type={type} filters={adaptedFilters} />
    </div>
  );
};

export default PropertyGrid;