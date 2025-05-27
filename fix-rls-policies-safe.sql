-- Safe RLS Policy Fix Script
-- This script safely removes and recreates RLS policies to fix infinite recursion
-- Updated with correct column names from the actual schema

-- Disable RLS temporarily to avoid conflicts during policy updates
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE businesses DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (comprehensive list)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on users table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON users';
    END LOOP;
    
    -- Drop all policies on categories table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'categories' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON categories';
    END LOOP;
    
    -- Drop all policies on businesses table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'businesses' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON businesses';
    END LOOP;
    
    -- Drop all policies on services table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'services' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON services';
    END LOOP;
    
    -- Drop all policies on business_hours table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'business_hours' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON business_hours';
    END LOOP;
    
    -- Drop all policies on reviews table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'reviews' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON reviews';
    END LOOP;
    
    -- Drop all policies on bookings table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'bookings' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON bookings';
    END LOOP;
    
    -- Drop all policies on user_favorites table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_favorites' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_favorites';
    END LOOP;
    
    -- Drop all policies on notifications table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'notifications' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON notifications';
    END LOOP;
END $$;

-- Now create new policies with correct column names

-- Users table policies (simplified to avoid recursion)
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Categories table policies
CREATE POLICY "categories_select_active" ON categories
  FOR SELECT USING (is_active = true);

-- Businesses table policies
CREATE POLICY "businesses_select_active" ON businesses
  FOR SELECT USING (status = 'active');

-- Services table policies
CREATE POLICY "services_select_active" ON services
  FOR SELECT USING (is_active = true);

-- Business hours table policies
CREATE POLICY "business_hours_select_all" ON business_hours
  FOR SELECT USING (true);

-- Reviews table policies (using correct column name: customer_id)
CREATE POLICY "reviews_select_approved" ON reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "reviews_insert_own" ON reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = customer_id);

CREATE POLICY "reviews_update_own" ON reviews
  FOR UPDATE USING (auth.uid() = customer_id);

-- Bookings table policies (using correct column name: customer_id)
CREATE POLICY "bookings_select_own" ON bookings
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "bookings_insert_own" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "bookings_update_own" ON bookings
  FOR UPDATE USING (auth.uid() = customer_id);

-- Business owners can view bookings for their businesses
CREATE POLICY "bookings_select_business_owner" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = bookings.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

-- User favorites table policies (user_id is correct here)
CREATE POLICY "favorites_select_own" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_manage_own" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Notifications table policies (user_id is correct here)
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Re-enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname; 