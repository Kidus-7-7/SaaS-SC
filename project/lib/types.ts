export interface Agent {
  id: number;
  name: string;
  image: string;
  agency: string;
  rating: number;
  location: string;
  experience: number;
  availability: string;
  specialties: string[];
  bio?: string;
  email?: string;
  phone?: string;
}