import { useState } from 'react';
import { SearchFilters, SearchResult } from '@/types/search';
import { useDebounce } from './use-debounce';

export function usePropertySearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 10000000 },
    propertyType: [],
    listingType: [],
    features: [],
    amenities: []
  });

  const debouncedFilters = useDebounce(filters, 500);

  const search = async (searchFilters: SearchFilters = filters) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/properties/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchFilters),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 10000000 },
      propertyType: [],
      listingType: [],
      features: [],
      amenities: []
    });
  };

  return {
    filters,
    results,
    isLoading,
    error,
    search,
    updateFilters,
    resetFilters
  };
}
