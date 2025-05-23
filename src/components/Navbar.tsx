
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isMenuOpen ? "bg-white/95 shadow-md backdrop-blur-sm py-3" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center z-10">
          <span className={`text-xl font-display font-bold ${scrolled || isMenuOpen ? "text-primary" : "text-white"}`}>
            AfroBiz<span className={scrolled || isMenuOpen ? "text-accent" : "text-afro-yellow"}>Connect</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/categories">Categories</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/about">About</Link>
          </Button>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <select className="bg-muted rounded-full pl-9 pr-6 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary border-0 shadow-sm appearance-none cursor-pointer">
              <option>Windhoek, Namibia</option>
              <option>Walvis Bay, Namibia</option>
              <option>Swakopmund, Namibia</option>
            </select>
          </div>

          <Button size="sm" className="rounded-full shadow-sm" asChild>
            <Link to="/login">
              <User size={16} className="mr-2" />
              Sign In
            </Link>
          </Button>
        </div>

        <button 
          className="md:hidden z-10 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? 
            <X className={scrolled ? "text-foreground" : "text-white"} /> : 
            <Menu className={scrolled ? "text-foreground" : "text-white"} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 animate-fade-in">
          <div className="flex flex-col p-6 space-y-5">
            <Link to="/categories" className="py-3 px-4 hover:bg-muted rounded-md text-lg">
              Categories
            </Link>
            <Link to="/about" className="py-3 px-4 hover:bg-muted rounded-md text-lg">
              About
            </Link>
            <Link to="/business/register" className="py-3 px-4 hover:bg-muted rounded-md text-lg">
              List Your Business
            </Link>
            <div className="flex items-center py-3 px-4">
              <MapPin className="mr-2 text-muted-foreground" size={16} />
              <select className="bg-muted rounded-lg pl-2 pr-4 py-2 text-lg focus:outline-none focus:ring-1 focus:ring-primary w-full border-0 appearance-none">
                <option>Windhoek, Namibia</option>
                <option>Walvis Bay, Namibia</option>
                <option>Swakopmund, Namibia</option>
              </select>
            </div>
            <div className="pt-6 space-y-3">
              <Button size="lg" className="rounded-full w-full shadow-sm" asChild>
                <Link to="/login">
                  <User size={16} className="mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full w-full shadow-sm" asChild>
                <Link to="/signup">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
