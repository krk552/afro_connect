# Setup Resend SMTP for AfroBiz Connect

## Why Resend?
- **Developer-friendly** with excellent documentation
- **Generous free tier** (3,000 emails/month)
- **High deliverability** rates
- **Easy setup** with Supabase

## Step 1: Create Resend Account
1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Your Domain (Optional but Recommended)
1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., afrobizconnect.com)
3. Add the DNS records they provide
4. Wait for verification (can take up to 24 hours)

## Step 3: Create API Key
1. Go to "API Keys" in Resend dashboard
2. Click "Create API Key"
3. Name it "AfroBiz Connect Auth"
4. Select "Sending access"
5. Copy the API key (starts with `re_`)

## Step 4: Configure Supabase SMTP
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/gvybbjfskvikawpnfhsc
2. Navigate to **Authentication > Settings**
3. Scroll down to **SMTP Settings**
4. Enable "Enable custom SMTP"
5. Fill in these settings:

```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Pass: [Your Resend API Key]
SMTP Admin Email: noreply@yourdomain.com (or noreply@resend.dev if no custom domain)
```

## Step 5: Test the Setup
1. Save the SMTP settings
2. Try creating a new account in your app
3. Check if the confirmation email arrives

## Alternative: Use Gmail SMTP (Quick Test)
If you want to test immediately with Gmail:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-gmail@gmail.com
SMTP Pass: [App Password - not your regular password]
SMTP Admin Email: your-gmail@gmail.com
```

**Note:** You'll need to enable 2FA and create an App Password in Gmail settings.

## Expected Results
- ✅ Emails will be sent to ANY email address (not just team members)
- ✅ Higher rate limits (3,000/month with Resend free tier)
- ✅ Professional email delivery
- ✅ Email confirmation will work properly 