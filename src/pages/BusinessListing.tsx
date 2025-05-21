import { useState } from "react";
import { Building2, Filter, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  
  // Empty businesses array
  const businesses: any[] = [];

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

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-xl font-medium">No businesses found</h2>
          <p className="mt-2 text-muted-foreground">
            There are no businesses registered yet. Check back later or be the first to register.
          </p>
          <Button className="mt-6" asChild>
            <a href="/business-registration">Register Your Business</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessListing;
