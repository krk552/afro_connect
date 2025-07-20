# Afro-Connect Developer Handbook

Welcome to the Afro-Connect project! This handbook provides everything you need to know to get started and contribute to the project.

## 🚀 Quick Start for New Developers

### 1. Project Overview
Afro-Connect is a comprehensive local services marketplace designed for African markets. It connects local businesses with customers through an intuitive platform with automated workflows and local payment integration.

### 2. Technology Stack
- **Frontend**: React 18+ with TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Automation**: N8N for workflow automation
- **Communication**: WhatsApp Business API
- **Hosting**: Vercel (frontend), AWS Africa (recommended for backend)

### 3. Getting Started
```bash
# Clone the repository
git clone https://github.com/krk552/afro_connect.git
cd afro_connect

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development
npm run dev
```

## 📁 Project Structure

```
afro-connect/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...             # Custom components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts (Auth, etc.)
│   ├── integrations/       # Third-party integrations
│   │   └── supabase/       # Supabase client and types
│   ├── lib/                # Utility functions
│   └── layouts/            # Layout components
├── supabase/
│   ├── migrations/         # Database migrations
│   ├── functions/          # Edge functions
│   └── config.toml         # Supabase configuration
├── docs/                   # Documentation
├── public/                 # Static assets
└── README.md               # Project overview
```

## 🔧 Key Files to Understand

### Core Application Files
- `src/App.tsx` - Main application component with routing
- `src/main.tsx` - Application entry point
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/integrations/supabase/client.ts` - Supabase client configuration

### Important Pages
- `src/pages/Index.tsx` - Landing page
- `src/pages/BusinessRegistration.tsx` - Business onboarding
- `src/pages/BookingPage.tsx` - Booking flow
- `src/pages/SearchResults.tsx` - Service discovery

### Database
- `supabase/migrations/` - Database schema and migrations
- `src/integrations/supabase/types.ts` - TypeScript types for database

## 🗄️ Database Schema

### Core Tables
1. **users** - User accounts and profiles
2. **categories** - Service categories and subcategories
3. **businesses** - Business profiles and information
4. **services** - Individual services offered by businesses
5. **bookings** - Customer bookings and appointments
6. **reviews** - Customer reviews and ratings
7. **notifications** - System notifications

### Key Relationships
- Users can have multiple businesses (business owners)
- Businesses belong to categories
- Businesses offer multiple services
- Customers can make multiple bookings
- Bookings are linked to services and businesses

## 🔐 Authentication & Security

### User Roles
- **customer** - Regular users who book services
- **business** - Business owners who offer services
- **admin** - Platform administrators

### Row Level Security (RLS)
The application uses Supabase RLS policies for security:
- Users can only access their own data
- Business owners can only manage their own businesses
- Admins have access to all data
- Public access is limited to business listings and categories

### Environment Variables
Key environment variables:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_NAME=Afro-Connect
VITE_APP_URL=http://localhost:8080
```

## 🎨 UI/UX Guidelines

### Design System
- **Framework**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Colors**: Custom color palette optimized for African markets
- **Typography**: System fonts with fallbacks

### Component Guidelines
- Use shadcn/ui components when possible
- Follow mobile-first design principles
- Ensure accessibility compliance
- Maintain consistent spacing and typography

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions
- Optimized for slow internet connections

## 🔄 State Management

### React Query (TanStack Query)
Used for server state management:
- Automatic caching and background updates
- Optimistic updates
- Error handling and retries
- Loading states

### React Context
Used for client state:
- Authentication state
- User preferences
- Global UI state

### Key Hooks
- `useAuth()` - Authentication state and methods
- `useBusinesses()` - Business data management
- `useBookings()` - Booking data management
- `useCategories()` - Category data management

## 🧪 Testing Strategy

### Testing Tools
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Type Checking**: TypeScript strict mode
- **Linting**: ESLint + Prettier

### Testing Guidelines
- Write tests for all new features
- Maintain > 80% code coverage
- Test user interactions, not implementation details
- Use meaningful test descriptions

### Running Tests
```bash
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run type-check    # TypeScript checking
npm run lint          # Linting
```

## 🚀 Performance Optimization

