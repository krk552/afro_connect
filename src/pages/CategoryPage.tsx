import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Star, 
  MapPin, 
  Clock, 
  Filter, 
  Grid, 
  List, 
  ArrowLeft,
  Heart,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategory } from "@/hooks/useCategories";
import { useBusinesses, BusinessWithCategory } from "@/hooks/useBusinesses";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(10);

  // Get category data
  const { category, loading: categoryLoading, error: categoryError } = useCategory(categorySlug || '');
  
  // Get businesses for this category
  const { businesses, loading: businessesLoading, error: businessesError } = useBusinesses({
    category: category?.id,
    search: searchQuery || undefined,
    rating: minRating > 0 ? minRating : undefined,
    sortBy: sortBy as "rating" | "name" | "newest",
    limit: 50
  });

  const { isFavorite, toggleFavorite } = useFavorites();

  const availableFeatures = ["Online Booking", "Same Day Service", "Deals Available", "Delivery", "Warranty", "Luxury Service", "Personal Training"];

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

  if (categoryLoading) {
    return (
      <div className="pt-20 pb-28">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading category...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="pt-20 pb-28">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Category not found</h2>
            <p className="text-muted-foreground mb-4">
              The category you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-afro-orange">Home</Link>
            <span>/</span>
            <Link to="/categories" className="hover:text-afro-orange">Categories</Link>
            <span>/</span>
            <span className="text-gray-900">{category.name}</span>
          </div>
          
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          <p className="text-muted-foreground">
            {category.description || 'Discover the best ' + category.name.toLowerCase() + ' businesses in Namibia'}
          </p>
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              <Filter className="w-3 h-3 mr-1" />
              Use filters on the left to refine your search
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  Price Range: N{priceRange[0]} - N{priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={2000}
                  step={50}
                  className="mt-2"
                />
              </div>

              {/* Distance */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  Distance: {maxDistance} km
                </label>
                <Slider
                  value={[maxDistance]}
                  onValueChange={(value) => setMaxDistance(value[0])}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Features */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Features</label>
                <div className="space-y-2">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={selectedFeatures.includes(feature)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFeatures([...selectedFeatures, feature]);
                          } else {
                            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                          }
                        }}
                      />
                      <label htmlFor={feature} className="text-sm">
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setMinRating(0);
                  setPriceRange([0, 1000]);
                  setMaxDistance(10);
                  setSelectedFeatures([]);
                }}
              >
                Clear Filters
              </Button>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
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
                  {businessesLoading ? 'Loading...' : (businesses?.length || 0) + ' results'}
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

            {/* Business Grid */}
            {businessesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : businessesError ? (
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
                  Try adjusting your filters or search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;