'use client';

import { FC } from 'react';
import dynamic from 'next/dynamic';

const PropertyMapComponent = dynamic(
  () => import('./property-map').then(mod => mod.default || mod),
  { loading: () => <div>Loading map...</div> }
);

export const PropertyMapWrapper: FC = () => {
  return <PropertyMapComponent />;
};
