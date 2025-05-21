
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Page imports
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BusinessDetails from "./pages/BusinessDetails";
import BusinessListing from "./pages/BusinessListing";
import CategoryPage from "./pages/CategoryPage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserProfile from "./pages/UserProfile";
import BookingConfirmation from "./pages/BookingConfirmation";
import BusinessRegistration from "./pages/BusinessRegistration";
import Favorites from "./pages/Favorites";
import SearchResults from "./pages/SearchResults";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BookingHistory from "./pages/BookingHistory";

// Layout components
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Layout Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/categories/:categoryId" element={<CategoryPage />} />
            <Route path="/businesses" element={<BusinessListing />} />
            <Route path="/business/:id" element={<BusinessDetails />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/booking/confirmation/:id" element={<BookingConfirmation />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/bookings" element={<BookingHistory />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
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
  </QueryClientProvider>
);

export default App;
