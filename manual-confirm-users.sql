-- Manual email confirmation for development
-- This script confirms all pending users who haven't confirmed their email

-- First, let's see pending users
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'Pending Confirmation'
        ELSE 'Confirmed'
    END as status
FROM auth.users 
ORDER BY created_at DESC;

-- Confirm all pending users (uncomment the line below to execute)
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;

-- To confirm a specific user by email:
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'user@example.com' AND email_confirmed_at IS NULL; 