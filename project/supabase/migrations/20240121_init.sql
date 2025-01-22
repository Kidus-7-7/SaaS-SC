-- Create enum types
CREATE TYPE property_type AS ENUM ('house', 'apartment', 'villa', 'commercial', 'land');
CREATE TYPE listing_type AS ENUM ('sale', 'rent');
CREATE TYPE property_status AS ENUM ('available', 'pending', 'sold', 'rented');

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    password_hash TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    license_number VARCHAR(50),
    experience_years INTEGER,
    rating DECIMAL(3,2),
    bio TEXT,
    specialization TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type property_type NOT NULL,
    listing_type listing_type NOT NULL,
    status property_status DEFAULT 'available',
    price DECIMAL(12,2) NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area_sqm DECIMAL(10,2),
    address TEXT,
    city VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    features TEXT[],
    images TEXT[],
    owner_id UUID REFERENCES users(id),
    agent_id UUID REFERENCES agents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (email, full_name, phone, is_admin) VALUES
('admin@example.com', 'Admin User', '+251911234567', true),
('agent1@example.com', 'John Doe', '+251922345678', false),
('agent2@example.com', 'Jane Smith', '+251933456789', false),
('user1@example.com', 'Bob Johnson', '+251944567890', false);

INSERT INTO agents (user_id, license_number, experience_years, rating, bio, specialization) 
SELECT 
    id,
    'LIC' || floor(random() * 10000)::text,
    floor(random() * 15 + 1)::integer,
    random() * 3 + 2,
    'Experienced real estate agent specializing in residential properties',
    ARRAY['Residential', 'Commercial']
FROM users 
WHERE email IN ('agent1@example.com', 'agent2@example.com');

-- Insert sample properties
INSERT INTO properties (
    title, description, property_type, listing_type, price, 
    bedrooms, bathrooms, area_sqm, address, city, 
    latitude, longitude, features, images, owner_id
)
SELECT
    'Modern ' || 
    CASE floor(random() * 3)::int 
        WHEN 0 THEN 'Villa' 
        WHEN 1 THEN 'Apartment' 
        ELSE 'House' 
    END || ' in ' || 
    CASE floor(random() * 3)::int 
        WHEN 0 THEN 'Bole' 
        WHEN 1 THEN 'CMC' 
        ELSE 'Sarbet' 
    END,
    'Beautiful property with modern amenities and great location',
    CASE floor(random() * 3)::int 
        WHEN 0 THEN 'villa'::property_type 
        WHEN 1 THEN 'apartment'::property_type 
        ELSE 'house'::property_type 
    END,
    CASE floor(random() * 2)::int 
        WHEN 0 THEN 'sale'::listing_type 
        ELSE 'rent'::listing_type 
    END,
    (random() * 9000000 + 1000000)::decimal(12,2),
    floor(random() * 4 + 1)::integer,
    floor(random() * 3 + 1)::integer,
    (random() * 200 + 50)::decimal(10,2),
    'Sample Address ' || i,
    CASE floor(random() * 3)::int 
        WHEN 0 THEN 'Addis Ababa' 
        WHEN 1 THEN 'Bahir Dar' 
        ELSE 'Hawassa' 
    END,
    9.0 + random(),
    38.7 + random(),
    ARRAY['Parking', 'Security', 'Garden'],
    ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    (SELECT id FROM users ORDER BY random() LIMIT 1)
FROM generate_series(1, 20) i;

-- Create indexes for better performance
CREATE INDEX idx_properties_listing_type ON properties(listing_type);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(city);
CREATE INDEX idx_agents_rating ON agents(rating);
