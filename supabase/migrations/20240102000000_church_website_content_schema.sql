-- Church Website Content Tables

-- Hero Section
CREATE TABLE IF NOT EXISTS church_hero_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  welcome_badge TEXT DEFAULT 'Bienvenido',
  headline TEXT NOT NULL,
  subheadline TEXT,
  cta_primary_text TEXT,
  cta_primary_link TEXT,
  cta_secondary_text TEXT,
  cta_secondary_link TEXT,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About Section (Propósito)
CREATE TABLE IF NOT EXISTS church_about_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Nuestro Propósito',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members
CREATE TABLE IF NOT EXISTS church_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events (public view)
CREATE TABLE IF NOT EXISTS church_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule
CREATE TABLE IF NOT EXISTS church_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  time TIME NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Information
CREATE TABLE IF NOT EXISTS church_contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  address TEXT,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  social_links JSONB DEFAULT '{}',
  map_embed_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prayer Requests
CREATE TABLE IF NOT EXISTS church_prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  request TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sermons/Reflections
CREATE TABLE IF NOT EXISTS church_sermons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  speaker TEXT,
  date DATE NOT NULL,
  description TEXT,
  audio_url TEXT,
  video_url TEXT,
  spotify_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Website Settings
CREATE TABLE IF NOT EXISTS church_website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES church_organizations(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'casa',
  custom_css TEXT,
  custom_js TEXT,
  meta_description TEXT,
  social_image_url TEXT,
  favicon_url TEXT,
  google_analytics_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_church_hero_organization ON church_hero_sections(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_about_organization ON church_about_sections(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_team_organization ON church_team_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_events_organization ON church_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_events_date ON church_events(date);
CREATE INDEX IF NOT EXISTS idx_church_schedules_organization ON church_schedules(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_contact_organization ON church_contact_info(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_prayer_requests_organization ON church_prayer_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_sermons_organization ON church_sermons(organization_id);
CREATE INDEX IF NOT EXISTS idx_church_sermons_date ON church_sermons(date);
CREATE INDEX IF NOT EXISTS idx_church_website_settings_organization ON church_website_settings(organization_id);

-- Enable RLS
ALTER TABLE church_hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_website_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for church website content
CREATE POLICY "Public can read church hero sections" ON church_hero_sections
  FOR SELECT USING (true);

CREATE POLICY "Public can read church about sections" ON church_about_sections
  FOR SELECT USING (true);

CREATE POLICY "Public can read church team members" ON church_team_members
  FOR SELECT USING (true);

CREATE POLICY "Public can read published church events" ON church_events
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read church schedules" ON church_schedules
  FOR SELECT USING (true);

CREATE POLICY "Public can read church contact info" ON church_contact_info
  FOR SELECT USING (true);

CREATE POLICY "Public can read church sermons" ON church_sermons
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read church website settings" ON church_website_settings
  FOR SELECT USING (true);

-- Only authenticated users from the organization can modify
CREATE POLICY "Church organization members can modify hero sections" ON church_hero_sections
  FOR ALL USING (organization_id = user_church_organization_id());

CREATE POLICY "Church organization members can modify about sections" ON church_about_sections
  FOR ALL USING (organization_id = user_church_organization_id());

CREATE POLICY "Church organization members can modify team members" ON church_team_members
  FOR ALL USING (organization_id = user_church_organization_id());

CREATE POLICY "Church organization members can modify events" ON church_events
  FOR ALL USING (organization_id = user_church_organization_id());

CREATE POLICY "Church organization members can modify schedules" ON church_schedules
  FOR ALL USING (organization_id = user_church_organization_id());

CREATE POLICY "Church organization members can modify contact info" ON church_contact_info
  FOR ALL USING (organization_id = user_church_organization_id());

CREATE POLICY "Church organization members can modify sermons" ON church_sermons
  FOR ALL USING (organization_id = user_church_organization_id());

CREATE POLICY "Church organization members can modify website settings" ON church_website_settings
  FOR ALL USING (organization_id = user_church_organization_id());

-- Prayer requests - anyone can create, only org members can read
CREATE POLICY "Anyone can create church prayer requests" ON church_prayer_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Church organization members can read prayer requests" ON church_prayer_requests
  FOR SELECT USING (organization_id = user_church_organization_id());

-- Triggers for updated_at
CREATE TRIGGER update_church_hero_sections_updated_at BEFORE UPDATE ON church_hero_sections
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_about_sections_updated_at BEFORE UPDATE ON church_about_sections
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_team_members_updated_at BEFORE UPDATE ON church_team_members
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_events_updated_at BEFORE UPDATE ON church_events
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_schedules_updated_at BEFORE UPDATE ON church_schedules
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_contact_info_updated_at BEFORE UPDATE ON church_contact_info
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_sermons_updated_at BEFORE UPDATE ON church_sermons
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();

CREATE TRIGGER update_church_website_settings_updated_at BEFORE UPDATE ON church_website_settings
  FOR EACH ROW EXECUTE FUNCTION update_church_updated_at_column();