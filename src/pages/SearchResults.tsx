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
  Heart
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
  
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Get search filters from URL params
  const categoryFilter = searchParams.get("category") || undefined;
  const locationFilter = searchParams.get("location") || undefined;
  const priceRangeFilter = searchParams.get("priceRange") || undefined;
  const ratingFilter = searchParams.get("rating") ? parseFloat(searchParams.get("rating")!) : undefined;

  // Use backend hook with filters
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
        
        <Button asChild className="w-full">
          <Link to={`/business/${business.id}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-20 pb-28">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="my-8">
          <h1 className="text-3xl font-bold mb-3">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Businesses'}
          </h1>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for businesses, services..."
                className="pr-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button 
              className="h-11 px-6"
              onClick={() => handleSearch(searchQuery)}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Advanced Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <p className="text-muted-foreground">Advanced filters coming soon...</p>
                </div>
              </SheetContent>
            </Sheet>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${businesses?.length || 0} results`}
            </span>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Error loading businesses. Please try again later.</p>
          </div>
        ) : businesses && businesses.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
        <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No businesses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all businesses.
            </p>
            <Button asChild className="mt-4">
              <Link to="/businesses">Browse All Businesses</Link>
          </Button>
        </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
