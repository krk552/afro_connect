-- Disable email confirmation for development
-- This allows users to sign up without needing to confirm their email
-- WARNING: Only use this in development, not production!

-- Note: Email confirmation settings are managed in the Supabase dashboard
-- under Authentication > Settings > Email Auth
-- This SQL script is for reference only

-- For development, you can:
-- 1. Go to Supabase Dashboard > Authentication > Settings
-- 2. Under "Email Auth" section
-- 3. Toggle OFF "Enable email confirmations"
-- 4. Save the settings

-- Alternatively, you can manually confirm users in the database:
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;

-- For this project, we'll keep email confirmation enabled and provide proper user feedback
SELECT 'Email confirmation is currently enabled. Users will need to confirm their email addresses.' as status; 