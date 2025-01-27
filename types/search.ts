import { Property } from './property';

export interface SearchFilters {
  priceRange: {
    min: number;
    max: number;
  };
  propertyType: Property['property_type'][];
  listingType: Property['listing_type'][];
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: {
    min: number;
    max: number;
  };
  features: string[];
  yearBuilt?: {
    min: number;
    max: number;
  };
  amenities: string[];
  parking?: boolean;
  furnished?: boolean;
  city?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  boundingBox?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: SearchFilters;
  notificationFrequency: 'daily' | 'weekly' | 'never';
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
  filters: SearchFilters;
}
