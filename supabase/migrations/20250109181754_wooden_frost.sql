/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - full_name (text)
      - phone (text)
      - role (text)
      - created_at (timestamp)
      
    - properties
      - id (uuid, primary key) 
      - title (text)
      - description (text)
      - price (numeric)
      - type (text) - buy/rent
      - property_type (text)
      - bedrooms (int)
      - bathrooms (int)
      - area (numeric)
      - location (jsonb)
      - features (text[])
      - images (text[])
      - status (text)
      - user_id (uuid, foreign key)
      - agent_id (uuid, foreign key)
      - created_at (timestamp)

    - agents
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - agency (text)
      - rating (numeric)
      - experience (int)
      - specialties (text[])
      - bio (text)
      - availability (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  type text NOT NULL,
  property_type text NOT NULL,
  bedrooms int,
  bathrooms int,
  area numeric,
  location jsonb,
  features text[],
  images text[],
  status text DEFAULT 'pending',
  user_id uuid REFERENCES users(id),
  agent_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  agency text NOT NULL,
  rating numeric DEFAULT 0,
  experience int,
  specialties text[],
  bio text,
  availability text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Public can view approved properties"
  ON properties
  FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Users can create properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Agents are publicly viewable"
  ON agents
  FOR SELECT
  TO public
  USING (true);