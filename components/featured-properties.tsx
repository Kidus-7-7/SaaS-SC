'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const properties = [
  {
    id: 1,
    title: 'Modern Apartment in Bole',
    price: '5,000,000 ETB',
    location: 'Bole, Addis Ababa',
    type: 'Apartment',
    beds: 3,
    baths: 2,
    size: '120 sqm',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Luxury Villa in CMC',
    price: '12,000,000 ETB',
    location: 'CMC, Addis Ababa',
    type: 'Villa',
    beds: 5,
    baths: 4,
    size: '350 sqm',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Commercial Space in Kazanchis',
    price: '8,000,000 ETB',
    location: 'Kazanchis, Addis Ababa',
    type: 'Commercial',
    size: '200 sqm',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
];

export function FeaturedProperties() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          <div className="relative h-48">
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover"
            />
            <Badge className="absolute top-2 right-2">
              {property.type}
            </Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
            <p className="text-primary font-bold mb-2">{property.price}</p>
            <p className="text-gray-600 mb-2">{property.location}</p>
            <div className="flex gap-4 text-sm text-gray-500">
              {property.beds && <span>{property.beds} beds</span>}
              {property.baths && <span>{property.baths} baths</span>}
              <span>{property.size}</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link
              href={`/properties/${property.id}`}
              className="text-primary hover:underline"
            >
              View Details
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}