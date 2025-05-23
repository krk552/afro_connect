
import { useState } from "react";
import { Building2, Filter, List, LayoutGrid, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  
  // Empty businesses array - ensuring no mock data
  const businesses: any[] = [];

  return (
    <div className="pt-20 pb-28">
      <div className="container mx-auto px-4">
        <div className="my-8">
          <h1 className="text-3xl font-bold mb-3">All Businesses</h1>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for businesses, services..."
                className="pr-10 h-11"
              />
            </div>
            <Button className="h-11 px-6">Search</Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center shadow-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <div className="flex border rounded-md overflow-hidden shadow-sm">
              <Button 
                variant={view === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
                className="rounded-none border-0"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={view === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                className="rounded-none border-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-3 hidden sm:inline">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 shadow-sm">
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
          <Card className="mb-6 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-medium text-lg">Filter Results</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
                  Close
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="salons" className="mr-2 h-4 w-4" />
                      <label htmlFor="salons">Hair & Beauty</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="cleaning" className="mr-2 h-4 w-4" />
                      <label htmlFor="cleaning">Cleaning</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="auto" className="mr-2 h-4 w-4" />
                      <label htmlFor="auto">Auto Services</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="events" className="mr-2 h-4 w-4" />
                      <label htmlFor="events">Events</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Distance</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="radio" name="distance" id="dist1" className="mr-2 h-4 w-4" />
                      <label htmlFor="dist1">Less than 1 km</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="distance" id="dist2" className="mr-2 h-4 w-4" />
                      <label htmlFor="dist2">1 - 3 km</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="distance" id="dist3" className="mr-2 h-4 w-4" />
                      <label htmlFor="dist3">3 - 5 km</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="distance" id="dist4" className="mr-2 h-4 w-4" />
                      <label htmlFor="dist4">Over 5 km</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Rating</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="rating5" className="mr-2 h-4 w-4" />
                      <label htmlFor="rating5">5 stars</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="rating4" className="mr-2 h-4 w-4" />
                      <label htmlFor="rating4">4+ stars</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="rating3" className="mr-2 h-4 w-4" />
                      <label htmlFor="rating3">3+ stars</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="feature1" className="mr-2 h-4 w-4" />
                      <label htmlFor="feature1">Online Booking</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="feature2" className="mr-2 h-4 w-4" />
                      <label htmlFor="feature2">Free WiFi</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="feature3" className="mr-2 h-4 w-4" />
                      <label htmlFor="feature3">Deals & Offers</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <Button variant="outline" className="shadow-sm">Clear All</Button>
                <Button className="shadow-sm">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gray-50 border-0 shadow-sm">
          <div className="text-center py-16 md:py-20">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto shadow-sm">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-medium">No businesses available yet</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Be the first to register your business on AfroBiz Connect and connect with local customers.
            </p>
            <Button className="mt-8 shadow-sm" asChild>
              <a href="/business/register">Register Your Business</a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BusinessListing;
