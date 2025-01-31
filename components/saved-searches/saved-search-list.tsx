"use client";

import { useState, useEffect } from 'react';
import { SavedSearch } from '@/types/saved-features';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Bell, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function SavedSearchList() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedSearches();
  }, []);

  const fetchSavedSearches = async () => {
    try {
      const response = await fetch('/api/saved-searches');
      const data = await response.json();
      setSearches(data);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSearch = async (id: string) => {
    try {
      await fetch(`/api/saved-searches?id=${id}`, {
        method: 'DELETE',
      });
      setSearches(searches.filter(search => search.id !== id));
    } catch (error) {
      console.error('Error deleting saved search:', error);
    }
  };

  if (loading) {
    return <div>Loading saved searches...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Saved Searches</h2>
      {searches.length === 0 ? (
        <p>No saved searches yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {searches.map((search) => (
            <Card key={search.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{search.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(search.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {/* Handle edit */}}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSearch(search.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm">
                    Notifications: {search.notificationFrequency}
                  </span>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {search.filters.propertyType?.map((type) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                  {search.filters.priceRange && (
                    <Badge variant="secondary">
                      {search.filters.priceRange.min} - {search.filters.priceRange.max} ETB
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
