import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/lib/types/property';
import { formatCurrency } from '@/lib/utils/format';
import { Bed, Bath, Square, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-2 right-2">
          {property.type === 'rent' ? 'For Rent' : 'For Sale'}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
        <p className="text-primary font-bold mb-2">
          {formatCurrency(property.price)}
          {property.type === 'rent' && '/month'}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location.address}, {property.location.city}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms} beds
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms} baths
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Square className="h-4 w-4 mr-1" />
            {property.area} m²
          </div>
        </div>

        <Link
          href={`/properties/${property.id}`}
          className="text-primary hover:underline text-sm"
        >
          View Details
        </Link>
      </CardContent>
    </Card>
  );
}