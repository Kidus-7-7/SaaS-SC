import { useState, useEffect } from 'react';
import { Map, Source, Layer } from 'react-map-gl';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchFilters } from '@/types/search';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/select';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 10000000 },
    propertyType: [],
    listingType: [],
    features: [],
    amenities: []
  });

  const [mapViewport, setMapViewport] = useState({
    latitude: 9.0320,  // Addis Ababa coordinates
    longitude: 38.7500,
    zoom: 11
  });

  const [drawMode, setDrawMode] = useState<'none' | 'draw'>('none');
  const debouncedFilters = useDebounce(filters, 500);

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle map drawing
  const handleDraw = (coordinates: number[][]) => {
    const bounds = coordinates.reduce(
      (acc, [lng, lat]) => ({
        north: Math.max(acc.north, lat),
        south: Math.min(acc.south, lat),
        east: Math.max(acc.east, lng),
        west: Math.min(acc.west, lng),
      }),
      { north: -90, south: 90, east: -180, west: 180 }
    );

    setFilters(prev => ({
      ...prev,
      boundingBox: bounds
    }));
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      {/* Filters Panel */}
      <div className="col-span-3 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Price Range</h3>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.priceRange.min}
              onChange={(e) => handleFilterChange('priceRange', {
                ...filters.priceRange,
                min: parseInt(e.target.value)
              })}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.priceRange.max}
              onChange={(e) => handleFilterChange('priceRange', {
                ...filters.priceRange,
                max: parseInt(e.target.value)
              })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Property Type</h3>
          <MultiSelect<Property['property_type']>
            label="Property Type"
            value={filters.propertyType}
            onChange={(value) => handleFilterChange('propertyType', value)}
            options={[
              { label: 'House', value: 'house' },
              { label: 'Apartment', value: 'apartment' },
              { label: 'Villa', value: 'villa' },
              { label: 'Commercial', value: 'commercial' },
              { label: 'Land', value: 'land' }
            ]}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Features</h3>
          <div className="space-y-2">
            {['Parking', 'Security', 'Garden', 'Pool'].map(feature => (
              <div key={feature} className="flex items-center">
                <Checkbox
                  id={feature}
                  checked={filters.features.includes(feature)}
                  onCheckedChange={(checked) => {
                    const newFeatures = checked
                      ? [...filters.features, feature]
                      : filters.features.filter(f => f !== feature);
                    handleFilterChange('features', newFeatures);
                  }}
                />
                <label htmlFor={feature} className="ml-2">{feature}</label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={() => setFilters({
            priceRange: { min: 0, max: 10000000 },
            propertyType: [],
            listingType: [],
            features: [],
            amenities: []
          })}
          variant="outline"
        >
          Reset Filters
        </Button>
      </div>

      {/* Map */}
      <div className="col-span-9 h-[600px]">
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          {...mapViewport}
          onMove={evt => setMapViewport(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {/* Add map layers and drawing tools here */}
        </Map>
      </div>
    </div>
  );
}
