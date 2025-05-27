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
  ('550e8400-e29b-41d4-a716-446655440301', 1, '08:00', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440301', 2, '08:00', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440301', 3, '08:00', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440301', 4, '08:00', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440301', 5, '08:00', '17:00', false),
  ('550e8400-e29b-41d4-a716-446655440301', 6, '08:00', '15:00', false),
  ('550e8400-e29b-41d4-a716-446655440301', 0, null, null, true),
  
  -- Desert Rose Spa (Closed Mondays)
  ('550e8400-e29b-41d4-a716-446655440302', 1, null, null, true),
  ('550e8400-e29b-41d4-a716-446655440302', 2, '09:00', '18:00', false),
  ('550e8400-e29b-41d4-a716-446655440302', 3, '09:00', '18:00', false),
  ('550e8400-e29b-41d4-a716-446655440302', 4, '09:00', '18:00', false),
  ('550e8400-e29b-41d4-a716-446655440302', 5, '09:00', '18:00', false),
  ('550e8400-e29b-41d4-a716-446655440302', 6, '09:00', '16:00', false),
  ('550e8400-e29b-41d4-a716-446655440302', 0, '10:00', '16:00', false),
  
  -- Kalahari Fitness (Open daily)
  ('550e8400-e29b-41d4-a716-446655440303', 1, '05:30', '21:00', false),
  ('550e8400-e29b-41d4-a716-446655440303', 2, '05:30', '21:00', false),
  ('550e8400-e29b-41d4-a716-446655440303', 3, '05:30', '21:00', false),
  ('550e8400-e29b-41d4-a716-446655440303', 4, '05:30', '21:00', false),
  ('550e8400-e29b-41d4-a716-446655440303', 5, '05:30', '21:00', false),
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

-- Insert sample reviews
INSERT INTO reviews (
  id, business_id, customer_id, rating, title, content, 
  status, is_verified, created_at, published_at
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440501',
    '550e8400-e29b-41d4-a716-446655440301',
    '550e8400-e29b-41d4-a716-446655440201',
    5,
    'Amazing service!',
    'Maria and her team did an incredible job with my hair. The salon is beautiful and the service is top-notch. Highly recommended!',
    'approved',
    true,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440502',
    '550e8400-e29b-41d4-a716-446655440302',
    '550e8400-e29b-41d4-a716-446655440202',
    5,
    'Pure relaxation',
    'The massage at Desert Rose Spa was absolutely divine. The atmosphere is so peaceful and the staff is very professional.',
    'approved',
    true,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440503',
    '550e8400-e29b-41d4-a716-446655440303',
    '550e8400-e29b-41d4-a716-446655440203',
    4,
    'Great gym facilities',
    'Kalahari Fitness has excellent equipment and the personal trainers are very knowledgeable. The group classes are fun too!',
    'approved',
    true,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  );

-- Insert sample bookings
INSERT INTO bookings (
  id, customer_id, business_id, service_id, booking_date, booking_time,
  duration_minutes, service_price, total_amount, status, created_at
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440601',
    '550e8400-e29b-41d4-a716-446655440201',
    '550e8400-e29b-41d4-a716-446655440301',
    '550e8400-e29b-41d4-a716-446655440401',
    CURRENT_DATE + INTERVAL '2 days',
    '10:00',
    60,
    250.00,
    250.00,
    'confirmed',
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440602',
    '550e8400-e29b-41d4-a716-446655440202',
    '550e8400-e29b-41d4-a716-446655440302',
    '550e8400-e29b-41d4-a716-446655440404',
    CURRENT_DATE + INTERVAL '3 days',
    '14:00',
    90,
    380.00,
    380.00,
    'pending',
    NOW()
  );

-- Insert user favorites
INSERT INTO user_favorites (user_id, business_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440301'),
  ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440302'),
  ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440303'),
  ('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440305'); 