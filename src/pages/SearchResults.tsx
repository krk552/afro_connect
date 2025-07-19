import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign,
  Grid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Loader2,
  Heart,
  Store,
  Users,
  Plus,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { BusinessCardSkeleton } from "@/components/LoadingStates";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

type BusinessWithCategory = Database['public']['Tables']['businesses']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'] | null;
  services: Database['public']['Tables']['services']['Row'][];
  business_hours: Database['public']['Tables']['business_hours']['Row'][];
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const navigate = useNavigate();
  
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Get search filters from URL params
  const categoryFilter = searchParams.get("category") || undefined;
  const locationFilter = searchParams.get("location") || undefined;
  const priceRangeFilter = searchParams.get("priceRange") || undefined;
  const ratingFilter = searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : undefined;

  // Use backend hook with filters - but in a new platform, there are no businesses yet
  const { businesses, loading, error } = useBusinesses({
    search: searchQuery || undefined,
    category: categoryFilter,
    city: locationFilter,
    priceRange: priceRangeFilter as Database['public']['Enums']['price_range_enum'],
    rating: ratingFilter,
    sortBy: sortBy as "rating" | "name" | "newest",
    limit: 50
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams);
  };

  // Since we're a new platform, we'll always show the empty state
  const isEmpty = !businesses || businesses.length === 0;

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search results for "${searchQuery}"` : "Search Businesses"}
              </h1>
              <p className="text-gray-600 mt-1">
                Discover local businesses in Namibia
              </p>
            </div>
            
            <Badge className="bg-afro-orange/10 text-afro-orange border-afro-orange/20 w-fit">
              <Rocket className="w-3 h-3 mr-1" />
              Platform Launching
            </Badge>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search for businesses, services..."
              className="pl-10 pr-4 py-3"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))}
          </div>
        ) : isEmpty ? (
          /* Empty State for New Platform */
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-afro-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="w-12 h-12 text-afro-orange" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {searchQuery ? `No results for "${searchQuery}"` : "No businesses yet"}
              </h2>
              
              <p className="text-gray-600 mb-8">
                {searchQuery 
                  ? "We're still building our business directory. Join this category and start connecting with customers!"
                  : "We're launching soon! Join Makna as a business or customer."
                }
              </p>

              {/* Call to Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* For Business Owners */}
                <Card className="p-6 border-afro-orange/20 bg-gradient-to-br from-orange-50 to-red-50">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-afro-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-6 h-6 text-afro-orange" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Own a Business?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {searchQuery 
                        ? `Be the first to offer "${searchQuery}" services on Makna`
                        : "Register your business and start connecting with customers"
                      }
                    </p>
                    <Button 
                      className="bg-afro-orange hover:bg-afro-orange/90 w-full"
                      onClick={() => navigate('/business/register')}
                    >
                      List Your Business
                    </Button>
                  </div>
                </Card>

                {/* For Customers */}
                <Card className="p-6 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Looking for Services?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Sign up to discover local businesses and get notified when new services become available
                    </p>
                    <Button 
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full"
                      onClick={() => navigate('/signup')}
                    >
                      Sign Up Now
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Popular Categories */}
              <div className="text-left max-w-md mx-auto">
                <h4 className="font-medium text-gray-900 mb-4 text-center">Categories we're looking for:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Beauty & Wellness",
                    "Home Services", 
                    "Automotive",
                    "Food & Dining",
                    "Health & Fitness",
                    "Technology"
                  ].map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2"
                      onClick={() => navigate('/business/register')}
                    >
                      <Plus className="w-3 h-3 mr-2 text-gray-400" />
                      <span className="text-xs">{category}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Platform Benefits */}
              <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3">Why Join Makna?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Easy online presence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Customer booking management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Local customer discovery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Professional business profile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* This would show actual results when businesses exist */
          <div>
            <p>Business results would appear here once we have businesses registered.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
