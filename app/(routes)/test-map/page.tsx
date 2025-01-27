'use client';

import { PropertyMap } from '@/components/map/property-map';
import { PropertyFilters } from '@/components/map/property-filters';
import { useState, useMemo } from 'react';
import Image from 'next/image';

// Sample properties data
const sampleProperties = [
  {
    id: '1',
    title: 'Modern Apartment in Bole',
    description: 'Beautiful 2-bedroom apartment with city view',
    price: 2500000,
    property_type: 'apartment',
    listing_type: 'sale',
    status: 'available',
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 120,
    address: 'Bole Road, Near Millennium Hall',
    city: 'Addis Ababa',
    latitude: 9.0127,
    longitude: 38.7615,
    features: ['parking', 'security', 'elevator'],
    images: ['/images/properties/apartment1.jpg'],
  },
  {
    id: '2',
    title: 'Villa in CMC',
    description: 'Spacious family villa with garden',
    price: 5000000,
    property_type: 'villa',
    listing_type: 'sale',
    status: 'available',
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 300,
    address: 'CMC Road, Behind St. Michael Church',
    city: 'Addis Ababa',
    latitude: 9.0234,
    longitude: 38.7912,
    features: ['parking', 'garden', 'security'],
    images: ['/images/properties/villa1.jpg'],
  },
  {
    id: '3',
    title: 'Commercial Space in Piassa',
    description: 'Prime location commercial property',
    price: 35000,
    property_type: 'commercial',
    listing_type: 'rent',
    status: 'available',
    bedrooms: null,
    bathrooms: 2,
    area_sqm: 150,
    address: 'Piassa, Near National Theater',
    city: 'Addis Ababa',
    latitude: 9.0346,
    longitude: 38.7468,
    features: ['parking', 'security', 'water_tank'],
    images: ['/images/properties/commercial1.jpg'],
  },
];

export default function TestMapPage() {
  const [filters, setFilters] = useState({
    propertyType: 'all',
    priceRange: { min: 0, max: 10000000 },
    bedrooms: 'all'
  });

  const filteredProperties = useMemo(() => {
    return sampleProperties.filter(property => {
      // Filter by property type
      if (filters.propertyType !== 'all' && property.property_type !== filters.propertyType) {
        return false;
      }

      // Filter by price range
      if (property.price < filters.priceRange.min || property.price > filters.priceRange.max) {
        return false;
      }

      // Filter by bedrooms
      if (filters.bedrooms !== 'all') {
        const minBedrooms = parseInt(filters.bedrooms);
        if (!property.bedrooms || property.bedrooms < minBedrooms) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Calculate map center based on filtered properties
  const mapCenter = useMemo(() => {
    if (filteredProperties.length === 0) {
      return [9.0222, 38.7468] as [number, number]; // Default to Addis Ababa
    }

    const sumLat = filteredProperties.reduce((sum, p) => sum + p.latitude, 0);
    const sumLng = filteredProperties.reduce((sum, p) => sum + p.longitude, 0);
    return [
      sumLat / filteredProperties.length,
      sumLng / filteredProperties.length
    ] as [number, number];
  }, [filteredProperties]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Property Map Test</h1>
      
      <PropertyFilters onFilterChange={setFilters} />
      
      <div className="rounded-lg overflow-hidden border">
        <PropertyMap 
          properties={filteredProperties}
          center={mapCenter}
          zoom={13}
        />
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
          <div key={property.id} className="border rounded-lg overflow-hidden">
            <div className="relative h-48 w-full">
              {property.images && property.images.length > 0 ? (
                <Image src={property.images[0]} alt={property.title} layout="fill" objectFit="cover" />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{property.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{property.address}</p>
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium">{property.bedrooms}</span> beds • 
                  <span className="font-medium"> {property.bathrooms}</span> baths • 
                  <span className="font-medium"> {property.area_sqm}</span> sqm
                </p>
                <p className="text-lg font-medium text-blue-600 mt-2">
                  ETB {property.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
