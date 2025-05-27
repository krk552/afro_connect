import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, MapPin, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import NotificationSystem from "./NotificationSystem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, profile, signOut, loading } = useAuth();

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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
  };

  // Get user display info
  const getUserDisplayInfo = () => {
    if (profile) {
      return {
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        avatar: profile.profile_image_url,
        isBusinessOwner: profile.role === 'business_owner'
      };
    }
    if (user) {
      return {
        name: user.user_metadata?.first_name ? 
          `${user.user_metadata.first_name} ${user.user_metadata.last_name}` : 
          user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: user.user_metadata?.avatar_url,
        isBusinessOwner: user.user_metadata?.role === 'business_owner'
      };
    }
    return null;
  };

  const userInfo = getUserDisplayInfo();
  const isAuthenticated = !!user && !loading;

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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/categories">Categories</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/about">About</Link>
          </Button>
          
          {/* Quick Search */}
          <Button variant="ghost" size="sm" asChild>
            <Link to="/search">
              <Search size={16} className="mr-2" />
              Search
            </Link>
          </Button>
          
          {/* Location Selector */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <select className="bg-muted rounded-full pl-9 pr-6 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary border-0 shadow-sm appearance-none cursor-pointer">
              <option>Windhoek, Namibia</option>
              <option>Walvis Bay, Namibia</option>
              <option>Swakopmund, Namibia</option>
              <option>Oshakati, Namibia</option>
              <option>Rundu, Namibia</option>
              <option>Katima Mulilo, Namibia</option>
            </select>
          </div>

          {/* Authentication Section */}
          {isAuthenticated && userInfo ? (
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <NotificationSystem />
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                      <AvatarFallback>{userInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{userInfo.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {userInfo.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites">Favorites</Link>
                  </DropdownMenuItem>
                  {userInfo.isBusinessOwner && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/business/dashboard">Business Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/business/register">List Your Business</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/business/register">List Your Business</Link>
              </Button>
              <Button size="sm" className="rounded-full shadow-sm" asChild>
                <Link to="/login">
                  <User size={16} className="mr-2" />
                  Sign In
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
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
          <div className="flex flex-col p-6 space-y-5 overflow-y-auto h-[calc(100vh-4rem)]">
            {/* User Section for Mobile */}
            {isAuthenticated && userInfo && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                  <AvatarFallback>{userInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userInfo.name}</p>
                  <p className="text-sm text-muted-foreground">{userInfo.email}</p>
                </div>
                <div className="ml-auto">
                  <NotificationSystem />
                </div>
              </div>
            )}
            
            <Link to="/search" className="py-3 px-4 hover:bg-muted rounded-md text-lg flex items-center">
              <Search size={20} className="mr-3" />
              Search
            </Link>
            <Link to="/categories" className="py-3 px-4 hover:bg-muted rounded-md text-lg">
              Categories
            </Link>
            <Link to="/about" className="py-3 px-4 hover:bg-muted rounded-md text-lg">
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="py-3 px-4 hover:bg-muted rounded-md text-lg">
                  My Profile
                </Link>
                <Link to="/bookings" className="py-3 px-4 hover:bg-muted rounded-md text-lg">
                  My Bookings
                </Link>
                <Link to="/favorites" className="py-3 px-4 hover:bg-muted rounded-md text-lg">
                  Favorites
                </Link>
                {userInfo.isBusinessOwner && (
                  <Link to="/business/dashboard" className="py-3 px-4 hover:bg-muted rounded-md text-lg">
                    Business Dashboard
                  </Link>
                )}
                <Link to="/business/register" className="py-3 px-4 hover:bg-muted rounded-md text-lg">
                  List Your Business
                </Link>
              </>
            ) : (
              <Link to="/business/register" className="py-3 px-4 hover:bg-muted rounded-md text-lg">
                List Your Business
              </Link>
            )}
            
            {/* Location Selector */}
            <div className="flex items-center py-3 px-4">
              <MapPin className="mr-2 text-muted-foreground" size={16} />
              <select className="bg-muted rounded-lg pl-2 pr-4 py-2 text-lg focus:outline-none focus:ring-1 focus:ring-primary w-full border-0 appearance-none">
                <option>Windhoek, Namibia</option>
                <option>Walvis Bay, Namibia</option>
                <option>Swakopmund, Namibia</option>
                <option>Oshakati, Namibia</option>
                <option>Rundu, Namibia</option>
                <option>Katima Mulilo, Namibia</option>
              </select>
            </div>
            
            {/* Authentication Buttons */}
            <div className="pt-6 space-y-3">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full w-full shadow-sm" 
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
