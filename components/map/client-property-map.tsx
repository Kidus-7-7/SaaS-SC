'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { Property } from '@/types/property';
import { useEffect } from 'react';

// Custom marker using SVG
const createCustomMarker = (price: number) => {
  return divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: #2563eb;
        color: white;
        padding: 6px 10px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">
        ETB ${price.toLocaleString()}
      </div>
    `,
  });
};

// Component to update map view when props change
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

interface PropertyMapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
}

export function ClientPropertyMap({ 
  properties, 
  center = [9.0222, 38.7468], // Default center (Addis Ababa)
  zoom = 13 
}: PropertyMapProps) {
  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        key={`${center[0]}-${center[1]}-${zoom}`}
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        className="z-0"
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={createCustomMarker(property.price)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-lg">{property.title}</h3>
                <p className="text-sm text-gray-600">{property.address}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{property.bedrooms}</span> beds • 
                    <span className="font-medium"> {property.bathrooms}</span> baths • 
                    <span className="font-medium"> {property.area_sqm}</span> sqm
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    ETB {property.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
