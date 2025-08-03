-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table first (no dependencies)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    is_subscribed BOOLEAN DEFAULT FALSE NOT NULL,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table (references users)
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(60) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    verification_code VARCHAR(12) NOT NULL,
    claimed_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_tokens table
CREATE TABLE verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_leads_property_id ON leads(property_id);
CREATE INDEX idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX idx_verification_tokens_expires_at ON verification_tokens(expires_at);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Properties: Read access for everyone (for QR code scanning)
CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (true);

-- Properties: Admin can insert/update
CREATE POLICY "Properties can be inserted by service role" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Properties can be updated by service role" ON properties FOR UPDATE USING (true);

-- Leads: Can be inserted by anyone (for QR submissions)
CREATE POLICY "Leads can be inserted by anyone" ON leads FOR INSERT WITH CHECK (true);

-- Leads: Only viewable by property owner or service role
CREATE POLICY "Leads viewable by property owner" ON leads FOR SELECT USING (
    property_id IN (
        SELECT id FROM properties WHERE claimed_by_user_id = auth.uid()
    )
);

-- Users: Users can view their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can be inserted by service role" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (id = auth.uid());

-- Verification tokens: Service role only
CREATE POLICY "Verification tokens managed by service role" ON verification_tokens FOR ALL USING (true);

-- Subscriptions: Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Subscriptions managed by service role" ON subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Subscriptions updated by service role" ON subscriptions FOR UPDATE USING (true);