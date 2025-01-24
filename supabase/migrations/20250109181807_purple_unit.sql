/*
  # Sample Data Population

  Adds initial sample data for:
  - Users
  - Properties
  - Agents
*/

-- Sample Users
INSERT INTO users (id, email, full_name, phone, role) VALUES
('d0d8c19e-8b38-4d71-b2c3-61e4c5e32fde', 'john@example.com', 'John Doe', '+251911234567', 'user'),
('f5b8c19e-8b38-4d71-b2c3-61e4c5e32f12', 'agent1@example.com', 'Sara Mohammed', '+251922345678', 'agent'),
('a3c8c19e-8b38-4d71-b2c3-61e4c5e32f34', 'agent2@example.com', 'Abebe Kebede', '+251933456789', 'agent');

-- Sample Agents
INSERT INTO agents (user_id, agency, rating, experience, specialties, bio, availability) VALUES
('f5b8c19e-8b38-4d71-b2c3-61e4c5e32f12', 'Addis Real Estate Solutions', 4.9, 12, 
  ARRAY['Commercial', 'Investment'], 
  'Expert in commercial property investments and market analysis',
  'Mon-Fri, 8AM-5PM'),
('a3c8c19e-8b38-4d71-b2c3-61e4c5e32f34', 'Ethiopian Homes Real Estate', 4.8, 8,
  ARRAY['Residential', 'Luxury'],
  'Specialized in luxury residential properties in Addis Ababa',
  'Mon-Sat, 9AM-6PM');

-- Sample Properties
INSERT INTO properties (
  title, description, price, type, property_type, 
  bedrooms, bathrooms, area, location, features, 
  images, status, user_id, agent_id
) VALUES
(
  'Modern Apartment in Bole',
  'Luxurious apartment with great city views',
  5000000,
  'buy',
  'apartment',
  3,
  2,
  120,
  '{"address": "Bole Road", "city": "Addis Ababa", "coordinates": {"lat": 9.0222, "lng": 38.7468}}',
  ARRAY['Parking', 'Security', 'Elevator'],
  ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
  'approved',
  'f5b8c19e-8b38-4d71-b2c3-61e4c5e32f12',
  'f5b8c19e-8b38-4d71-b2c3-61e4c5e32f12'
),
(
  'Luxury Villa in CMC',
  'Spacious villa with modern amenities',
  12000000,
  'buy',
  'villa',
  5,
  4,
  350,
  '{"address": "CMC Area", "city": "Addis Ababa", "coordinates": {"lat": 9.0314, "lng": 38.7612}}',
  ARRAY['Garden', 'Pool', 'Security'],
  ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
  'approved',
  'a3c8c19e-8b38-4d71-b2c3-61e4c5e32f34',
  'a3c8c19e-8b38-4d71-b2c3-61e4c5e32f34'
),
(
  'Modern Rental in Kazanchis',
  'Well-maintained apartment for rent',
  25000,
  'rent',
  'apartment',
  2,
  1,
  80,
  '{"address": "Kazanchis", "city": "Addis Ababa", "coordinates": {"lat": 9.0167, "lng": 38.7667}}',
  ARRAY['Furnished', 'Security', 'Water Tank'],
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
  'approved',
  'f5b8c19e-8b38-4d71-b2c3-61e4c5e32f12',
  'f5b8c19e-8b38-4d71-b2c3-61e4c5e32f12'
);