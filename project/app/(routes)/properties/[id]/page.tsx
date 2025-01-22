'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/format';
import { Property } from '@/lib/types/property';
import { useParams } from 'next/navigation';

export default function PropertyDetailsPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${params.id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch property data: ${res.status}`);
        }
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!property) return notFound();

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="md:col-span-8">
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          <div className="relative h-[400px] rounded-lg overflow-hidden mb-6">
            <Image
              src={property.images[0] || '/placeholder-property.jpg'}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <Square className="h-5 w-5" />
              <span>{property.area} sqft</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{property.location.address}</span>
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600">{property.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-4">
                {formatCurrency(property.price)}
              </div>
              <div className="space-y-4">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                  Contact Agent
                </button>
                <button className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50">
                  Schedule Viewing
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
