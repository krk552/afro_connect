# Database Structure Design - AfroBiz Connect

## Overview
This document outlines the complete database structure for AfroBiz Connect, including all tables, relationships, indexes, and data models required for a production-ready business directory and booking platform.

## Database Technology Stack
- **Primary Database**: PostgreSQL 15+
- **Search Engine**: Elasticsearch (for business search)
- **Cache**: Redis (for sessions, rate limiting)
- **File Storage**: AWS S3 or CloudFlare R2
- **CDN**: CloudFlare for image delivery

## Core Database Schema

### 1. Users & Authentication Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TYPE user_role AS ENUM ('customer', 'business_owner', 'admin');
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users(location_city, location_region);
```

### 2. Business Management Tables

#### Businesses Table
```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  subcategory_id UUID REFERENCES subcategories(id),
  
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

CREATE TYPE business_status AS ENUM ('pending', 'active', 'suspended', 'closed');
CREATE TYPE price_range_enum AS ENUM ('budget', 'moderate', 'expensive', 'luxury');

-- Indexes for businesses
CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_businesses_location ON businesses(city, region);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_featured ON businesses(is_featured, featured_until);
CREATE INDEX idx_businesses_coordinates ON businesses USING GIST(point(longitude, latitude));
CREATE INDEX idx_businesses_search ON businesses USING GIN(to_tsvector('english', name || ' ' || description));
```

#### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7), -- Hex color code
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);
```

#### Business Hours Table
```sql
CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  is_24_hours BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(business_id, day_of_week)
);

CREATE INDEX idx_business_hours_business ON business_hours(business_id);
```

#### Business Images Table
```sql
CREATE TABLE business_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  image_type image_type_enum DEFAULT 'gallery',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE image_type_enum AS ENUM ('logo', 'cover', 'gallery', 'menu', 'certificate');
CREATE INDEX idx_business_images_business ON business_images(business_id);
```

### 3. Services & Pricing Tables

#### Services Table
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX idx_services_business ON services(business_id);
CREATE INDEX idx_services_active ON services(is_active);
```

#### Service Availability Table
```sql
CREATE TABLE service_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_service_availability_service ON service_availability(service_id);
```

### 4. Booking System Tables

#### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  reminder_sent_at TIMESTAMP,
  follow_up_sent_at TIMESTAMP
);

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');

-- Indexes for bookings
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_business ON bookings(business_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_number ON bookings(booking_number);
```

#### Booking Status History Table
```sql
CREATE TABLE booking_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  old_status booking_status,
  new_status booking_status NOT NULL,
  changed_by UUID REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_booking_status_history_booking ON booking_status_history(booking_id);
```

### 5. Reviews & Ratings Tables

#### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  
  -- Review Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  
  -- Review Breakdown (optional detailed ratings)
  service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  
  -- Status & Moderation
  status review_status DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  moderation_notes TEXT,
  
  -- Interaction
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  
  -- Response
  business_response TEXT,
  business_response_date TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');

-- Indexes for reviews
CREATE INDEX idx_reviews_business ON reviews(business_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_created ON reviews(created_at);
```

#### Review Images Table
```sql
CREATE TABLE review_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_review_images_review ON review_images(review_id);
```

### 6. Favorites & User Interactions Tables

#### User Favorites Table
```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, business_id)
);

CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_business ON user_favorites(business_id);
```

#### Business Views Table
```sql
CREATE TABLE business_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_business_views_business ON business_views(business_id);
CREATE INDEX idx_business_views_date ON business_views(viewed_at);
```

### 7. Notifications & Communications Tables

#### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  is_sent BOOLEAN DEFAULT FALSE,
  
  -- Delivery
  email_sent BOOLEAN DEFAULT FALSE,
  sms_sent BOOLEAN DEFAULT FALSE,
  push_sent BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  sent_at TIMESTAMP
);

CREATE TYPE notification_type AS ENUM (
  'booking_confirmed', 'booking_cancelled', 'booking_reminder',
  'review_received', 'review_response', 'business_approved',
  'payment_received', 'system_announcement', 'marketing'
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
```

### 8. Payment & Financial Tables

#### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  user_id UUID REFERENCES users(id),
  business_id UUID REFERENCES businesses(id),
  
  -- Payment Details
  payment_method payment_method_enum NOT NULL,
  payment_provider VARCHAR(50), -- 'stripe', 'paypal', 'mobile_money'
  provider_payment_id VARCHAR(255),
  
  -- Amounts
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NAD',
  platform_fee DECIMAL(10, 2) DEFAULT 0,
  business_amount DECIMAL(10, 2) NOT NULL,
  
  -- Status
  status payment_status DEFAULT 'pending',
  failure_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  failed_at TIMESTAMP,
  refunded_at TIMESTAMP,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'
);

