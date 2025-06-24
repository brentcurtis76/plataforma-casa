-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types for church admin
DO $$ BEGIN
    CREATE TYPE church_user_role AS ENUM ('admin', 'treasurer', 'presenter', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE church_transaction_type AS ENUM ('income', 'expense', 'transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE church_account_type AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Church Organizations
CREATE TABLE IF NOT EXISTS church_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{"timezone": "America/Santiago", "currency": "CLP", "language": "es"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Church User profiles linked to auth.users
CREATE TABLE IF NOT EXISTS church_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES church_organizations(id) ON DELETE CASCADE,
  role church_user_role NOT NULL DEFAULT 'member',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Church Invitations for new users
CREATE TABLE IF NOT EXISTS church_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role church_user_role NOT NULL,
  token TEXT UNIQUE NOT NULL,
  invited_by UUID REFERENCES church_profiles(id),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chart of Accounts
CREATE TABLE IF NOT EXISTS church_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type church_account_type NOT NULL,
  parent_id UUID REFERENCES church_accounts(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Financial Transactions
CREATE TABLE IF NOT EXISTS church_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  description TEXT,
  reference_number TEXT,
  created_by UUID REFERENCES church_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction Line Items (Double-entry bookkeeping)
CREATE TABLE IF NOT EXISTS church_transaction_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES church_transactions(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES church_accounts(id),
  debit DECIMAL(12,2) DEFAULT 0,
  credit DECIMAL(12,2) DEFAULT 0,
  CONSTRAINT positive_amounts CHECK (debit >= 0 AND credit >= 0),
  CONSTRAINT single_sided CHECK ((debit > 0 AND credit = 0) OR (debit = 0 AND credit > 0))
);

-- Songs Repository
CREATE TABLE IF NOT EXISTS church_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT,
  lyrics TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES church_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Presentation Templates
CREATE TABLE IF NOT EXISTS church_presentation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slides JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES church_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Church Services
CREATE TABLE IF NOT EXISTS church_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  slides JSONB NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES church_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meditation Sessions
CREATE TABLE IF NOT EXISTS church_meditation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES church_profiles(id) ON DELETE CASCADE,
  emotion TEXT NOT NULL,
  scripture_reference TEXT,
  scripture_text TEXT,
  meditation_text TEXT,
  audio_url TEXT,
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_church_organizations_slug ON church_organizations(slug);
CREATE INDEX IF NOT EXISTS idx_church_profiles_organization ON church_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_accounts_organization ON church_accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_transactions_organization ON church_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_transactions_date ON church_transactions(date);
CREATE INDEX IF NOT EXISTS idx_church_songs_organization ON church_songs(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_services_organization ON church_services(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_services_date ON church_services(date);

-- Row Level Security (RLS) Policies
ALTER TABLE church_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_transaction_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_presentation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_meditation_sessions ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view their church organization" ON church_organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM church_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Only church admins can update organization" ON church_organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM church_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Profiles policies
CREATE POLICY "Users can view church profiles in their organization" ON church_profiles
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM church_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own church profile" ON church_profiles
  FOR UPDATE USING (id = auth.uid());

-- Generic policy function for organization-scoped tables
CREATE OR REPLACE FUNCTION user_church_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM church_profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE;

-- Apply organization-scoped policies to relevant tables
CREATE POLICY "Users can only access their church organization's accounts" ON church_accounts
  FOR ALL USING (organization_id = user_church_organization_id());

CREATE POLICY "Users can only access their church organization's transactions" ON church_transactions
  FOR ALL USING (organization_id = user_church_organization_id());

CREATE POLICY "Users can only access their church organization's songs" ON church_songs
  FOR ALL USING (organization_id = user_church_organization_id());

CREATE POLICY "Users can only access their church organization's templates" ON church_presentation_templates
  FOR ALL USING (organization_id = user_church_organization_id());

CREATE POLICY "Users can only access their church organization's services" ON church_services
  FOR ALL USING (organization_id = user_church_organization_id());

-- Meditation sessions are user-specific
CREATE POLICY "Users can only access their own church meditation sessions" ON church_meditation_sessions
  FOR ALL USING (user_id = auth.uid());

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_church_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_church_organizations_updated_at BEFORE UPDATE ON church_organizations
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_profiles_updated_at BEFORE UPDATE ON church_profiles
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_accounts_updated_at BEFORE UPDATE ON church_accounts
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_transactions_updated_at BEFORE UPDATE ON church_transactions
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_songs_updated_at BEFORE UPDATE ON church_songs
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_presentation_templates_updated_at BEFORE UPDATE ON church_presentation_templates
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_services_updated_at BEFORE UPDATE ON church_services
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();