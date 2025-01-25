'use client';

import { FC } from 'react';
import { ListingType } from '@/lib/types/property';
import { PropertyGridWrapper } from './property-grid-wrapper';
import { PropertyFiltersWrapper } from './property-filters-wrapper';
import { PropertyMapWrapper } from './property-map-wrapper';

interface PropertySectionProps {
  type: 'sale' | 'rent';
}

export const PropertySection: FC<PropertySectionProps> = ({ type }) => {
  return (
    <>
      {/* Map Section */}
      <div className="h-[400px] mb-8 rounded-lg overflow-hidden">
        <PropertyMapWrapper />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <PropertyFiltersWrapper />
        </div>

        {/* Property Grid */}
        <div className="lg:col-span-3">
          <PropertyGridWrapper type={type} />
        </div>
      </div>
    </>
  );
};
