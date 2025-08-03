-- Add master admin and property ownership features

-- Add role and ownership columns to users table
ALTER TABLE users 
ADD COLUMN role TEXT DEFAULT 'realtor' CHECK (role IN ('master_admin', 'realtor')),
ADD COLUMN company_name TEXT,
ADD COLUMN phone TEXT;

-- Add property ownership states
ALTER TABLE properties 
ADD COLUMN status TEXT DEFAULT 'unclaimed' CHECK (status IN ('unclaimed', 'claimed', 'active')),
ADD COLUMN created_by_master_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN claimed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN master_admin_id UUID REFERENCES users(id);

-- Create master admin user
INSERT INTO users (email, role, verified_at, is_subscribed, company_name) 
VALUES ('admin@scanforaprize.com', 'master_admin', NOW(), TRUE, 'Scan for a Prize')
ON CONFLICT (email) DO UPDATE SET 
  role = 'master_admin',
  is_subscribed = TRUE,
  company_name = 'Scan for a Prize';

-- Create property claims table for tracking claim attempts
CREATE TABLE property_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    realtor_email TEXT NOT NULL,
    realtor_name TEXT,
    realtor_phone TEXT,
    verification_code_entered TEXT NOT NULL,
    claim_status TEXT DEFAULT 'pending' CHECK (claim_status IN ('pending', 'approved', 'rejected')),
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Create indexes
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_created_by_master ON properties(created_by_master_admin);
CREATE INDEX idx_property_claims_property_id ON property_claims(property_id);
CREATE INDEX idx_property_claims_email ON property_claims(realtor_email);

-- Update RLS policies

-- Properties: Master admin can manage all, realtors can only see their claimed properties
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON properties;
DROP POLICY IF EXISTS "Properties can be inserted by service role" ON properties;
DROP POLICY IF EXISTS "Properties can be updated by service role" ON properties;

-- New property policies
CREATE POLICY "Properties are viewable by everyone for QR scanning" ON properties 
  FOR SELECT USING (true);

CREATE POLICY "Master admin can manage all properties" ON properties 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'master_admin')
  );

CREATE POLICY "Realtors can view their claimed properties" ON properties 
  FOR SELECT USING (
    claimed_by_user_id = auth.uid() 
    OR status = 'unclaimed'
  );

CREATE POLICY "Realtors can update their claimed properties" ON properties 
  FOR UPDATE USING (claimed_by_user_id = auth.uid());

-- Property claims policies
ALTER TABLE property_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit property claims" ON property_claims 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own claims" ON property_claims 
  FOR SELECT USING (
    realtor_email = (SELECT email FROM users WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'master_admin')
  );

CREATE POLICY "Master admin can manage all claims" ON property_claims 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'master_admin')
  );

-- Update existing properties to be created by master admin
UPDATE properties 
SET created_by_master_admin = TRUE,
    master_admin_id = (SELECT id FROM users WHERE email = 'admin@scanforaprize.com' LIMIT 1),
    status = CASE 
      WHEN claimed_by_user_id IS NOT NULL THEN 'claimed'
      ELSE 'unclaimed'
    END;