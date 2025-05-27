-- Cleanup pending users for development testing
-- WARNING: Only use this in development, not production!

-- View all pending users (not confirmed)
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
WHERE email_confirmed_at IS NULL
ORDER BY created_at DESC;

-- Option 1: Delete specific pending user by email (DEVELOPMENT ONLY)
-- Uncomment and replace email to use:
-- DELETE FROM auth.users WHERE email = 'test@example.com' AND email_confirmed_at IS NULL;

-- Option 2: Delete ALL pending users (DEVELOPMENT ONLY)
-- Uncomment to use (BE VERY CAREFUL):
-- DELETE FROM auth.users WHERE email_confirmed_at IS NULL;

-- Option 3: Manually confirm a specific user (safer option)
-- Uncomment and replace email to use:
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email = 'test@example.com' AND email_confirmed_at IS NULL;

-- Option 4: Manually confirm ALL pending users (for testing)
-- Uncomment to use:
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email_confirmed_at IS NULL;

-- After running any of the above, check the results:
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