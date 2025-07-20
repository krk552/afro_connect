# Afro-Connect (Makna) - African Local Services Marketplace

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-blue.svg)](https://tailwindcss.com/)

A comprehensive local services marketplace designed specifically for African markets, connecting local businesses with customers through an intuitive platform that supports booking, payments, and automated communication workflows.

## 🌍 Project Overview

Afro-Connect (Makna) is a modern, mobile-first marketplace platform that enables local businesses to showcase their services and customers to discover, book, and pay for services seamlessly. Built with African markets in mind, the platform supports local payment methods, WhatsApp Business integration, and automated workflow management.

### Key Features

- 🏢 **Business Management**: Complete business registration, service catalog, and booking management
- 📱 **Mobile-First Design**: Optimized for mobile usage patterns in Africa
- 💳 **Local Payment Integration**: Support for M-Pesa, MTN Mobile Money, Airtel Money, and card payments
- 📞 **WhatsApp Integration**: Automated communication workflows via WhatsApp Business API
- 🤖 **Workflow Automation**: N8N-powered automation for booking confirmations and reminders
- 🌐 **Multi-Language Support**: Support for African languages
- 📊 **Analytics Dashboard**: Business insights and performance metrics
- 🔒 **Security & Compliance**: GDPR compliance and local data protection regulations

## 🚀 Tech Stack

### Frontend
- **React 18+** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** + shadcn/ui component library
- **React Query** (TanStack Query) for state management
- **React Router v6** with lazy loading
- **React Hook Form** + Zod validation
- **Lucide React** for icons

### Backend
- **Supabase** (Auth, Database, Storage, Edge Functions)
- **PostgreSQL** with Row Level Security (RLS)
- **Supabase Auth** with social providers
- **Supabase Storage** with CDN
- **Supabase Realtime** subscriptions

### Automation & Communication
- **N8N** for workflow automation
- **WhatsApp Business API** for messaging
- **Resend/SendGrid** for email services
- **Twilio/Africa's Talking** for SMS

### Infrastructure
- **Vercel** for frontend hosting
- **AWS Africa** (recommended) for backend hosting
- **CloudFlare** for CDN and security
- **Custom domain** with SSL certificates

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/krk552/afro_connect.git
   cd afro_connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # App Configuration
   VITE_APP_NAME=Afro-Connect
   VITE_APP_URL=http://localhost:8080
   VITE_APP_ENV=development
   
   # Feature Flags
   VITE_ENABLE_REAL_PAYMENTS=false
   VITE_ENABLE_REAL_TIME_NOTIFICATIONS=true
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration scripts in `supabase/migrations/`
   - Configure Row Level Security (RLS) policies
   - Set up authentication providers

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## 🗄️ Database Setup

### Running Migrations

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Link your project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Run migrations**
   ```bash
   supabase db push
   ```

### Database Schema

The application uses the following core tables:
- `users` - User accounts and profiles
- `categories` - Service categories and subcategories
- `businesses` - Business profiles and information
- `services` - Individual services offered by businesses
- `bookings` - Customer bookings and appointments
- `reviews` - Customer reviews and ratings
- `payments` - Payment transactions
- `notifications` - System notifications

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes | - |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | - |
| `VITE_APP_NAME` | Application name | No | Afro-Connect |
| `VITE_APP_URL` | Application URL | No | http://localhost:8080 |
| `VITE_APP_ENV` | Environment | No | development |
| `VITE_ENABLE_REAL_PAYMENTS` | Enable real payments | No | false |
| `VITE_ENABLE_REAL_TIME_NOTIFICATIONS` | Enable real-time notifications | No | true |

### Feature Flags

The application uses feature flags to control functionality:
- `VITE_ENABLE_REAL_PAYMENTS`: Enable actual payment processing
- `VITE_ENABLE_REAL_TIME_NOTIFICATIONS`: Enable real-time notifications
- `VITE_ENABLE_WHATSAPP`: Enable WhatsApp Business integration
- `VITE_ENABLE_AUTOMATION`: Enable N8N workflow automation

## 📱 Features

### For Businesses
- **Registration & Onboarding**: Multi-step business registration process
- **Service Management**: Create and manage service catalogs
- **Booking Management**: Calendar view and booking status management
- **Customer Communication**: WhatsApp integration for customer inquiries
- **Analytics Dashboard**: Revenue, bookings, and customer insights
- **Payment Processing**: Secure payment handling and commission management

### For Customers
- **Service Discovery**: Advanced search and filtering
- **Booking System**: Real-time availability checking and booking
- **Payment Options**: Multiple payment methods including local options
- **Review System**: Post-service reviews and ratings
- **Favorites**: Save and manage favorite businesses
- **Notifications**: Real-time booking updates and reminders

### For Administrators
- **User Management**: Customer and business account management
- **Business Approval**: Review and approve business registrations
- **Platform Monitoring**: Analytics and performance monitoring
- **Content Management**: Category and content management
- **Support System**: Customer and business support tools

## 🔌 Integrations

### WhatsApp Business API
- Automated booking confirmations
- Reminder notifications
- Customer inquiry management
- Business communication workflows

### Payment Gateways
- **Stripe**: International card payments
- **Paystack**: African payment processing
- **Local Mobile Money**: M-Pesa, MTN Mobile Money, Airtel Money
- **Bank Transfer**: Direct bank integration

### Automation (N8N)
- Booking confirmation workflows
- Reminder automation
- Customer inquiry management
- Review collection automation
- Business onboarding workflows

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Backend Deployment (Supabase)

1. **Deploy to Supabase**
   ```bash
   supabase db push
   supabase functions deploy
   ```

2. **Configure production environment**
   - Update environment variables
   - Configure custom domain
   - Set up SSL certificates

### Recommended Hosting for Africa

For optimal performance in African markets, consider:
- **AWS Africa (Cape Town)**: af-south-1 region
- **Local CDN**: CloudFlare with African edge locations
- **Database**: RDS PostgreSQL in Africa region

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

### Test Coverage
```bash
npm run test:coverage
```

## 📊 Performance

### Optimization Features
- **Code Splitting**: Lazy loading for routes and components
- **Image Optimization**: Automatic image compression and lazy loading
- **Caching**: React Query caching and service worker
- **Bundle Optimization**: Tree shaking and dead code elimination
- **CDN**: Global content delivery network

### Performance Targets
- **Page Load Time**: < 3 seconds on 3G connection
- **Time to Interactive**: < 5 seconds
- **First Contentful Paint**: < 1.5 seconds
- **API Response Time**: < 500ms

## 🔒 Security

### Security Features
- **Authentication**: Supabase Auth with social providers
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row Level Security (RLS) policies
- **Input Validation**: Comprehensive input sanitization
- **HTTPS**: SSL/TLS encryption
- **CORS**: Cross-origin request protection

### Compliance
- **GDPR**: European data protection compliance
- **Local Regulations**: African data protection laws
- **PCI DSS**: Payment card industry compliance
- **Data Sovereignty**: Local data storage requirements

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commits
- Write comprehensive tests
- Update documentation
- Follow the existing code style

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./docs/contributing.md)
- [Requirements Document](./AFRO_CONNECT_REQUIREMENTS_DOWNLOADABLE.md)

