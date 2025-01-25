'use client';

import { FC } from 'react';
import dynamic from 'next/dynamic';

const PropertyFiltersComponent = dynamic(
  () => import('./property-filters').then(mod => mod.default || mod),
  { loading: () => <div>Loading...</div> }
);

export const PropertyFiltersWrapper: FC = () => {
  return <PropertyFiltersComponent />;
};
