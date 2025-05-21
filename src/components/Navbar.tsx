
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, User, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white bg-opacity-95 shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl md:text-2xl font-display font-bold text-primary">
            AfroBiz<span className="text-accent">Connect</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/categories">Categories</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/about">About</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/business">For Businesses</Link>
          </Button>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <select className="bg-muted rounded-full pl-9 pr-4 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Lagos, Nigeria</option>
              <option>Nairobi, Kenya</option>
              <option>Accra, Ghana</option>
            </select>
          </div>

          <Button size="sm" className="rounded-full" asChild>
            <Link to="/login">
              <User size={16} className="mr-2" />
              Sign In
            </Link>
          </Button>
        </div>

        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-slide-in">
          <div className="flex flex-col p-4 space-y-3">
            <Link to="/categories" className="py-2 px-4 hover:bg-muted rounded-md" onClick={() => setIsMenuOpen(false)}>
              Categories
            </Link>
            <Link to="/about" className="py-2 px-4 hover:bg-muted rounded-md" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link to="/business" className="py-2 px-4 hover:bg-muted rounded-md" onClick={() => setIsMenuOpen(false)}>
              For Businesses
            </Link>
            <div className="flex items-center py-2 px-4">
              <MapPin className="mr-2 text-muted-foreground" size={16} />
              <select className="bg-muted rounded-lg pl-2 pr-4 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Lagos, Nigeria</option>
                <option>Nairobi, Kenya</option>
                <option>Accra, Ghana</option>
              </select>
            </div>
            <Button size="sm" className="rounded-full" asChild>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <User size={16} className="mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
