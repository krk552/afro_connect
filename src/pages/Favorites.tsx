import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  MapPin, 
  Clock,
  DollarSign,
  Trash2,
  Share2,
  Loader2,
  HeartOff
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";

const Favorites = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [filterCategory, setFilterCategory] = useState("all");

  const { favorites, loading, error, removeFromFavorites } = useFavorites();

  const handleRemoveFromFavorites = async (businessId: string, businessName: string) => {
    const result = await removeFromFavorites(businessId);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Removed from favorites",
        description: `${businessName} has been removed from your favorites`,
      });
    }
  };

  // Get unique categories from favorites
  const categories = ["all", ...Array.from(new Set(favorites.map(fav => fav.businesses?.categories?.name).filter(Boolean)))];

  const filteredFavorites = favorites.filter(favorite => {
    if (!favorite.businesses) return false;
    
    const matchesSearch = favorite.businesses.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         favorite.businesses.categories?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || favorite.businesses.categories?.name === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.businesses?.name || '').localeCompare(b.businesses?.name || '');
      case "rating":
        return (b.businesses?.average_rating || 0) - (a.businesses?.average_rating || 0);
      case "recent":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const getPriceRangeDisplay = (priceRange: string | null) => {
    switch (priceRange) {
      case 'budget': return '$';
      case 'moderate': return '$$';
      case 'expensive': return '$$$';
      case 'luxury': return '$$$$';
      default: return '$$';
    }
  };

  const FavoriteCard = ({ favorite }: { favorite: any }) => {
    const business = favorite.businesses;
    if (!business) return null;

    return (
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
              onClick={() => handleRemoveFromFavorites(business.id, business.name)}
            >
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            </Button>
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
          
          <p className="text-xs text-muted-foreground mb-3">
            Added {new Date(favorite.created_at).toLocaleDateString()}
          </p>
          
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
  };

  if (!user) {
    return (
      <div className="pt-20 pb-28">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <HeartOff className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to view your favorite businesses.
            </p>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-20 pb-28">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
            <p className="text-muted-foreground">Your saved businesses</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your favorites...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 pb-28">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
            <p className="text-muted-foreground">Your saved businesses</p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Error loading favorites. Please try again later.</p>
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
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            {favorites.length} saved {favorites.length === 1 ? 'business' : 'businesses'}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <HeartOff className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start exploring businesses and add them to your favorites by clicking the heart icon.
            </p>
            <Button asChild>
              <Link to="/businesses">
                Discover Businesses
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search your favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

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

            {/* Results */}
            {sortedFavorites.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No matches found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {sortedFavorites.map((favorite) => (
                  <FavoriteCard key={favorite.id} favorite={favorite} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
