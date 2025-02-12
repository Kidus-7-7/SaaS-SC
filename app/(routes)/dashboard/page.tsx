'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Property } from '@/types/property';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  current_period_end: string;
}

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user's properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select(`
            *,
            agent:agents(*)
          `)
          .eq('owner_id', (await supabase.auth.getUser()).data.user?.id);

        if (propertiesError) throw propertiesError;

        const properties = propertiesData?.map((property: Property) => ({
          ...property,
          propertyStatus: property.propertyStatus,
        }));

        // Get user's subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (subscriptionError && subscriptionError.code !== 'PGRST116') {
          throw subscriptionError;
        }

        setProperties(properties);
        setSubscription(subscriptionData);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Subscription Status */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-2xl font-bold mb-4">Subscription</h2>
        {subscription ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">{subscription.plan_name}</p>
              <p className="text-sm text-muted-foreground">
                Valid until: {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
              {subscription.status}
            </Badge>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">No active subscription</p>
            <Button onClick={() => window.location.href = '/pricing'}>
              View Plans
            </Button>
          </div>
        )}
      </div>

      {/* Properties */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Properties</h2>
          <Button onClick={() => window.location.href = '/sell'}>
            Add Property
          </Button>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="relative">
                <Badge
                  className="absolute top-4 right-4 z-10"
                  variant={
                    property.propertyStatus === 'available'
                      ? 'default'
                      : property.propertyStatus === 'pending'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {property.propertyStatus}
                </Badge>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground mb-4">
              You haven&apos;t listed any properties yet
            </p>
            <Button onClick={() => window.location.href = '/sell'}>
              List Your First Property
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
