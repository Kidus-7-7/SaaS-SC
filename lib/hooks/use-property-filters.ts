'use client';

import { useState } from 'react';
import { Property, PropertyFilters } from '@/lib/types/property';

const initialFilters: PropertyFilters = {
  priceRange: [0, 1000000],
  bedrooms: [],
  bathrooms: [],
  propertyTypes: [],
  location: '',
  subCity: '',
  minArea: null,
  maxArea: null,
  listingType: null,
  propertyStatus: null,
  hasTour: null,
  parkingSpots: null,
  hasBasement: null,
  furnishing: null,
  maxDaysListed: null,
  keyword: '',
  exactMatch: false
};

export function usePropertyFilters(properties: Property[], type: 'rent' | 'sale') {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);

  const filteredProperties = properties.filter((property) => {
    if (property.listingType !== type) return false;
        const matchesPrice = (!filters.priceRange[0] || property.price >= filters.priceRange[0]) && 
                        (!filters.priceRange[1] || property.price <= filters.priceRange[1]);
    
    const matchesBedrooms = filters.bedrooms.length === 0 || 
                           (property.bedrooms && filters.bedrooms.includes(property.bedrooms));
    
    const matchesBathrooms = filters.bathrooms.length === 0 ||
                            (property.bathrooms && filters.bathrooms.includes(property.bathrooms));
    
    const matchesLocation = !filters.location || 
                           property.location.city.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesSubCity = !filters.subCity ||
                          property.location.subCity.toLowerCase().includes(filters.subCity.toLowerCase());
    
    const matchesArea = (!filters.minArea || property.area >= filters.minArea) &&
                       (!filters.maxArea || property.area <= filters.maxArea);

    return matchesPrice && matchesBedrooms && matchesBathrooms && 
           matchesLocation && matchesSubCity && matchesArea;
  });

  return { filters, setFilters, filteredProperties };
}