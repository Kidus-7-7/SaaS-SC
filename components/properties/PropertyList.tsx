'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bath, BedDouble, MapPin, Square } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';

// Sample data
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment in Bole',
    description: 'A beautiful modern apartment in the heart of Bole',
    price: 5000000,
    property_type: 'apartment',
    listing_type: 'sale',
    status: 'available',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 120,
    address: 'Bole Road',
    city: 'Addis Ababa',
    latitude: 9.0222,
    longitude: 38.7468,
    features: ['parking', 'security', 'elevator'],
    images: ['/placeholder.jpg'],
    owner_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

interface PropertyListProps {
  type: 'sale' | 'rent';
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
      // Filter by type (sale/rent)
      if (property.listing_type !== type) return false;

      // Filter by bedrooms
      if (filters.bedrooms !== 'any') {
        const minBedrooms = parseInt(filters.bedrooms);
        if (!Number.isNaN(minBedrooms) && property.bedrooms !== undefined) {
          if (filters.exactMatch) {
            if (property.bedrooms !== minBedrooms) return false;
          } else {
            if (property.bedrooms < minBedrooms) return false;
          }
        }
      }

      // Filter by bathrooms
      if (filters.bathrooms !== 'any') {
        const minBathrooms = parseFloat(filters.bathrooms);
        if (!Number.isNaN(minBathrooms) && property.bathrooms !== undefined) {
          if (filters.exactMatch) {
            if (property.bathrooms !== minBathrooms) return false;
          } else {
            if (property.bathrooms < minBathrooms) return false;
          }
        }
      }

      return true;
    });

    setProperties(filteredProperties);
  }, [type, filters]);

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No properties found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <Link key={property.id} href={`/property/${property.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <Image
                src={property.images[0] || '/placeholder.jpg'}
                alt={property.title}
                layout="fill"
                objectFit="cover"
              />
              <Badge className="absolute top-2 right-2">
                {property.status}
              </Badge>
            </div>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{property.address}, {property.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {property.bedrooms !== undefined && (
                    <div className="flex items-center gap-1">
                      <BedDouble className="h-4 w-4" />
                      <span>{property.bedrooms} beds</span>
                    </div>
                  )}
                  {property.bathrooms !== undefined && (
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms} baths</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    <span>{property.area_sqm} m²</span>
                  </div>
                </div>

                <div className="text-xl font-bold">
                  ETB {property.price.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
