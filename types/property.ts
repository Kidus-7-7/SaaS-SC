export type AgentStatus = 'active' | 'inactive' | 'busy' | 'available' | 'pending';
export type PropertyStatus = 'available' | 'pending' | 'sold' | 'rented';

export interface Agent {
  id: string | number;
  name: string;
  status: AgentStatus;
  license_number: string;
  experience_years: number;
  rating: number;
  bio: string;
  specialization: string[];
  email?: string;
  full_name?: string;
}

export interface Property {
  id: string | number;
  title: string;
  type: 'rent' | 'buy';
  propertyType: 'house' | 'apartment' | 'villa' | 'commercial' | 'land';
  listingType: 'sale' | 'rent';
  propertyStatus: PropertyStatus;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  location: {
    address: string;
    city: string;
    subCity: string;
    coordinates: { lat: number; lng: number };
  };
  images: string[];
  features: string[];
  description: string;
  ownerId: string;
  agentId?: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    full_name: string;
    email: string;
  };
  agent?: Agent;
  furnishing?: string;
  parkingSpots?: number;
  hasBasement?: boolean;
  hasTour?: boolean;
  daysListed?: number;
}
