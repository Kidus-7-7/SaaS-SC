import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={property.images[0] || '/placeholder-property.jpg'}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{property.title}</h3>
        <p className="text-xl font-bold text-primary">
          ETB {property.price.toLocaleString()}
          {property.listing_type === 'rent' && '/month'}
        </p>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          {property.bedrooms && <span>{property.bedrooms} beds</span>}
          {property.bathrooms && <span>{property.bathrooms} baths</span>}
          <span>{property.area_sqm} sqm</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {property.description}
        </p>
      </CardContent>
      <CardFooter className="p-4">
        <Link href={`/properties/${property.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
