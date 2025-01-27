import dynamic from 'next/dynamic';
import { Property } from '@/types/property';

const ClientPropertyMap = dynamic(
  () => import('./client-property-map').then((mod) => mod.ClientPropertyMap),
  { ssr: false }
);

interface PropertyMapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
}

export function PropertyMap(props: PropertyMapProps) {
  return <ClientPropertyMap {...props} />;
}
