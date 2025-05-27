-- =====================================================
-- COMPLETE AFROBIZ CONNECT DATABASE SETUP
-- Run this script in your Supabase SQL Editor
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'business_owner', 'admin');
CREATE TYPE business_status AS ENUM ('pending', 'active', 'suspended', 'closed');
CREATE TYPE price_range_enum AS ENUM ('budget', 'moderate', 'expensive', 'luxury');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled');
CREATE TYPE payment_method_enum AS ENUM ('card', 'mobile_money', 'bank_transfer', 'cash');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
CREATE TYPE notification_type AS ENUM (
  'booking_confirmed', 'booking_cancelled', 'booking_reminder',
  'review_received', 'review_response', 'business_approved',
  'payment_received', 'system_announcement', 'marketing'
);
CREATE TYPE image_type_enum AS ENUM ('logo', 'cover', 'gallery', 'menu', 'certificate');

-- =====================================================
-- TABLES
-- =====================================================

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role user_role DEFAULT 'customer',
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  profile_image_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(20),
  preferred_language VARCHAR(10) DEFAULT 'en',
  marketing_consent BOOLEAN DEFAULT FALSE,
  location_city VARCHAR(100),
  location_region VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  is_suspended BOOLEAN DEFAULT FALSE,
  suspension_reason TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7),
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  
  -- Contact Information
  email VARCHAR(255),
  phone VARCHAR(20),
  website VARCHAR(255),
  whatsapp VARCHAR(20),
  
  -- Address Information
  street_address TEXT,
  city VARCHAR(100),
  region VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Namibia',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Business Details
  logo_url TEXT,
  cover_image_url TEXT,
  price_range price_range_enum DEFAULT 'moderate',
  currency VARCHAR(3) DEFAULT 'NAD',
  
  -- Status & Verification
  status business_status DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP,
  
  -- SEO & Marketing
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords TEXT[],
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  
  -- Business Settings
  settings JSONB DEFAULT '{}',
  
  CONSTRAINT valid_coordinates CHECK (
    (latitude IS NULL AND longitude IS NULL) OR 
    (latitude IS NOT NULL AND longitude IS NOT NULL)
  )
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'NAD',
  duration_minutes INTEGER,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  requires_booking BOOLEAN DEFAULT TRUE,
  max_advance_booking_days INTEGER DEFAULT 30,
  min_advance_booking_hours INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Business hours table
CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  is_24_hours BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, day_of_week)
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id UUID REFERENCES users(id),
  business_id UUID REFERENCES businesses(id),
  service_id UUID REFERENCES services(id),
  
  -- Booking Details
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration_minutes INTEGER,
  guest_count INTEGER DEFAULT 1,
  
  -- Customer Information (for non-registered users)
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  
  -- Pricing
  service_price DECIMAL(10, 2),
  additional_fees DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NAD',
  
  -- Status & Notes
  status booking_status DEFAULT 'pending',
  notes TEXT,
  internal_notes TEXT,
  cancellation_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  -- Reminders
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  status review_status DEFAULT 'pending',
  response TEXT,
  response_date TIMESTAMP,
  is_anonymous BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User favorites table
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users(location_city, location_region);

-- Categories indexes
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Businesses indexes
CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_businesses_location ON businesses(city, region);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_featured ON businesses(is_featured, featured_until);
CREATE INDEX idx_businesses_slug ON businesses(slug);

-- Services indexes
CREATE INDEX idx_services_business ON services(business_id);
CREATE INDEX idx_services_active ON services(is_active);

-- Business hours indexes
CREATE INDEX idx_business_hours_business ON business_hours(business_id);

