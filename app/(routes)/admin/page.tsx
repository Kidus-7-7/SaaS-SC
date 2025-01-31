'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Property } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    full_name: string;
  };
}

interface PropertyWithOwner extends Property {
  owner: {
    email: string;
    full_name: string;
  };
}

export default function AdminPage() {
  const [pendingProperties, setPendingProperties] = useState<PropertyWithOwner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pending properties
        const { data: properties, error: propertiesError } = await supabase
          .from('properties')
          .select(`
            *,
            owner:owner_id(email, full_name)
          `)
          .eq('status', 'pending');

        if (propertiesError) throw propertiesError;

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*');

        if (usersError) throw usersError;

        setPendingProperties(properties || []);
        setUsers(usersData || []);
      } catch (error: any) {
        toast.toast({
          title: 'Error',
          description: error.message || 'Failed to fetch data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, toast]);

  const handlePropertyAction = async (propertyId: string, action: 'approve' | 'reject') => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          status: action === 'approve' ? 'available' : 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', propertyId);

      if (error) throw error;

      setPendingProperties(prev => 
        prev.filter(property => property.id !== propertyId)
      );

      toast.toast({
        title: 'Success',
        description: `Property ${action}d successfully`,
      });
    } catch (error: any) {
      toast.toast({
        title: 'Error',
        description: error.message || `Failed to ${action} property`,
        variant: 'destructive',
      });
    }
  };

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
    <div className="container mx-auto py-8 space-y-8">
      {/* Dashboard Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingProperties.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">ETB 0</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingProperties.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.title}</TableCell>
                    <TableCell>
                      {property.owner.full_name}
                      <br />
                      <span className="text-sm text-muted-foreground">
                        {property.owner.email}
                      </span>
                    </TableCell>
                    <TableCell>ETB {property.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge>
                        {property.property_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handlePropertyAction(property.id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handlePropertyAction(property.id, 'reject')}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">
              No pending properties to review
            </p>
          )}
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.slice(0, 5).map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.user_metadata.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