## 🏗️ Project Structure

```
afro-connect/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts
│   ├── integrations/       # Third-party integrations
│   ├── lib/                # Utility functions
│   └── layouts/            # Layout components
├── supabase/
│   ├── migrations/         # Database migrations
│   ├── functions/          # Edge functions
│   └── config.toml         # Supabase configuration
├── public/                 # Static assets
├── docs/                   # Documentation
└── scripts/                # Build and deployment scripts
```

## 📈 Roadmap

### Phase 1: MVP (Months 1-3)
- [x] User authentication and registration
- [x] Business registration and approval workflow
- [x] Service listing and management
- [x] Basic booking system
- [x] Payment processing integration
- [x] Review and rating system

### Phase 2: Automation (Months 4-6)
- [ ] WhatsApp Business API integration
- [ ] N8N workflow automation
- [ ] Automated notifications system
- [ ] Inquiry management automation
- [ ] Booking reminders and confirmations

### Phase 3: Advanced Features (Months 7-9)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced search and filters
- [ ] Business insights and reporting
- [ ] Customer segmentation

### Phase 4: Scale & Optimize (Months 10-12)
- [ ] Multi-region deployment
- [ ] Local payment methods integration
- [ ] Advanced security features
- [ ] Performance optimization
- [ ] Market expansion tools

## 📞 Support

- **Documentation**: [Project Wiki](https://github.com/krk552/afro_connect/wiki)
- **Issues**: [GitHub Issues](https://github.com/krk552/afro_connect/issues)
- **Discussions**: [GitHub Discussions](https://github.com/krk552/afro_connect/discussions)
- **Email**: support@afroconnect.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vercel](https://vercel.com/) for hosting and deployment
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [React Query](https://tanstack.com/query) for state management

---

**Built with ❤️ for African markets**