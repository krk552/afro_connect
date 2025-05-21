
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search for:", searchQuery);
    // In a real application, we would navigate to search results
  };
  
  return (
    <section className="relative bg-gradient-to-br from-afro-orange to-afro-purple overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526659666036-c3baab2a014c')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative container mx-auto px-4 py-32 md:py-40">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover and Connect with Local African Businesses
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10">
            Find, book, and review the best local services all in one place - restaurants, salons, 
            home services and more.
          </p>
          
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for restaurants, salons, shops..."
                  className="search-input pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="bg-afro-green hover:bg-afro-green/90 text-white">
                Search
              </Button>
            </div>
          </form>
          
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-white font-medium mr-2">Popular:</span>
            <Button variant="outline" size="sm" className="rounded-full bg-white/20 text-white hover:bg-white hover:text-afro-orange border-transparent">
              Restaurants
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-white/20 text-white hover:bg-white hover:text-afro-orange border-transparent">
              Hair Salons
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-white/20 text-white hover:bg-white hover:text-afro-orange border-transparent">
              Cleaning
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-white/20 text-white hover:bg-white hover:text-afro-orange border-transparent">
              Repair
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
