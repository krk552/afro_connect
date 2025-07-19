import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BookingFormSkeleton } from '@/components/LoadingStates';

// Critical imports that should be loaded immediately
import { AuthProvider } from '@/contexts/AuthContext';
import AuthCallback from '@/pages/AuthCallback';
import OnboardingGuard from '@/components/OnboardingGuard';
import MainLayout from '@/layouts/MainLayout';

// Lazy load all other pages to reduce initial bundle size
const Index = React.lazy(() => import('@/pages/Index'));
const Categories = React.lazy(() => import('@/pages/Categories'));
const CategoryPage = React.lazy(() => import('@/pages/CategoryPage'));
const BusinessListing = React.lazy(() => import('@/pages/BusinessListing'));
const BusinessDetails = React.lazy(() => import('@/pages/BusinessDetails'));
const BusinessDashboard = React.lazy(() => import('@/pages/BusinessDashboard'));
const BookingPage = React.lazy(() => import('@/pages/BookingPage'));
const BookingConfirmation = React.lazy(() => import('@/pages/BookingConfirmation'));
const UserProfile = React.lazy(() => import('@/pages/UserProfile'));
const Favorites = React.lazy(() => import('@/pages/Favorites'));
const BookingHistory = React.lazy(() => import('@/pages/BookingHistory'));
const SearchResults = React.lazy(() => import('@/pages/SearchResults'));
const AboutPage = React.lazy(() => import('@/pages/AboutPage'));
const ContactPage = React.lazy(() => import('@/pages/ContactPage'));
const OnboardingPage = React.lazy(() => import('@/pages/OnboardingPage'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const SignupPage = React.lazy(() => import('@/pages/SignupPage'));
const BusinessRegistration = React.lazy(() => import('@/pages/BusinessRegistration'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

// Enhanced loading component with better UX
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
    <div className="text-center space-y-4">
      <BookingFormSkeleton />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Auth Callback Route (no layout) */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Onboarding Route (no layout) */}
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* Auth Routes (no main layout) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/business/register" element={<BusinessRegistration />} />

              {/* Main Layout Routes */}
              <Route element={<OnboardingGuard><MainLayout /></OnboardingGuard>}>
                <Route path="/" element={<Index />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                <Route path="/businesses" element={<BusinessListing />} />
                <Route path="/business/:id" element={<BusinessDetails />} />
                <Route path="/business/dashboard" element={<BusinessDashboard />} />
                <Route path="/book/:id" element={<BookingPage />} />
                <Route path="/booking/confirmation/:bookingId" element={<BookingConfirmation />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/bookings" element={<BookingHistory />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/notifications" element={
                  <div className="pt-16 pb-24">
                    <div className="container mx-auto px-4">
                      <h1 className="text-2xl font-bold">All Notifications</h1>
                      <p className="text-muted-foreground mt-2">Comprehensive notification management coming soon...</p>
                    </div>
                  </div>
                } />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