### Current Optimizations
- **Code Splitting**: Lazy loading for routes and components
- **Image Optimization**: Automatic compression and lazy loading
- **Caching**: React Query caching and service worker
- **Bundle Optimization**: Tree shaking and dead code elimination

### Performance Targets
- **Page Load Time**: < 3 seconds on 3G connection
- **Time to Interactive**: < 5 seconds
- **First Contentful Paint**: < 1.5 seconds
- **API Response Time**: < 500ms

### Monitoring
- Vercel Analytics for performance monitoring
- Sentry for error tracking
- Supabase Dashboard for database performance

## 🔌 Integrations

### Supabase
- **Authentication**: User registration, login, social auth
- **Database**: PostgreSQL with real-time subscriptions
- **Storage**: File uploads for images and documents
- **Edge Functions**: Serverless functions for complex operations

### WhatsApp Business API
- Automated booking confirmations
- Reminder notifications
- Customer inquiry management
- Business communication workflows

### Payment Gateways
- **Stripe**: International card payments
- **Paystack**: African payment processing
- **Local Mobile Money**: M-Pesa, MTN Mobile Money, Airtel Money

## 📱 Mobile Optimization

### Mobile-First Features
- Touch-friendly buttons and interactions
- Optimized for small screens
- Fast loading on slow connections
- Offline capability with service worker

### Progressive Web App (PWA)
- Installable on mobile devices
- Offline functionality
- Push notifications
- App-like experience

## 🔧 Development Workflow

### Git Workflow
1. **Feature Branch**: Create feature branch from main
2. **Development**: Develop feature with tests
3. **Code Review**: Submit pull request for review
4. **Testing**: Ensure all tests pass
5. **Merge**: Merge to main after approval

### Commit Guidelines
Use conventional commits:
```
feat: add new booking feature
fix: resolve authentication issue
docs: update README
style: format code
refactor: improve component structure
test: add unit tests for booking
```

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

## 🚀 Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Production
- **Frontend**: Automatic deployment via Vercel
- **Backend**: Supabase production environment
- **Database**: Production PostgreSQL database
- **Monitoring**: Performance and error monitoring

## 🐛 Common Issues & Solutions

### Authentication Issues
- **Problem**: Users can't log in
- **Solution**: Check Supabase URL and anon key in .env
- **Solution**: Verify redirect URLs in Supabase dashboard

### Database Issues
- **Problem**: RLS policies blocking access
- **Solution**: Check RLS policies in Supabase dashboard
- **Solution**: Verify user roles and permissions

### Build Issues
- **Problem**: TypeScript errors
- **Solution**: Run `npm run type-check` to identify issues
- **Solution**: Check for missing dependencies

### Performance Issues
- **Problem**: Slow page loads
- **Solution**: Check bundle size with `npm run build`
- **Solution**: Optimize images and lazy load components

## 📚 Learning Resources

### React & TypeScript
- [React Documentation](https://reactjs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Query Documentation](https://tanstack.com/query)

### Supabase
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### UI/UX
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

### Testing
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/)

## 🤝 Contributing

### Before You Start
1. Read the [Requirements Document](./AFRO_CONNECT_REQUIREMENTS_DOWNLOADABLE.md)
2. Review the [Development Roadmap](./docs/DEVELOPMENT_ROADMAP.md)
3. Check existing issues and discussions
4. Join the project discussions

### Development Process
1. **Plan**: Understand the feature requirements
2. **Design**: Plan the implementation approach
3. **Develop**: Write code with tests
4. **Test**: Ensure all tests pass
5. **Review**: Submit for code review
6. **Deploy**: Deploy to staging/production

### Code Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Document complex functions
- Use meaningful variable names
- Keep functions small and focused

## 📞 Support & Communication

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Documentation**: Check the docs folder for guides
- **Code Review**: Get feedback on your code

### Team Communication
- **GitHub Discussions**: Main communication channel
- **Pull Requests**: Code review and feedback
- **Issues**: Bug tracking and feature requests
- **Wiki**: Project documentation and guides

---

**Welcome to the Afro-Connect team! We're excited to have you on board. 🚀**

*This handbook is a living document. Please contribute to keeping it up to date.*