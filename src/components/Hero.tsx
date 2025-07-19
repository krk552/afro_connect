import { useState } from "react";
import { Search, MapPin, Sparkles, TrendingUp, Users, Rocket, Gift } from "lucide-react";
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

  // Realistic launch benefits - no fake numbers
  const launchBenefits = [
    { icon: Rocket, label: "Launching in Namibia" },
    { icon: Gift, label: "Free to join" },
    { icon: Users, label: "Connecting local communities" }
  ];

  // Service categories people can search for
  const searchSuggestions = [
    "hair salon", "cleaning service", "mechanic", "restaurant"
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
          {/* Launch Badge */}
          <div className="mb-6 animate-slide-in">
            <Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2">
              <Sparkles className="w-3 h-3 mr-1" />
              🚀 Now Launching in Namibia
            </Badge>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-in delay-200">
            Find Local Services
            <span className="block bg-gradient-to-r from-afro-yellow to-afro-green bg-clip-text text-transparent">
              Near You
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-in delay-300">
            Discover and connect with local businesses across Namibia. 
            <strong className="text-afro-yellow"> Join us in building something amazing together.</strong>
          </p>

          {/* Launch benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-slide-in delay-400">
            {launchBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-white/80 text-sm">
                <benefit.icon className="w-4 h-4 mr-2 text-afro-yellow" />
                <span>{benefit.label}</span>
              </div>
            ))}
          </div>
          
          {/* Search form */}
          <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-12 animate-slide-in delay-500">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl"></div>
              <div className="relative flex flex-col md:flex-row gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 z-10" size={20} />
                  <input
                    type="text"
                    placeholder={`Try "${searchSuggestions[Math.floor(Math.random() * searchSuggestions.length)]}" or browse categories`}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-afro-yellow focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center text-white/70 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">Windhoek</span>
                  </div>
                  <Button 
                    type="submit" 
                    size="lg"
                    className="bg-afro-yellow hover:bg-afro-yellow/90 text-black font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Call to action for new platform */}
          <div className="mb-8 animate-slide-in delay-600">
            <p className="text-white/80 text-sm mb-4">Join us in building Namibia's local business community:</p>
            <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
              <span>• Discover local services</span>
              <span>• Support local businesses</span>
              <span>• Connect with your community</span>
            </div>
          </div>

          {/* Business owner CTA */}
          <div className="flex flex-wrap justify-center gap-4 text-white/80 animate-slide-in delay-700">
            <div className="text-center">
              <div className="text-sm opacity-80">Own a business?</div>
              <Button 
                variant="outline" 
                className="mt-2 bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
                onClick={() => navigate('/business/register')}
              >
                Join as a Pro
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
