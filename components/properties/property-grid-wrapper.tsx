'use client';

import { FC } from 'react';
import dynamic from 'next/dynamic';
import { ListingType } from '@/lib/types/property';

const PropertyGridComponent = dynamic(
  () => import('./property-grid').then(mod => mod.default || mod),
  { loading: () => <div>Loading...</div> }
);

interface PropertyGridWrapperProps {
  type: 'sale' | 'rent';
}

export const PropertyGridWrapper: FC<PropertyGridWrapperProps> = ({ type }) => {
  return <PropertyGridComponent type={type} />;
};
