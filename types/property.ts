export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  property_type: 'house' | 'apartment' | 'villa' | 'commercial' | 'land';
  listing_type: 'sale' | 'rent';
  status: 'available' | 'pending' | 'sold' | 'rented';
  bedrooms?: number;
  bathrooms?: number;
  area_sqm: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  features: string[];
  images: string[];
  owner_id: string;
  agent_id?: string;
  created_at: string;
  updated_at: string;
  owner?: {
    full_name: string;
    email: string;
  };
  agent?: {
    id: string;
    license_number: string;
    experience_years: number;
    rating: number;
    bio: string;
    specialization: string[];
    user: {
      full_name: string;
      email: string;
    };
  };
}