-- Bookings indexes
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_business ON bookings(business_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_number ON bookings(booking_number);

-- Reviews indexes
CREATE INDEX idx_reviews_business ON reviews(business_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_status ON reviews(status);

-- User favorites indexes
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_business ON user_favorites(business_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_hours_updated_at BEFORE UPDATE ON business_hours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update business rating when reviews change
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the business rating and review count
  UPDATE businesses 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews 
      WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
      AND status = 'approved'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews 
      WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
      AND status = 'approved'
    )
  WHERE id = COALESCE(NEW.business_id, OLD.business_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_business_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_business_rating();

-- Function to generate unique booking numbers
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
DECLARE
  new_booking_number VARCHAR(20);
  counter INTEGER := 0;
BEGIN
  LOOP
    -- Generate a unique booking number with date, time, and random component
    new_booking_number := 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                         LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if this booking number already exists
    IF NOT EXISTS (SELECT 1 FROM bookings WHERE booking_number = new_booking_number) THEN
      NEW.booking_number = new_booking_number;
      EXIT;
    END IF;
    
    -- Safety counter to prevent infinite loop
    counter := counter + 1;
    IF counter > 100 THEN
      -- Fallback to UUID-based number if we can't generate unique number
      NEW.booking_number = 'BK' || REPLACE(uuid_generate_v4()::TEXT, '-', '')::VARCHAR(16);
      EXIT;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_booking_number_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION generate_booking_number();

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can create a user account" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Categories table policies (public read access)
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Businesses table policies
CREATE POLICY "Anyone can view active businesses" ON businesses
  FOR SELECT USING (status = 'active');

CREATE POLICY "Business owners can view their own businesses" ON businesses
  FOR SELECT USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Business owners can create businesses" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Business owners can update their own businesses" ON businesses
  FOR UPDATE USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete businesses" ON businesses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Services table policies
CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND status = 'active'
    )
  );

CREATE POLICY "Business owners can manage their services" ON services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Business hours table policies
CREATE POLICY "Anyone can view business hours" ON business_hours
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND status = 'active'
    )
  );

