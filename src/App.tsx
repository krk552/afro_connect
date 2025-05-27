import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Page imports
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BusinessDetails from "./pages/BusinessDetails";
import BusinessListing from "./pages/BusinessListing";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserProfile from "./pages/UserProfile";
import BookingConfirmation from "./pages/BookingConfirmation";
import BusinessRegistration from "./pages/BusinessRegistration";
import BusinessDashboard from "./pages/BusinessDashboard";
import Favorites from "./pages/Favorites";
import SearchResults from "./pages/SearchResults";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BookingHistory from "./pages/BookingHistory";
import AuthCallback from "./pages/AuthCallback";
import OnboardingPage from "./pages/OnboardingPage";

// Layout components
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import OnboardingGuard from "./components/OnboardingGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Callback Route (no layout) */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Onboarding Route (no layout) */}
            <Route path="/onboarding" element={<OnboardingPage />} />

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
              <Route path="/notifications" element={<div className="pt-16 pb-24"><div className="container mx-auto px-4"><h1 className="text-2xl font-bold">All Notifications</h1><p className="text-muted-foreground mt-2">Comprehensive notification management coming soon...</p></div></div>} />
              <Route path="/support" element={<div className="pt-16 pb-24"><div className="container mx-auto px-4"><h1 className="text-2xl font-bold">Support Center</h1><p className="text-muted-foreground mt-2">Help and support resources coming soon...</p></div></div>} />
              <Route path="/messages/:id?" element={<div className="pt-16 pb-24"><div className="container mx-auto px-4"><h1 className="text-2xl font-bold">Messages</h1><p className="text-muted-foreground mt-2">Business messaging system coming soon...</p></div></div>} />
              <Route path="/review/:bookingId" element={<div className="pt-16 pb-24"><div className="container mx-auto px-4"><h1 className="text-2xl font-bold">Leave a Review</h1><p className="text-muted-foreground mt-2">Review system coming soon...</p></div></div>} />
              <Route path="/payment/receipt/:bookingId" element={<div className="pt-16 pb-24"><div className="container mx-auto px-4"><h1 className="text-2xl font-bold">Payment Receipt</h1><p className="text-muted-foreground mt-2">Receipt details coming soon...</p></div></div>} />
            </Route>

            {/* Auth Layout Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/business/register" element={<BusinessRegistration />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
