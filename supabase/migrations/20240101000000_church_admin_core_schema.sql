-- Church Admin Platform Core Schema
-- Organizations (Churches)
CREATE TABLE IF NOT EXISTS church_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for slug lookups
CREATE INDEX idx_church_organizations_slug ON church_organizations(slug);

-- Users with church association
CREATE TABLE IF NOT EXISTS church_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES church_organizations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'treasurer', 'presenter', 'member')) DEFAULT 'member',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for organization lookups
CREATE INDEX idx_church_profiles_organization_id ON church_profiles(organization_id);

-- Enable Row Level Security
ALTER TABLE church_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for church_organizations
-- Users can only see organizations they belong to
CREATE POLICY "Users can view their own organization" 
  ON church_organizations 
  FOR SELECT 
  USING (
    id IN (
      SELECT organization_id 
      FROM church_profiles 
      WHERE id = auth.uid()
    )
  );

-- Only org admins can update their organization
CREATE POLICY "Admins can update their organization" 
  ON church_organizations 
  FOR UPDATE 
  USING (
    id IN (
      SELECT organization_id 
      FROM church_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for church_profiles
-- Users can view profiles in their organization
CREATE POLICY "Users can view profiles in their organization" 
  ON church_profiles 
  FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM church_profiles 
      WHERE id = auth.uid()
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
  ON church_profiles 
  FOR UPDATE 
  USING (id = auth.uid());

-- Only admins can insert new profiles (invite users)
CREATE POLICY "Admins can create profiles" 
  ON church_profiles 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM church_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
      AND organization_id = NEW.organization_id
    )
  );

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_church_organizations_updated_at
  BEFORE UPDATE ON church_organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_church_profiles_updated_at
  BEFORE UPDATE ON church_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO church_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert sample organization for testing
INSERT INTO church_organizations (name, slug, settings) 
VALUES (
  'CASA - Comunidad Anglicana San Andrés',
  'casa-anglican',
  '{"timezone": "America/Santiago", "currency": "CLP", "language": "es"}'
)
ON CONFLICT (slug) DO NOTHING;