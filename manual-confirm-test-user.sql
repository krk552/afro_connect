-- Manual confirmation for testing while debugging email issues
-- This allows you to test the app functionality immediately

-- First, let's see what users exist and their confirmation status
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
ORDER BY created_at DESC
LIMIT 10;

-- To manually confirm a specific user (replace with actual email):
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email = 'your-test-email@example.com' 
-- AND email_confirmed_at IS NULL;

-- To confirm ALL pending users (for testing only):
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email_confirmed_at IS NULL; 