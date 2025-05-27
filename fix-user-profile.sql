-- Fix missing user profile for Karl Kiam
-- This creates the user profile in our custom users table

-- First, let's see what's in auth.users
SELECT 
    id,
    email,
    raw_user_meta_data,
    email_confirmed_at
FROM auth.users 
WHERE email = 'krk552@outlook.com';

-- Check if profile exists in our users table
SELECT * FROM users WHERE email = 'krk552@outlook.com';

-- Create the missing user profile
INSERT INTO users (
    id,
    email,
    first_name,
    last_name,
    phone,
    role,
    email_verified,
    is_active,
    created_at,
    updated_at
) 
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'first_name', 'Karl') as first_name,
    COALESCE(raw_user_meta_data->>'last_name', 'Kiam') as last_name,
    raw_user_meta_data->>'phone' as phone,
    COALESCE(raw_user_meta_data->>'role', 'customer')::user_role as role,
    true as email_verified,
    true as is_active,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users 
WHERE email = 'krk552@outlook.com'
AND id NOT IN (SELECT id FROM users WHERE email = 'krk552@outlook.com');

-- Verify the fix
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    u.email_verified,
    'Profile Created' as status
FROM users u
WHERE u.email = 'krk552@outlook.com'; 