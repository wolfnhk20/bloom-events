-- ============================================
-- Smart Event Coordination System
-- Supabase PostgreSQL Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PACKAGES TABLE
-- ============================================
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  max_guests INTEGER NOT NULL,
  features JSONB DEFAULT '[]',
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  icon VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  event_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('BABY_SHOWER', 'NAMING_CEREMONY', 'BOTH')),
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  venue_name VARCHAR(255),
  venue_address TEXT,
  guest_count INTEGER NOT NULL DEFAULT 0,
  catering_per_guest DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
  special_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EVENT_SERVICES (many-to-many)
-- ============================================
CREATE TABLE event_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  price_at_booking DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, service_id)
);

-- ============================================
-- GUESTS TABLE
-- ============================================
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  dietary_preference VARCHAR(50),
  rsvp_status VARCHAR(20) DEFAULT 'PENDING' CHECK (rsvp_status IN ('PENDING', 'CONFIRMED', 'DECLINED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_guests_event_id ON guests(event_id);
CREATE INDEX idx_event_services_event_id ON event_services(event_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- Events: users see their own
CREATE POLICY "events_select_own" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "events_insert_own" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "events_update_own" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "events_delete_own" ON events FOR DELETE USING (auth.uid() = user_id);

-- Packages & Services: everyone can read
CREATE POLICY "packages_select_all" ON packages FOR SELECT USING (true);
CREATE POLICY "services_select_all" ON services FOR SELECT USING (true);

-- Guests: event owner can manage
CREATE POLICY "guests_select_own" ON guests FOR SELECT USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid())
);
CREATE POLICY "guests_insert_own" ON guests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid())
);

-- Event services: event owner can manage
CREATE POLICY "event_services_select_own" ON event_services FOR SELECT USING (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_services.event_id AND events.user_id = auth.uid())
);
CREATE POLICY "event_services_insert_own" ON event_services FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM events WHERE events.id = event_services.event_id AND events.user_id = auth.uid())
);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Packages
INSERT INTO packages (name, description, base_price, max_guests, features, is_popular) VALUES
(
  'Blossom',
  'Perfect for intimate gatherings with essential decorations and catering.',
  15000.00, 30,
  '["Basic floral decorations", "Welcome banner", "Cake table setup", "Basic sound system", "Event coordinator"]',
  FALSE
),
(
  'Bloom',
  'Our most popular package — a beautiful balance of elegance and affordability.',
  35000.00, 75,
  '["Premium floral arrangements", "Themed decorations", "Professional photographer (4 hrs)", "Catering setup", "DJ + sound system", "Event coordinator", "Thank you cards"]',
  TRUE
),
(
  'Radiance',
  'Luxury experience with premium everything — the ultimate celebration package.',
  65000.00, 150,
  '["Luxury floral & décor", "Photo + video coverage (full day)", "Live music / DJ", "Premium catering buffet", "Guest return gifts", "Dedicated event team", "Custom invitation cards", "Cake + dessert table"]',
  FALSE
);

-- Services
INSERT INTO services (name, description, price, category, icon) VALUES
('Floral Arrangements', 'Custom flower arrangements and centerpieces', 5000.00, 'DECORATION', 'flower'),
('Professional Photography', '8-hour photography coverage with edited photos', 12000.00, 'MEDIA', 'camera'),
('Videography', 'Full event video coverage with cinematic edit', 15000.00, 'MEDIA', 'video'),
('DJ & Sound System', 'Professional DJ with lighting and sound setup', 8000.00, 'ENTERTAINMENT', 'music'),
('Live Music Band', 'Acoustic or full band performance', 20000.00, 'ENTERTAINMENT', 'guitar'),
('Baby Shower Games Kit', 'Curated games and activities for guests', 2500.00, 'ACTIVITIES', 'game'),
('Custom Cake', 'Designer themed cake with up to 3 tiers', 6000.00, 'CATERING', 'cake'),
('Dessert Table', 'Candy bar and dessert spread setup', 4500.00, 'CATERING', 'candy'),
('Return Gifts (per 10)', 'Personalized return gifts for guests', 3000.00, 'GIFTS', 'gift'),
('Custom Invitations (50 pcs)', 'Printed designer invitation cards', 2000.00, 'STATIONERY', 'mail'),
('Photo Booth Setup', 'Props and backdrop for photo booth fun', 3500.00, 'ENTERTAINMENT', 'booth'),
('Venue Cleanup Service', 'Post-event complete venue cleanup', 2000.00, 'VENUE', 'broom');

-- Admin user placeholder (replace with real auth UID from Supabase)
-- INSERT INTO users (id, email, full_name, role) VALUES
-- ('your-supabase-auth-uid', 'admin@yourdomain.com', 'Admin', 'ADMIN');
