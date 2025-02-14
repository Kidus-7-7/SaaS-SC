'use client';

import { PropertyMap } from '@/components/map/property-map';
import { PropertyFilters } from '@/components/map/property-filters';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Property } from '@/types/property';

// Sample properties data
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment in Bole',
    description: 'A beautiful modern apartment with city views',
    price: 2500000,
    propertyType: 'apartment',
    listingType: 'sale',
    propertyStatus: 'available',
    status: 'available',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    size: 120,
    location: {
      address: 'Bole Road',
      city: 'Addis Ababa',
      subCity: 'Bole',
      coordinates: {
        lat: 9.0222,
        lng: 38.7468,
      },
    },
    features: ['parking', 'security', 'elevator'],
    images: ['/images/sample/apartment1.jpg'],
    ownerId: 'sample-owner-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'buy',
  },
  {
    id: '2',
    title: 'Luxury Villa in CMC',
    description: 'Spacious villa with garden',
    price: 5000000,
    propertyType: 'villa',
    listingType: 'sale',
    propertyStatus: 'available',
    status: 'available',
    bedrooms: 4,
    bathrooms: 3,
    area: 300,
    size: 300,
    location: {
      address: 'CMC Road',
      city: 'Addis Ababa',
      subCity: 'CMC',
      coordinates: {
        lat: 9.0322,
        lng: 38.7568,
      },
    },
    features: ['garden', 'parking', 'security'],
    images: ['/images/sample/villa1.jpg'],
    ownerId: 'sample-owner-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'buy',
  },
  {
    id: '3',
    title: 'Commercial Space in Kazanchis',
    description: 'Prime location commercial space',
    price: 50000,
    propertyType: 'commercial',
    listingType: 'rent',
    propertyStatus: 'available',
    status: 'available',
    bedrooms: undefined,
    bathrooms: 2,
    area: 200,
    size: 200,
    location: {
      address: 'Kazanchis',
      city: 'Addis Ababa',
      subCity: 'Kazanchis',
      coordinates: {
        lat: 9.0422,
        lng: 38.7668,
      },
    },
    features: ['parking', 'security', 'elevator'],
    images: ['/images/sample/commercial1.jpg'],
    ownerId: 'sample-owner-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'rent',
  },
];

type PropertyType = "commercial" | "all" | "apartment" | "villa" | "house" | "land";

interface Filters {
  propertyType: PropertyType;
  priceRange: { min: number; max: number; };
  bedrooms: string;
}

export default function TestMapPage() {
  const [filters, setFilters] = useState<Filters>({
    propertyType: "all",
    priceRange: { min: 0, max: 10000000 },
    bedrooms: "all"
  });

  const filteredProperties = useMemo(() => {
    return sampleProperties.filter(property => {
      // Filter by property type
      if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) {
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

    const sumLat = filteredProperties.reduce((sum, p) => sum + p.location.coordinates.lat, 0);
    const sumLng = filteredProperties.reduce((sum, p) => sum + p.location.coordinates.lng, 0);
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
              <p className="text-sm text-gray-600 mt-1">{property.location.address}</p>
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium">{property.bedrooms}</span> beds • 
                  <span className="font-medium"> {property.bathrooms}</span> baths • 
                  <span className="font-medium"> {property.area}</span> sqm
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
