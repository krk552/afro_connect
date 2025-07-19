-- Clear all seed data from the database but preserve schema
-- This gives us a clean slate for production launch

-- Clear all data tables in dependency order (only if they exist)
DELETE FROM notifications WHERE true;
DELETE FROM user_favorites WHERE true;
DELETE FROM reviews WHERE true;
DELETE FROM bookings WHERE true;
DELETE FROM business_hours WHERE true;
DELETE FROM services WHERE true;
DELETE FROM businesses WHERE true;
DELETE FROM categories WHERE true;
DELETE FROM users WHERE role != 'admin'; -- Keep admin users

-- Reset sequences (only if they exist)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'booking_number_seq') THEN
    ALTER SEQUENCE booking_number_seq RESTART WITH 1;
  END IF;
END $$;

-- Insert minimal categories for production (real categories, not fake data)
INSERT INTO categories (id, name, slug, description, icon, color, is_active, created_at) VALUES
  (uuid_generate_v4(), 'Beauty & Wellness', 'beauty-wellness', 'Beauty salons, spas, massage therapists, and wellness services', '💄', '#FF6B9D', true, NOW()),
  (uuid_generate_v4(), 'Food & Restaurants', 'food-restaurants', 'Restaurants, cafes, food delivery, and catering services', '🍽️', '#FF8C00', true, NOW()),
  (uuid_generate_v4(), 'Professional Services', 'professional-services', 'Legal, accounting, consulting, and business services', '💼', '#4169E1', true, NOW()),
  (uuid_generate_v4(), 'Health & Medical', 'health-medical', 'Doctors, clinics, physiotherapy, and medical services', '🏥', '#32CD32', true, NOW()),
  (uuid_generate_v4(), 'Home & Garden', 'home-garden', 'Home repair, cleaning, gardening, and maintenance services', '🏠', '#8FBC8F', true, NOW()),
  (uuid_generate_v4(), 'Education & Training', 'education-training', 'Tutoring, courses, workshops, and educational services', '📚', '#FFD700', true, NOW()),
  (uuid_generate_v4(), 'Automotive', 'automotive', 'Car repair, maintenance, washing, and automotive services', '🚗', '#DC143C', true, NOW()),
  (uuid_generate_v4(), 'Technology', 'technology', 'IT support, web development, software, and tech services', '💻', '#4682B4', true, NOW());