# Quick Gmail SMTP Setup for Testing

## Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Security > 2-Step Verification
3. Enable 2FA if not already enabled

## Step 2: Create App Password
1. Go to Google Account > Security
2. Under "2-Step Verification", click "App passwords"
3. Select "Mail" and "Other (custom name)"
4. Name it "AfroBiz Connect"
5. Copy the 16-character password (no spaces)

## Step 3: Configure Supabase
1. Go to: https://supabase.com/dashboard/project/your-project-id/auth/settings
2. Scroll to "SMTP Settings"
3. Enable "Enable custom SMTP"
4. Enter:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-gmail@gmail.com
SMTP Pass: [16-character app password]
SMTP Admin Email: your-gmail@gmail.com
```

## Step 4: Test
1. Save settings
2. Try signing up with any email address
3. Check if confirmation email is sent

**Note:** This is for testing only. For production, use a professional service like Resend. 