CREATE POLICY "Business owners can manage their business hours" ON business_hours
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Bookings table policies
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = customer_id OR
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create bookings" ON bookings
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id OR
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() = customer_id OR
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Reviews table policies
CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own reviews" ON reviews
  FOR SELECT USING (
    auth.uid() = customer_id OR
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Customers can create reviews for their bookings" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id 
      AND customer_id = auth.uid() 
      AND status = 'completed'
    )
  );

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (
    auth.uid() = customer_id OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User favorites table policies
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Notifications table policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert categories
INSERT INTO categories (id, name, slug, description, icon, color, sort_order, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Beauty & Wellness', 'beauty-wellness', 'Hair salons, spas, nail studios, and wellness centers', 'Sparkles', '#E91E63', 1, true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Health & Medical', 'health-medical', 'Doctors, dentists, physiotherapy, and medical services', 'Heart', '#4CAF50', 2, true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Automotive', 'automotive', 'Car services, repairs, and maintenance', 'Car', '#FF9800', 3, true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Home Services', 'home-services', 'Cleaning, repairs, gardening, and home maintenance', 'Home', '#2196F3', 4, true),
  ('550e8400-e29b-41d4-a716-446655440005', 'Professional Services', 'professional-services', 'Legal, accounting, consulting, and business services', 'Briefcase', '#9C27B0', 5, true),
  ('550e8400-e29b-41d4-a716-446655440006', 'Food & Dining', 'food-dining', 'Restaurants, cafes, catering, and food delivery', 'UtensilsCrossed', '#FF5722', 6, true),
  ('550e8400-e29b-41d4-a716-446655440007', 'Education & Training', 'education-training', 'Tutoring, courses, workshops, and training programs', 'GraduationCap', '#3F51B5', 7, true),
  ('550e8400-e29b-41d4-a716-446655440008', 'Entertainment', 'entertainment', 'Events, photography, music, and entertainment services', 'Music', '#E91E63', 8, true),
  ('550e8400-e29b-41d4-a716-446655440009', 'Fitness & Sports', 'fitness-sports', 'Gyms, personal training, sports coaching, and fitness', 'Dumbbell', '#4CAF50', 9, true),
  ('550e8400-e29b-41d4-a716-446655440010', 'Technology', 'technology', 'IT services, computer repair, and tech support', 'Laptop', '#607D8B', 10, true);

-- Create sample admin user (password: admin123)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, email_verified, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440100', 'admin@afrobiz.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Admin', 'User', 'admin', true, true);

-- Create sample business owners
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, location_city, location_region, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', 'maria@namibiahair.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Maria', 'Nangolo', '+264 81 123 4567', 'business_owner', true, 'Windhoek', 'Khomas', true),
  ('550e8400-e29b-41d4-a716-446655440102', 'john@desertrose.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'John', 'Katjavivi', '+264 81 234 5678', 'business_owner', true, 'Windhoek', 'Khomas', true),
  ('550e8400-e29b-41d4-a716-446655440103', 'sarah@kalaharifitness.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Sarah', 'Amupolo', '+264 81 345 6789', 'business_owner', true, 'Windhoek', 'Khomas', true),
  ('550e8400-e29b-41d4-a716-446655440104', 'david@autocare.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'David', 'Shipanga', '+264 81 456 7890', 'business_owner', true, 'Swakopmund', 'Erongo', true),
  ('550e8400-e29b-41d4-a716-446655440105', 'grace@graceclinic.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Grace', 'Mukamuri', '+264 81 567 8901', 'business_owner', true, 'Oshakati', 'Oshana', true);

-- Create sample customers
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, location_city, location_region, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440201', 'customer1@email.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Anna', 'Shikongo', '+264 81 111 2222', 'customer', true, 'Windhoek', 'Khomas', true),
  ('550e8400-e29b-41d4-a716-446655440202', 'customer2@email.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Peter', 'Nghidinwa', '+264 81 222 3333', 'customer', true, 'Walvis Bay', 'Erongo', true),
  ('550e8400-e29b-41d4-a716-446655440203', 'customer3@email.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', 'Linda', 'Hamunyela', '+264 81 333 4444', 'customer', true, 'Rundu', 'Kavango East', true);

-- Insert sample businesses
INSERT INTO businesses (
  id, owner_id, name, slug, description, category_id,
  email, phone, website, street_address, city, region, country,
  latitude, longitude, logo_url, cover_image_url, price_range,
  status, is_verified, is_featured, average_rating, review_count,
  published_at
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440301',
    '550e8400-e29b-41d4-a716-446655440101',
    'Namibia Hair Studio',
    'namibia-hair-studio',
    'Premier hair salon offering cutting-edge styles, coloring, and treatments. Specializing in African hair care with international techniques.',
    '550e8400-e29b-41d4-a716-446655440001',
    'info@namibiahair.com',
    '+264 61 123 456',
    'https://namibiahair.com',
    '123 Independence Avenue',
    'Windhoek',
    'Khomas',
    'Namibia',
    -22.5609,
    17.0658,
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    'moderate',
    'active',
    true,
    true,
    4.8,
    127,
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440302',
    '550e8400-e29b-41d4-a716-446655440102',
    'Desert Rose Spa',
    'desert-rose-spa',
    'Luxury spa offering massages, facials, and wellness treatments in a serene desert-inspired setting.',
    '550e8400-e29b-41d4-a716-446655440001',
    'info@desertrose.com',
    '+264 61 234 567',
    'https://desertrose.com',
    '456 Sam Nujoma Drive',
    'Windhoek',
    'Khomas',
    'Namibia',
    -22.5700,
    17.0836,
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    'expensive',
    'active',
    true,
    true,
    4.9,
    89,
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440303',
    '550e8400-e29b-41d4-a716-446655440103',
    'Kalahari Fitness Center',
    'kalahari-fitness-center',
    'Modern fitness center with state-of-the-art equipment, group classes, and personal training services.',
    '550e8400-e29b-41d4-a716-446655440009',
    'info@kalaharifitness.com',
    '+264 61 345 678',
    'https://kalaharifitness.com',
    '789 Mandume Ndemufayo Avenue',
    'Windhoek',
    'Khomas',
    'Namibia',
    -22.5500,
    17.0700,
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'moderate',
    'active',
    true,
    false,
    4.7,
    156,
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440304',
    '550e8400-e29b-41d4-a716-446655440104',
    'Coastal Auto Care',
    'coastal-auto-care',
    'Full-service automotive repair and maintenance center serving the coastal region with expert technicians.',
    '550e8400-e29b-41d4-a716-446655440003',
    'service@coastalauto.com',
    '+264 64 456 789',
    'https://coastalauto.com',
    '321 Nathaniel Maxuilili Street',
    'Swakopmund',
    'Erongo',
    'Namibia',
    -22.6792,
    14.5272,
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200',
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800',
    'moderate',
    'active',
    true,
    false,
    4.6,
    203,
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440305',
    '550e8400-e29b-41d4-a716-446655440105',
    'Grace Medical Clinic',
    'grace-medical-clinic',
    'Comprehensive medical services including general practice, pediatrics, and preventive care.',
    '550e8400-e29b-41d4-a716-446655440002',
    'appointments@graceclinic.com',
    '+264 65 567 890',
    'https://graceclinic.com',
    '654 Dr. Libertine Amathila Avenue',
    'Oshakati',
    'Oshana',
    'Namibia',
    -17.7886,
    15.6982,
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    'moderate',
    'active',
    true,
    false,
    4.9,
    78,
    NOW()
  );

-- Insert services for businesses
INSERT INTO services (id, business_id, name, description, price, duration_minutes, category, is_active, sort_order) VALUES
  -- Namibia Hair Studio services
  ('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440301', 'Hair Cut & Style', 'Professional haircut with styling', 250.00, 60, 'Hair Care', true, 1),
  ('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440301', 'Hair Coloring', 'Full hair coloring service', 450.00, 120, 'Hair Care', true, 2),
  ('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440301', 'Hair Treatment', 'Deep conditioning treatment', 180.00, 45, 'Hair Care', true, 3),
  
  -- Desert Rose Spa services
  ('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440302', 'Full Body Massage', 'Relaxing full body massage', 380.00, 90, 'Massage', true, 1),
  ('550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440302', 'Facial Treatment', 'Rejuvenating facial treatment', 280.00, 60, 'Skincare', true, 2),
  ('550e8400-e29b-41d4-a716-446655440406', '550e8400-e29b-41d4-a716-446655440302', 'Manicure & Pedicure', 'Complete nail care service', 220.00, 75, 'Nail Care', true, 3),
  
  -- Kalahari Fitness services
  ('550e8400-e29b-41d4-a716-446655440407', '550e8400-e29b-41d4-a716-446655440303', 'Personal Training Session', 'One-on-one fitness training', 150.00, 60, 'Personal Training', true, 1),
  ('550e8400-e29b-41d4-a716-446655440408', '550e8400-e29b-41d4-a716-446655440303', 'Group Fitness Class', 'High-energy group workout', 80.00, 45, 'Group Classes', true, 2),
  ('550e8400-e29b-41d4-a716-446655440409', '550e8400-e29b-41d4-a716-446655440303', 'Nutrition Consultation', 'Personalized nutrition planning', 200.00, 45, 'Nutrition', true, 3),
  
  -- Coastal Auto Care services
  ('550e8400-e29b-41d4-a716-446655440410', '550e8400-e29b-41d4-a716-446655440304', 'Oil Change Service', 'Complete oil change and filter', 320.00, 30, 'Maintenance', true, 1),
  ('550e8400-e29b-41d4-a716-446655440411', '550e8400-e29b-41d4-a716-446655440304', 'Brake Inspection', 'Comprehensive brake system check', 180.00, 45, 'Safety', true, 2),
  ('550e8400-e29b-41d4-a716-446655440412', '550e8400-e29b-41d4-a716-446655440304', 'Engine Diagnostic', 'Computer diagnostic scan', 250.00, 60, 'Diagnostic', true, 3),
  
  -- Grace Medical Clinic services
  ('550e8400-e29b-41d4-a716-446655440413', '550e8400-e29b-41d4-a716-446655440305', 'General Consultation', 'General medical consultation', 180.00, 30, 'General Practice', true, 1),
  ('550e8400-e29b-41d4-a716-446655440414', '550e8400-e29b-41d4-a716-446655440305', 'Health Screening', 'Comprehensive health check-up', 450.00, 60, 'Preventive Care', true, 2),
  ('550e8400-e29b-41d4-a716-446655440415', '550e8400-e29b-41d4-a716-446655440305', 'Vaccination Service', 'Immunization and vaccines', 120.00, 15, 'Preventive Care', true, 3);

-- Insert business hours (Monday = 1, Sunday = 0)
INSERT INTO business_hours (business_id, day_of_week, open_time, close_time, is_closed) VALUES
  -- Namibia Hair Studio (Closed Sundays)
  ('550e8400-e29b-41d4-a716-446655440301', 1, '08:00', '18:00', false),
  ('550e8400-e29b-41d4-a716-446655440301', 2, '08:00', '18:00', false),
  ('550e8400-e29b-41d4-a716-446655440301', 3, '08:00', '18:00', false),
  ('550e8400-e29b-41d4-a716-446655440301', 4, '08:00', '18:00', false),
  ('550e8400-e29b-41d4-a716-446655440301', 5, '08:00', '18:00', false),
  ('550e8400-e29b-41d4-a716-446655440301', 6, '08:00', '16:00', false),
  ('550e8400-e29b-41d4-a716-446655440301', 0, null, null, true),
  
  -- Desert Rose Spa
  ('550e8400-e29b-41d4-a716-446655440302', 1, '09:00', '19:00', false),
  ('550e8400-e29b-41d4-a716-446655440302', 2, '09:00', '19:00', false),
  ('550e8400-e29b-41d4-a716-446655440302', 3, '09:00', '19:00', false),
  ('550e8400-e29b-41d4-a716-446655440302', 4, '09:00', '19:00', false),
  ('550e8400-e29b-41d4-a716-446655440302', 5, '09:00', '19:00', false),
  ('550e8400-e29b-41d4-a716-446655440302', 6, '09:00', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440302', 0, '10:00', '16:00', false),
  
  -- Kalahari Fitness Center
  ('550e8400-e29b-41d4-a716-446655440303', 1, '05:30', '22:00', false),
  ('550e8400-e29b-41d4-a716-446655440303', 2, '05:30', '22:00', false),
  ('550e8400-e29b-41d4-a716-446655440303', 3, '05:30', '22:00', false),
  ('550e8400-e29b-41d4-a716-446655440303', 4, '05:30', '22:00', false),
  ('550e8400-e29b-41d4-a716-446655440303', 5, '05:30', '22:00', false),
  ('550e8400-e29b-41d4-a716-446655440303', 6, '06:00', '20:00', false),
  ('550e8400-e29b-41d4-a716-446655440303', 0, '07:00', '19:00', false),
  
  -- Coastal Auto Care (Closed Sundays)
  ('550e8400-e29b-41d4-a716-446655440304', 1, '07:30', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440304', 2, '07:30', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440304', 3, '07:30', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440304', 4, '07:30', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440304', 5, '07:30', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440304', 6, '08:00', '13:00', false),
  ('550e8400-e29b-41d4-a716-446655440304', 0, null, null, true),
  
  -- Grace Medical Clinic (Closed Sundays)
  ('550e8400-e29b-41d4-a716-446655440305', 1, '08:00', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440305', 2, '08:00', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440305', 3, '08:00', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440305', 4, '08:00', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440305', 5, '08:00', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440305', 6, '08:00', '12:00', false),
  ('550e8400-e29b-41d4-a716-446655440305', 0, null, null, true);

-- Insert sample bookings with unique booking numbers
INSERT INTO bookings (
  id, booking_number, customer_id, business_id, service_id, booking_date, booking_time,
  duration_minutes, customer_name, customer_email, customer_phone,
  service_price, total_amount, status, notes, confirmed_at
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440501',
    'BK20240125-0001',
    '550e8400-e29b-41d4-a716-446655440201',
    '550e8400-e29b-41d4-a716-446655440301',
    '550e8400-e29b-41d4-a716-446655440401',
    '2024-01-25',
    '10:00',
    60,
    'Anna Shikongo',
    'customer1@email.com',
    '+264 81 111 2222',
    250.00,
    250.00,
    'completed',
    'Regular trim and style',
    NOW() - INTERVAL '5 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440502',
    'BK20240126-0002',
    '550e8400-e29b-41d4-a716-446655440202',
    '550e8400-e29b-41d4-a716-446655440302',
    '550e8400-e29b-41d4-a716-446655440404',
    '2024-01-26',
    '14:00',
    90,
    'Peter Nghidinwa',
    'customer2@email.com',
    '+264 81 222 3333',
    380.00,
    380.00,
    'completed',
    'Relaxation massage',
    NOW() - INTERVAL '4 days'
  );

-- Insert sample reviews
INSERT INTO reviews (
  id, business_id, customer_id, booking_id, rating, title, comment, status, created_at
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440601',
    '550e8400-e29b-41d4-a716-446655440301',
    '550e8400-e29b-41d4-a716-446655440201',
    '550e8400-e29b-41d4-a716-446655440501',
    5,
    'Excellent service!',
    'Maria and her team are amazing. They really understand African hair and the results were perfect. Highly recommend!',
    'approved',
    NOW() - INTERVAL '3 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440602',
    '550e8400-e29b-41d4-a716-446655440302',
    '550e8400-e29b-41d4-a716-446655440202',
    '550e8400-e29b-41d4-a716-446655440502',
    5,
    'Very relaxing experience',
    'The spa has a wonderful atmosphere and the massage was exactly what I needed. Will definitely be back!',
    'approved',
    NOW() - INTERVAL '2 days'
  );

-- Insert sample user favorites
INSERT INTO user_favorites (user_id, business_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440301'),
  ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440302'),
  ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440303'),
  ('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440305');

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Display success message
SELECT 'AfroBiz Connect database setup completed successfully!' as message; 