CREATE TYPE payment_method_enum AS ENUM ('card', 'mobile_money', 'bank_transfer', 'cash');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled');

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_business ON payments(business_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### 9. Analytics & Reporting Tables

#### Business Analytics Table
```sql
CREATE TABLE business_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- View Metrics
  profile_views INTEGER DEFAULT 0,
  search_appearances INTEGER DEFAULT 0,
  click_through_rate DECIMAL(5, 4) DEFAULT 0,
  
  -- Booking Metrics
  booking_requests INTEGER DEFAULT 0,
  bookings_confirmed INTEGER DEFAULT 0,
  bookings_completed INTEGER DEFAULT 0,
  bookings_cancelled INTEGER DEFAULT 0,
  
  -- Revenue Metrics
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  average_booking_value DECIMAL(10, 2) DEFAULT 0,
  
  -- Review Metrics
  reviews_received INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  
  -- Engagement Metrics
  favorites_added INTEGER DEFAULT 0,
  phone_clicks INTEGER DEFAULT 0,
  website_clicks INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(business_id, date)
);

CREATE INDEX idx_business_analytics_business_date ON business_analytics(business_id, date);
```

### 10. System Configuration Tables

#### System Settings Table
```sql
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  data_type VARCHAR(50) DEFAULT 'string',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_system_settings_key ON system_settings(key);
```

#### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

## Database Views

### Business Summary View
```sql
CREATE VIEW business_summary AS
SELECT 
  b.id,
  b.name,
  b.slug,
  b.city,
  b.region,
  b.status,
  b.is_verified,
  b.is_featured,
  c.name as category_name,
  c.slug as category_slug,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(r.id) as review_count,
  COUNT(DISTINCT bk.id) as booking_count,
  b.view_count,
  b.created_at
FROM businesses b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN reviews r ON b.id = r.business_id AND r.status = 'approved'
LEFT JOIN bookings bk ON b.id = bk.business_id AND bk.status IN ('confirmed', 'completed')
GROUP BY b.id, c.name, c.slug;
```

### User Activity View
```sql
CREATE VIEW user_activity AS
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.role,
  COUNT(DISTINCT b.id) as bookings_count,
  COUNT(DISTINCT r.id) as reviews_count,
  COUNT(DISTINCT f.id) as favorites_count,
  u.last_login_at,
  u.created_at
FROM users u
LEFT JOIN bookings b ON u.id = b.customer_id
LEFT JOIN reviews r ON u.id = r.customer_id
LEFT JOIN user_favorites f ON u.id = f.user_id
GROUP BY u.id;
```

## Database Functions & Triggers

### Update Timestamps Function
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add similar triggers for other tables...
```

### Business Rating Update Function
```sql
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update business average rating when review is added/updated/deleted
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
```

## Performance Optimization

### Partitioning Strategy
```sql
-- Partition audit_logs by month
CREATE TABLE audit_logs_y2024m01 PARTITION OF audit_logs
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Partition business_analytics by quarter
CREATE TABLE business_analytics_y2024q1 PARTITION OF business_analytics
FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
```

### Materialized Views for Analytics
```sql
CREATE MATERIALIZED VIEW business_stats_monthly AS
SELECT 
  business_id,
  DATE_TRUNC('month', date) as month,
  SUM(profile_views) as total_views,
  SUM(booking_requests) as total_booking_requests,
  SUM(bookings_confirmed) as total_bookings_confirmed,
  SUM(total_revenue) as total_revenue
FROM business_analytics
GROUP BY business_id, DATE_TRUNC('month', date);

CREATE UNIQUE INDEX ON business_stats_monthly (business_id, month);

-- Refresh daily
CREATE OR REPLACE FUNCTION refresh_business_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY business_stats_monthly;
END;
$$ LANGUAGE plpgsql;
```

## Data Migration Strategy

### Phase 1: Core Tables
1. Users and authentication tables
2. Categories and businesses
3. Basic business information

### Phase 2: Business Features
1. Services and pricing
2. Business hours and availability
3. Images and media

### Phase 3: Booking System
1. Bookings and status tracking
2. Payment integration
3. Notifications

### Phase 4: Analytics & Optimization
1. Analytics tables
2. Audit logging
3. Performance optimization

## Backup & Recovery Strategy

### Daily Backups
```bash
# Full database backup
pg_dump -h localhost -U postgres afrobiz_connect > backup_$(date +%Y%m%d).sql

# Compressed backup
pg_dump -h localhost -U postgres afrobiz_connect | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Point-in-Time Recovery
- Enable WAL archiving
- Configure continuous archiving
- Test recovery procedures monthly

## Security Considerations

### Row Level Security (RLS)
```sql
-- Enable RLS on sensitive tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Business owners can only see their own businesses
CREATE POLICY business_owner_policy ON businesses
  FOR ALL TO business_owner
  USING (owner_id = current_user_id());

-- Customers can only see active businesses
CREATE POLICY customer_business_policy ON businesses
  FOR SELECT TO customer
  USING (status = 'active');
```

### Data Encryption
- Encrypt sensitive columns (PII, payment data)
- Use application-level encryption for highly sensitive data
- Implement field-level encryption for compliance

This database structure provides a solid foundation for a scalable, secure, and feature-rich business directory and booking platform tailored for the Namibian market. 