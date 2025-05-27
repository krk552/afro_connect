import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Filter, 
  List, 
  LayoutGrid, 
  MapPin, 
  Search,
  Star,
  Heart,
  Clock,
  Loader2
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
import { useBusinesses } from "@/hooks/useBusinesses";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type BusinessWithCategory = Database['public']['Tables']['businesses']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'] | null;
  services: Database['public']['Tables']['services']['Row'][];
  business_hours: Database['public']['Tables']['business_hours']['Row'][];
};

const BusinessListing = () => {
  const { user } = useAuth();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Use backend hook to get all businesses
  const { businesses, loading, error } = useBusinesses({
    sortBy: sortBy as "rating" | "name" | "newest",
    search: searchQuery || undefined,
    limit: 100
  });

  const { isFavorite, toggleFavorite } = useFavorites();

  const handleSearch = () => {
    // The search is handled automatically by the useBusinesses hook
    // when searchQuery changes
  };

  const handleToggleFavorite = async (businessId: string, businessName: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add businesses to your favorites",
        variant: "destructive",
      });
      return;
    }

    const result = await toggleFavorite(businessId);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: isFavorite(businessId) ? "Added to favorites" : "Removed from favorites",
        description: isFavorite(businessId) 
          ? `${businessName} has been added to your favorites` 
          : `${businessName} has been removed from your favorites`,
      });
    }
  };

  const getPriceRangeDisplay = (priceRange: string | null) => {
    switch (priceRange) {
      case 'budget': return '$';
      case 'moderate': return '$$';
      case 'expensive': return '$$$';
      case 'luxury': return '$$$$';
      default: return '$$';
    }
  };

  const BusinessCard = ({ business }: { business: BusinessWithCategory }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={business.cover_image_url || business.logo_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035"}
          alt={business.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90">
            {business.categories?.name || 'Business'}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="bg-white/90 hover:bg-white h-8 w-8"
            onClick={() => handleToggleFavorite(business.id, business.name)}
          >
            <Heart className={`h-4 w-4 ${isFavorite(business.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2">
          <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
            <Clock className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-green-600">Open</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{business.name}</h3>
          <span className="text-sm text-muted-foreground font-medium">
            {getPriceRangeDisplay(business.price_range)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-sm">{business.average_rating?.toFixed(1) || 'N/A'}</span>
            <span className="text-muted-foreground text-sm">({business.review_count || 0})</span>
          </div>
          {business.is_verified && (
            <Badge variant="outline" className="text-xs">Verified</Badge>
          )}
        </div>
        
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {business.city}, {business.region}
        </div>
        
        {business.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {business.description}
          </p>
        )}
        
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link to={`/business/${business.id}`}>
              View Details
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/book/${business.id}`}>
              Book Now
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button 
              className="h-11 px-6"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${businesses?.length || 0} businesses`}
            </span>
            <div className="flex border rounded-md">
              <Button
                variant={view === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <Card className="mb-6 p-6">
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="food">Food & Dining</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="windhoek">Windhoek</SelectItem>
                    <SelectItem value="swakopmund">Swakopmund</SelectItem>
                    <SelectItem value="oshakati">Oshakati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Rating</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Rating</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button variant="outline" className="shadow-sm">Clear All</Button>
              <Button className="shadow-sm">Apply Filters</Button>
            </div>
          </Card>
        )}

        {/* Business Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Card className="bg-gray-50 border-0 shadow-sm">
            <div className="text-center py-16 md:py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="mt-6 text-xl font-medium">Error loading businesses</h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                There was an error loading the businesses. Please try again later.
              </p>
            </div>
          </Card>
        ) : businesses && businesses.length > 0 ? (
          <div className={view === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50 border-0 shadow-sm">
            <div className="text-center py-16 md:py-20">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto shadow-sm">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="mt-6 text-xl font-medium">No businesses found</h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                {searchQuery 
                  ? "No businesses match your search criteria. Try adjusting your search terms."
                  : "Be the first to register your business on AfroBiz Connect and connect with local customers."
                }
              </p>
              <Button className="mt-8 shadow-sm" asChild>
                <Link to="/business/register">Register Your Business</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BusinessListing;
