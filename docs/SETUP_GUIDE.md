# Afro-Connect Developer Setup Guide

This guide will help you set up the Afro-Connect project for development.

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for database management)

### 2. Clone and Install

```bash
# Clone the repository
git clone https://github.com/krk552/afro_connect.git
cd afro_connect

# Install dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

### 4. Supabase Setup

#### Create Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Note your project URL and anon key
3. Update your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Database Setup

1. **Install Supabase CLI** (optional):
   ```bash
   npm install -g supabase
   ```

2. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Run migrations**:
   ```bash
   supabase db push
   ```

#### Manual Database Setup

If you prefer to set up the database manually:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the migration scripts from `supabase/migrations/` in order

### 5. Start Development

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
VITE_APP_NAME=Afro-Connect
VITE_APP_URL=http://localhost:8080
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_REAL_PAYMENTS=false
VITE_ENABLE_REAL_TIME_NOTIFICATIONS=true

# Optional Integrations
VITE_WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
VITE_WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
VITE_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
VITE_RESEND_API_KEY=your-resend-api-key
```

### Supabase Configuration

#### Authentication Setup

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL: `http://localhost:8080`
3. Add redirect URLs:
   - `http://localhost:8080/auth/callback`
   - `http://localhost:8080/login`
   - `http://localhost:8080/signup`

#### Row Level Security (RLS)

The application uses RLS policies for security. Ensure these are enabled:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
```

#### Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create buckets:
   - `business-logos` (for business logos)
   - `business-covers` (for business cover images)
   - `user-avatars` (for user profile pictures)

3. Set up storage policies:

```sql
-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to avatars
CREATE POLICY "Public read access to avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'user-avatars');
```

## 🗄️ Database Schema

### Core Tables

The application uses the following main tables:

#### users
- User accounts and profiles
- Authentication information
- Role-based access control

#### categories
- Service categories and subcategories
- Hierarchical structure
- Localization support

#### businesses
- Business profiles and information
- Location and contact details
- Verification status

#### services
- Individual services offered by businesses
- Pricing and availability
- Service descriptions

#### bookings
- Customer bookings and appointments
- Status tracking
- Payment information

#### reviews
- Customer reviews and ratings
- Moderation system
- Business reputation

### Sample Data

To populate the database with sample data:

```sql
-- Insert sample categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Beauty & Wellness', 'beauty-wellness', 'Hair, makeup, spa, and wellness services', 'sparkles', '#FF6B6B'),
('Health & Medical', 'health-medical', 'Medical, dental, and health services', 'heart', '#4ECDC4'),
('Automotive', 'automotive', 'Car repair, maintenance, and services', 'car', '#45B7D1'),
('Home Services', 'home-services', 'Cleaning, repair, and maintenance', 'home', '#96CEB4'),
('Professional Services', 'professional-services', 'Legal, accounting, and consulting', 'briefcase', '#FFEAA7');

-- Insert sample admin user
INSERT INTO users (email, first_name, last_name, role) VALUES
('admin@afroconnect.com', 'Admin', 'User', 'admin');
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

### Test Environment

Create a separate test database:

1. Create a new Supabase project for testing
2. Update test environment variables
3. Run migrations on test database

## 🚀 Deployment

### Development Deployment

```bash
# Build for development
npm run build

# Preview build
npm run preview
```

### Production Deployment

1. **Frontend (Vercel)**:
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Backend (Supabase)**:
   ```bash
   supabase db push
   supabase functions deploy
   ```

## 🔍 Debugging

### Common Issues

#### Authentication Issues
- Check Supabase URL and anon key
- Verify redirect URLs in Supabase dashboard
- Check browser console for errors

#### Database Issues
- Ensure RLS policies are correctly configured
- Check migration scripts have been run
- Verify table structure matches expectations

#### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`
- Verify environment variables are set

### Debug Tools

- **React Developer Tools**: Browser extension for React debugging
- **Supabase Dashboard**: Database and authentication monitoring
- **Vercel Analytics**: Performance monitoring
- **Browser DevTools**: Network and console debugging

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

## 🤝 Getting Help

- Check the [GitHub Issues](https://github.com/krk552/afro_connect/issues)
- Join our [Discussions](https://github.com/krk552/afro_connect/discussions)
- Review the [Requirements Document](./AFRO_CONNECT_REQUIREMENTS_DOWNLOADABLE.md)

---

**Happy coding! 🚀**