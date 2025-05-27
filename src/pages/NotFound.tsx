import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-br from-afro-orange/5 via-afro-purple/5 to-afro-blue/5">
        <div className="text-center max-w-2xl">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-afro-orange to-afro-purple bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-afro-yellow/20 rounded-full blur-2xl animate-pulse"></div>
          </div>
          
          {/* Main content */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The page you're looking for seems to have wandered off. 
              Let's get you back to discovering amazing local businesses in Namibia!
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button size="lg" asChild className="bg-afro-green hover:bg-afro-green/90 shadow-lg">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild className="shadow-sm">
                <Link to="/search" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Businesses
                </Link>
              </Button>
            </div>
            
            {/* Quick links */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-muted-foreground mb-4">
                Or explore these popular sections:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/categories" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Categories
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/businesses">
                    Featured Businesses
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/about">
                    About Us
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/contact">
                    Contact
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-afro-pink/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-afro-teal/10 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
