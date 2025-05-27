import { useState } from "react";
import { Search, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const popularSearches = [
    "Hair Salons", "Cleaning Services", "Home Repairs", "Beauty Spa", "Car Wash"
  ];
  
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-afro-orange via-afro-purple to-afro-blue overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-afro-yellow/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-afro-green/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-2xl"></div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526659666036-c3baab2a014c')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative container mx-auto px-4 py-20 md:py-32 lg:py-40">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="mb-6 animate-slide-in">
            <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Discover Local Businesses in Namibia
            </Badge>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-in delay-200">
            Find & Book Local
            <span className="block bg-gradient-to-r from-afro-yellow to-afro-green bg-clip-text text-transparent">
              Services Instantly
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-in delay-300">
            Connect with trusted local businesses across Namibia. From hair salons to home services, 
            discover, book, and review all in one place.
          </p>
          
          {/* Search form */}
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-8 animate-slide-in delay-500">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl"></div>
              <div className="relative flex flex-col md:flex-row gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 z-10" size={20} />
                  <input
                    type="text"
                    placeholder="Search for salons, shops, services..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-afro-yellow focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center text-white/70 px-3">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">Windhoek</span>
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="bg-afro-green hover:bg-afro-green/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </form>
          
          {/* Popular searches */}
          <div className="animate-slide-in delay-700">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm font-medium">Trending searches:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search, index) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-white/10 text-white hover:bg-white hover:text-afro-orange border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    setSearchQuery(search);
                    navigate(`/search?q=${encodeURIComponent(search)}`);
                  }}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-in delay-1000">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
              <div className="text-white/70 text-sm">Local Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">2K+</div>
              <div className="text-white/70 text-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">50+</div>
              <div className="text-white/70 text-sm">Service Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">24/7</div>
              <div className="text-white/70 text-sm">Online Booking</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
