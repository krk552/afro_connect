# Supabase Redirect URL Configuration Guide

## Method 1: Through Dashboard UI

### Navigation Path:
1. **Supabase Dashboard** → **Your Project** → **Authentication** → **Settings**
2. Look for one of these sections:
   - "Redirect URLs"
   - "URL Configuration" 
   - "Site URL"
   - "Additional Redirect URLs"

### What to Add:
```
Site URL: http://localhost:8081
Redirect URLs: http://localhost:8081/auth/callback
```

## Method 2: If UI Method Doesn't Work

### Check Project Settings:
1. Go to **Settings** → **General** (in left sidebar)
2. Look for **"URL Configuration"**
3. Add the redirect URL there

## Method 3: Using Supabase CLI (Alternative)

If the dashboard method doesn't work:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Update auth config
supabase gen types typescript --project-id your-project-id
```

## Method 4: Direct API Configuration

You can also configure this through the Supabase Management API, but the dashboard method is recommended.

## Common Issues:

### Issue 1: Can't Find Redirect URLs Section
- Try refreshing the page
- Check under **Settings** → **General** instead
- Look for **"Auth"** or **"Authentication"** tabs

### Issue 2: Changes Not Saving
- Make sure you click **"Save"** or **"Update"**
- Wait a few seconds for changes to propagate
- Try refreshing the page to verify

### Issue 3: Multiple URLs
If you need multiple redirect URLs, add them like this:
```
http://localhost:8081/auth/callback
http://localhost:3000/auth/callback
https://yourdomain.com/auth/callback
```

## Verification Steps:

1. **Save the configuration**
2. **Wait 30 seconds** for changes to propagate
3. **Try signing up again** with a new email
4. **Check if the email link** now works properly

## What the Email Link Should Look Like:

After proper configuration, the email link should be:
```
http://localhost:8081/auth/callback#access_token=XXXXX&expires_in=3600&refresh_token=XXXXX&token_type=bearer&type=signup
```

Or:
```
http://localhost:8081/auth/callback?code=XXXXX&type=signup
``` 