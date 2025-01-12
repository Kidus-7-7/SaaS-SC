'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

export function PropertyMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Map implementation will go here
    // For now, showing a placeholder
  }, []);

  return (
    <Card className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div ref={mapRef} className="w-full h-full">
        <div className="h-full flex items-center justify-center text-gray-500">
          Map View Coming Soon
        </div>
      </div>
    </Card>
  );
}