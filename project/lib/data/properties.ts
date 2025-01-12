import { Property } from '../types/property';

export const properties: Property[] = [
  {
    id: 1,
    title: 'Modern Apartment in Bole',
    type: 'rent',
    price: 25000,
    location: {
      address: 'Bole Road',
      city: 'Addis Ababa',
      coordinates: { lat: 9.0222, lng: 38.7468 }
    },
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Parking', 'Security', 'Elevator'],
    description: 'Modern apartment with great city views',
    agent: { id: 1, name: 'Abebe Kebede' }
  },
  {
    id: 2,
    title: 'Luxury Villa in CMC',
    type: 'buy',
    price: 12000000,
    location: {
      address: 'CMC Area',
      city: 'Addis Ababa',
      coordinates: { lat: 9.0314, lng: 38.7612 }
    },
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Garden', 'Pool', 'Security'],
    description: 'Spacious villa with modern amenities',
    agent: { id: 2, name: 'Sara Mohammed' }
  }
];