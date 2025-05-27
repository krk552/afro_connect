# Debug Email Confirmation Link

## What We Need to Check:

### 1. Copy the Actual Email Link
When you receive the confirmation email:
1. **Right-click** on the "Confirm your email" button/link
2. **Copy link address**
3. **Paste it here** so we can see the exact format

### 2. Expected Link Format
The link should look like one of these:
- `http://localhost:8081/auth/callback?code=XXXXX`
- `http://localhost:8081/auth/callback#access_token=XXXXX&type=signup`
- `http://localhost:8081/auth/callback#error=access_denied&error_code=otp_expired`

### 3. Supabase Redirect URL Configuration
Make sure this URL is added in Supabase:
1. Go to: https://supabase.com/dashboard/project/gvybbjfskvikawpnfhsc/auth/settings
2. Scroll to "Redirect URLs" section
3. Add: `http://localhost:8081/auth/callback`
4. Save settings

### 4. Common Issues:
- **Wrong port**: Email might redirect to `:8080` instead of `:8081`
- **Missing redirect URL**: Not configured in Supabase settings
- **Expired link**: Links expire after a certain time
- **Wrong URL format**: Supabase uses hash fragments, not query params

### 5. Quick Test:
Try signing up with a new email and immediately copy the link from the email before clicking it. 