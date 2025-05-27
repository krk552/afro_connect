-- Quick fix to manually confirm the stuck user
-- Run this in Supabase SQL Editor

-- First, see what users are pending
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'Pending'
        ELSE 'Confirmed'
    END as status
FROM auth.users 
ORDER BY created_at DESC
LIMIT 5;

-- Manually confirm the most recent user (replace email with your test email)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'YOUR_EMAIL_HERE' 
AND email_confirmed_at IS NULL;

-- Verify the fix
SELECT 
    id,
    email,
    email_confirmed_at,
    'Now Confirmed' as status
FROM auth.users 
WHERE email = 'YOUR_EMAIL_HERE'; 