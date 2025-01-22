'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bath, BedDouble, MapPin, Square } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';

// Sample data
const sampleProperties = [
  {
    id: 1,
    title: 'Modern Apartment in Bole',
    price: 5000000,
    location: {
      address: 'Bole, Addis Ababa',
      coordinates: { lat: 9.0222, lng: 38.7468 }
    },
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: ['/sample/property1.jpg'],
    propertyType: 'apartment',
    listingType: 'sale',
    features: ['Parking', 'Security', 'Elevator']
  },
  {
    id: 2,
    title: 'Luxury Villa in CMC',
    price: 12000000,
    location: {
      address: 'CMC, Addis Ababa',
      coordinates: { lat: 9.0322, lng: 38.7568 }
    },
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    images: ['/sample/property2.jpg'],
    propertyType: 'villa',
    listingType: 'sale',
    features: ['Swimming Pool', 'Garden', 'Security']
  },
  {
    id: 3,
    title: 'Commercial Space in Kazanchis',
    price: 8000000,
    location: {
      address: 'Kazanchis, Addis Ababa',
      coordinates: { lat: 9.0422, lng: 38.7668 }
    },
    area: 200,
    images: ['/sample/property3.jpg'],
    propertyType: 'commercial',
    listingType: 'sale',
    features: ['Open Space', 'Parking', 'Security']
  },
  // Add more sample properties as needed
];

interface PropertyListProps {
  type: 'buy' | 'rent';
  filters: {
    bedrooms: string;
    bathrooms: string;
    exactMatch: boolean;
  };
}

export function PropertyList({ type, filters }: PropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    // In a real app, you would fetch properties from your API with the filters
    // For now, we'll filter the sample data
    const filteredProperties = sampleProperties.filter(property => {
      // Filter by type (buy/rent)
      if (property.listingType !== type) return false;

      // Filter by bedrooms
      if (filters.bedrooms !== 'any') {
        const minBedrooms = parseInt(filters.bedrooms);
        if (filters.exactMatch) {
          if (property.bedrooms !== minBedrooms) return false;
        } else {
          if (property.bedrooms < minBedrooms) return false;
        }
      }

      // Filter by bathrooms
      if (filters.bathrooms !== 'any') {
        const minBathrooms = parseFloat(filters.bathrooms);
        if (filters.exactMatch) {
          if (property.bathrooms !== minBathrooms) return false;
        } else {
          if (property.bathrooms < minBathrooms) return false;
        }
      }

      return true;
    });

    setProperties(filteredProperties);
  }, [type, filters]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          {properties.length} Properties {type === 'buy' ? 'for Sale' : 'for Rent'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Link key={property.id} href={`/properties/${property.id}`}>
            <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                {property.images?.[0] && (
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                )}
                <Badge className="absolute top-2 right-2 bg-white/90 text-black">
                  {property.propertyType}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                <p className="text-xl font-bold text-blue-600 mb-3">
                  ETB {property.price.toLocaleString()}
                </p>
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1">
                      <BedDouble className="h-4 w-4" />
                      <span>{property.bedrooms} beds</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms} baths</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    <span>{property.area} sqm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
