export interface Property {
  id: number;
  title: string;
  type: 'rent' | 'buy';
  price: number;
  location: {
    address: string;
    city: string;
    subCity: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: PropertyType;
  propertyStatus: PropertyStatus;
  listingType: ListingType;
  furnishing: FurnishingStatus;
  parkingSpots: number;
  hasBasement: boolean;
  hasTour: boolean;
  daysListed: number;
  images: string[];
  features: string[];
  description: string;
  agent: {
    id: number;
    name: string;
    status: AgentStatus;
  };
}

export type PropertyType = 
  | 'apartment'
  | 'villa'
  | 'condominium'
  | 'townhouse'
  | 'land'
  | 'studio'
  | 'block-of-flats'
  | 'bungalow'
  | 'duplex'
  | 'maisonette'
  | 'mansion'
  | 'penthouse';

export type PropertyStatus = 
  | 'newly-built'
  | 'old'
  | 'renovated'
  | 'under-construction'
  | 'accepting-backup-offers';

export type ListingType = 'by-agent' | 'by-owner';

export type FurnishingStatus = 'furnished' | 'semi-furnished' | 'unfurnished';

export type AgentStatus = 'active' | 'inactive' | 'deactivated';

export interface PropertyFilters {
  priceRange: [number, number];
  bedrooms: number[];
  bathrooms: number[];
  propertyTypes: PropertyType[];
  location: string;
  subCity: string;
  minArea: number | null;
  maxArea: number | null;
  listingType: ListingType | null;
  propertyStatus: PropertyStatus | null;
  hasTour: boolean | null;
  parkingSpots: number | null;
  hasBasement: boolean | null;
  furnishing: FurnishingStatus | null;
  maxDaysListed: number | null;
  keyword: string;
}

export const addisAbabaSubCities = [
  'Addis Ketema',
  'Akaky Kaliti',
  'Arada',
  'Bole',
  'Gullele',
  'Kirkos',
  'Kolfe Keranio',
  'Lideta',
  'Nifas Silk-Lafto',
  'Yeka'
] as const;

export const popularPropertyTypes = [
  'apartment',
  'villa',
  'condominium',
  'townhouse',
  'land'
] as const;

export const otherPropertyTypes = [
  'studio',
  'block-of-flats',
  'bungalow',
  'duplex',
  'maisonette',
  'mansion',
  'penthouse'
] as const;