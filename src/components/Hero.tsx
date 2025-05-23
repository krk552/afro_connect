
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  
  return (
    <section className="relative bg-gradient-to-br from-afro-orange to-afro-purple overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526659666036-c3baab2a014c')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6">
            Find Local Services in Namibia
          </h1>
          <p className="text-base md:text-xl text-white/90 mb-6 md:mb-10">
            Discover, book, and review the best local businesses all in one place
          </p>
          
          <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for salons, shops, services..."
                  className="search-input w-full pl-12 py-3 px-4 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="bg-afro-green hover:bg-afro-green/90 text-white rounded-full">
                Search
              </Button>
            </div>
          </form>
          
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2">
            <span className="text-white font-medium mr-1">Popular:</span>
            <Button variant="outline" size="sm" className="rounded-full bg-white/20 text-white hover:bg-white hover:text-afro-orange border-transparent">
              Hair Salons
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-white/20 text-white hover:bg-white hover:text-afro-orange border-transparent">
              Cleaning
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-white/20 text-white hover:bg-white hover:text-afro-orange border-transparent">
              Home Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
