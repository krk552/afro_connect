import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight, Clock, Heart, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const FeaturedBusinesses = () => {
  const { user } = useAuth();
  const { businesses, loading, error } = useBusinesses({
    featured: true,
    limit: 6
  });
  const { isFavorite, toggleFavorite } = useFavorites();

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

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-afro-orange to-afro-purple bg-clip-text text-transparent">
                Featured Businesses
              </h2>
              <p className="text-muted-foreground mt-2">
                Discover top-rated local businesses in Namibia
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading featured businesses...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-afro-orange to-afro-purple bg-clip-text text-transparent">
                Featured Businesses
              </h2>
              <p className="text-muted-foreground mt-2">
                Discover top-rated local businesses in Namibia
              </p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unable to load featured businesses. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-afro-orange to-afro-purple bg-clip-text text-transparent">
              Featured Businesses
            </h2>
            <p className="text-muted-foreground mt-2">
              Discover top-rated local businesses in Namibia
            </p>
          </div>
          <Link to="/businesses" className="hidden md:flex items-center text-primary hover:underline font-medium">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {businesses && businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Card key={business.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={business.cover_image_url || business.logo_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"}
                    alt={business.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-afro-orange font-medium">
                      {business.categories?.name || 'Business'}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="bg-white/90 hover:bg-white h-8 w-8"
                      onClick={() => handleToggleFavorite(business.id, business.name)}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite(business.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                      <Clock className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-medium text-green-600">
                        Open
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-afro-orange transition-colors">
                      {business.name}
                    </h3>
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
                  </div>
                  
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {business.city}, {business.region}
                  </div>
                  
                  <Button asChild className="w-full bg-afro-green hover:bg-afro-green/90">
                    <Link to={`/business/${business.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured businesses available at the moment.</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild className="shadow-sm">
            <Link to="/businesses" className="flex items-center">
              Explore All Businesses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
