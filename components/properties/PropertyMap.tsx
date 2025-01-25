'use client';

import { useEffect, useRef } from 'react';
import { Property } from '@/lib/types/property';
import { loadGoogleMapsScript } from '@/lib/utils/loadGoogleMaps';

interface PropertyMapProps {
  center?: [number, number];
  zoom?: number;
  properties?: Property[];
}

export function PropertyMap({
  center = [9.0222, 38.7468], // Default to Addis Ababa coordinates
  zoom = 13,
  properties = [],
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    async function initMap() {
      try {
        await loadGoogleMapsScript();
        
        if (!mapRef.current) return;

        // Create map instance
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: center[0], lng: center[1] },
          zoom,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        mapInstanceRef.current = mapInstance;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add markers for properties
        properties.forEach(property => {
          if (property.location?.coordinates?.lat && property.location?.coordinates?.lng) {
            const marker = new google.maps.Marker({
              position: { 
                lat: property.location.coordinates.lat, 
                lng: property.location.coordinates.lng 
              },
              map: mapInstance,
              title: property.title,
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="p-2">
                  <h3 class="font-semibold">${property.title}</h3>
                  <p class="text-sm">${property.location.address}</p>
                  <p class="text-sm font-semibold mt-1">ETB ${property.price.toLocaleString()}</p>
                </div>
              `,
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstance, marker);
            });

            markersRef.current.push(marker);
          }
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }

    initMap();
  }, [center, zoom, properties]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[400px] rounded-lg shadow-md"
      style={{ minHeight: '400px' }}
    />
  );
}