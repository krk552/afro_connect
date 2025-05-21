
import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Filter, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const BusinessListing = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Placeholder data
  const businesses = [
    {
      id: 1,
      name: "Namibia Hair Studio",
      category: "Hair Salon",
      rating: 4.7,
      reviews: 98,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      location: "Independence Ave, Windhoek",
      distance: "1.2 km",
    },
    {
      id: 2,
      name: "Peach Tree Restaurant",
      category: "Restaurant",
      rating: 4.5,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      location: "Sam Nujoma Dr, Windhoek",
      distance: "0.8 km",
    },
    {
      id: 3,
      name: "Clean & Clear Services",
      category: "Cleaning",
      rating: 4.3,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
      location: "Robert Mugabe Ave, Windhoek",
      distance: "1.5 km",
    },
    {
      id: 4,
      name: "AutoFix Garage",
      category: "Auto Services",
      rating: 4.6,
      reviews: 53,
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e",
      location: "Independence Ave, Windhoek",
      distance: "2.3 km",
    },
    {
      id: 5,
      name: "Savanna Cafe",
      category: "Restaurant",
      rating: 4.8,
      reviews: 112,
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
      location: "Mandume Ndemufayo Ave, Windhoek",
      distance: "1.7 km",
    },
    {
      id: 6,
      name: "Tech Repairs",
      category: "Electronics",
      rating: 4.2,
      reviews: 45,
      image: "https://images.unsplash.com/photo-1588702547919-26089e690ecc",
      location: "Hosea Kutako Dr, Windhoek",
      distance: "3.1 km",
    },
  ];

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {businesses.map((business) => (
        <Link to={`/business/${business.id}`} key={business.id}>
          <Card className="card-hover overflow-hidden h-full">
            <div className="relative h-48">
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 bg-primary text-white text-xs font-medium m-2 px-2 py-1 rounded-full">
                {business.category}
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h2 className="font-bold">{business.name}</h2>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium">{business.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{business.location}</span>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {business.reviews} reviews
                </span>
                <span className="text-xs">{business.distance}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {businesses.map((business) => (
        <Link to={`/business/${business.id}`} key={business.id}>
          <Card className="card-hover overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-40 h-32 relative">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 bg-primary text-white text-xs font-medium m-2 px-2 py-1 rounded-full">
                  {business.category}
                </div>
              </div>
              
              <CardContent className="p-4 flex-1">
                <div className="flex justify-between">
                  <h2 className="font-bold">{business.name}</h2>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-medium">{business.rating}</span>
                    <span className="text-muted-foreground ml-1">({business.reviews})</span>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{business.location}</span>
                  <span className="mx-1">•</span>
                  <span>{business.distance}</span>
                </div>
                
                <div className="mt-2">
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="my-6">
          <h1 className="text-2xl font-bold mb-2">All Businesses</h1>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for businesses, services..."
                className="pr-10"
              />
            </div>
            <Button>Search</Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={view === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
                className="rounded-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={view === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2 hidden sm:inline">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="reviews">Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isFilterOpen && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Filter Results</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
                  Close
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Categories</h4>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input type="checkbox" id="restaurants" className="mr-2" />
                      <label htmlFor="restaurants">Restaurants</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="salons" className="mr-2" />
                      <label htmlFor="salons">Hair & Beauty</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="cleaning" className="mr-2" />
                      <label htmlFor="cleaning">Cleaning</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="auto" className="mr-2" />
                      <label htmlFor="auto">Auto Services</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Distance</h4>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input type="radio" name="distance" id="dist1" className="mr-2" />
                      <label htmlFor="dist1">Less than 1 km</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="distance" id="dist2" className="mr-2" />
                      <label htmlFor="dist2">1 - 3 km</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="distance" id="dist3" className="mr-2" />
                      <label htmlFor="dist3">3 - 5 km</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="distance" id="dist4" className="mr-2" />
                      <label htmlFor="dist4">Over 5 km</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Rating</h4>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input type="checkbox" id="rating5" className="mr-2" />
                      <label htmlFor="rating5">5 stars</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="rating4" className="mr-2" />
                      <label htmlFor="rating4">4+ stars</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="rating3" className="mr-2" />
                      <label htmlFor="rating3">3+ stars</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Features</h4>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input type="checkbox" id="feature1" className="mr-2" />
                      <label htmlFor="feature1">Online Booking</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="feature2" className="mr-2" />
                      <label htmlFor="feature2">Free WiFi</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="feature3" className="mr-2" />
                      <label htmlFor="feature3">Deals & Offers</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline">Clear All</Button>
                <Button>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {view === "grid" ? renderGridView() : renderListView()}
        
        <div className="mt-8 flex justify-center">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessListing;
