import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  MapPin, Phone, Clock, Globe, Star, Heart, Share, Calendar, 
  ChevronDown, ChevronUp, MapIcon, MessageSquare, Check, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useBusiness } from "@/hooks/useBusinesses";
import { useFavorites } from "@/hooks/useFavorites";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/AuthContext";

// Define TypeScript interfaces for our data structure
interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

interface Service {
  name: string;
  price: string;
  duration: string;
}

interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  location: string;
  phone: string;
  website: string;
  hours: string;
  description: string;
  amenities: string[];
  services: Service[];
  gallery: string[];
  reviewList: Review[]; // Renamed to avoid confusion
}

const BusinessDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // Use our backend hooks
  const { business, loading: businessLoading, error: businessError } = useBusiness(id || '');
  const { isFavorite, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const { reviews, loading: reviewsLoading } = useReviews(id || '');

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add businesses to your favorites",
        variant: "destructive",
      });
      return;
    }

    if (!business) return;

    const result = await toggleFavorite(business.id);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: isFavorite(business.id) ? "Added to favorites" : "Removed from favorites",
        description: isFavorite(business.id) 
          ? "This business has been added to your favorites" 
          : "This business has been removed from your favorites",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business?.name || 'Business',
        text: `Check out ${business?.name || 'this business'} on AfroBiz Connect!`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      toast({
        title: "Link copied",
        description: "Business link copied to clipboard",
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Loading state
  if (businessLoading) {
    return (
      <div className="pt-16 pb-24 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading business details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (businessError || !business) {
    return (
      <div className="pt-16 pb-24 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Business not found</h2>
          <p className="text-muted-foreground mb-4">
            {businessError || "The business you're looking for doesn't exist."}
          </p>
          <Button asChild>
            <Link to="/businesses">Browse Businesses</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Format business hours
  const formatBusinessHours = () => {
    if (!business.business_hours || business.business_hours.length === 0) {
      return "Hours not available";
    }
    
    // Group by day and format
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const todayHours = business.business_hours.find(h => h.day_of_week === today);
    
    if (todayHours) {
      if (todayHours.is_closed) {
        return "Closed today";
      }
      return `Today: ${todayHours.open_time} - ${todayHours.close_time}`;
    }
    
    return "Hours available in details";
  };

  return (
    <div className="pt-16 pb-24">
      {/* Hero image */}
      <div className="relative h-60 md:h-80">
        <img
          src={business.cover_image_url || business.logo_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035"}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="inline-block bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
            {business.categories?.name || 'Business'}
          </span>
        </div>
      </div>

      {/* Business info */}
      <div className="container mx-auto px-4 -mt-6 relative">
        <Card className="p-6 mb-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{business.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium">{business.average_rating?.toFixed(1) || 'N/A'}</span>
                  <span className="ml-1 text-muted-foreground">({business.review_count || 0} reviews)</span>
                </div>
                {business.is_verified && (
                  <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className={isFavorite(business.id) ? "text-red-500" : ""}
                onClick={handleToggleFavorite}
                disabled={favoritesLoading}
              >
                <Heart className={`h-5 w-5 ${isFavorite(business.id) ? "fill-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground mr-2 flex-shrink-0" />
              <span>{[business.street_address, business.city, business.region, business.country].filter(Boolean).join(', ')}</span>
            </div>
            {business.phone && (
              <div className="flex items-start">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground mr-2 flex-shrink-0" />
                <span>{business.phone}</span>
              </div>
            )}
            {business.website && (
              <div className="flex items-start">
                <Globe className="h-4 w-4 mt-0.5 text-muted-foreground mr-2 flex-shrink-0" />
                <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-primary">
                  {business.website}
                </a>
              </div>
            )}
            <div className="flex items-start">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground mr-2 flex-shrink-0" />
              <span>{formatBusinessHours()}</span>
            </div>
          </div>

          <div className="mt-6">
            <Button asChild size="lg" className="w-full">
              <Link to={`/book/${business.id}`}>
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Link>
            </Button>
          </div>
        </Card>

        <Tabs defaultValue="about" className="mb-16">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-4">
            <Card className="p-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground text-sm">
                  {business.description ? (
                    showFullDescription 
                      ? business.description 
                      : business.description.slice(0, 150) + (business.description.length > 150 ? "..." : "")
                  ) : (
                    "No description available."
                  )}
                </p>
                {business.description && business.description.length > 150 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 mt-1"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? (
                      <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
                    ) : (
                      <>Read more <ChevronDown className="h-4 w-4 ml-1" /></>
                    )}
                  </Button>
                )}
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Location</h3>
                <div className="rounded-md overflow-hidden h-48 bg-muted flex items-center justify-center">
                  <MapIcon className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Map View</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-1" /> Get Directions
                  </Button>
                  {business.phone && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${business.phone}`}>
                        <Phone className="h-4 w-4 mr-1" /> Call
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Business Hours Details */}
              {business.business_hours && business.business_hours.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Business Hours</h3>
                  <div className="space-y-1">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => {
                      const dayHours = business.business_hours?.find(h => h.day_of_week === index);
                      return (
                        <div key={day} className="flex justify-between text-sm">
                          <span className={index === new Date().getDay() ? 'font-medium' : ''}>{day}</span>
                          <span className={index === new Date().getDay() ? 'font-medium' : ''}>
                            {dayHours ? (
                              dayHours.is_closed ? 'Closed' : `${dayHours.open_time} - ${dayHours.close_time}`
                            ) : 'Closed'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="mt-4">
            <Card>
              {business.services && business.services.length > 0 ? (
                <div className="divide-y">
                  {business.services.map((service) => (
                    <div key={service.id} className="p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <div className="flex text-sm text-muted-foreground mt-1">
                          <span>{service.duration_minutes} minutes</span>
                          {service.description && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{service.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {business.currency} {service.price}
                        </div>
                        <Button size="sm" className="mt-1" asChild>
                          <Link to={`/book/${business.id}?service=${service.id}`}>
                            Book
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                  <p>No services listed yet.</p>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-4">
            <Card>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Customer Reviews</h3>
                  {user && (
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" /> Write a Review
                    </Button>
                  )}
                </div>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium text-lg">{business.average_rating?.toFixed(1) || 'N/A'}</span>
                  <span className="ml-1 text-muted-foreground">({business.review_count || 0} reviews)</span>
                </div>
              </div>
              
              {reviewsLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading reviews...</p>
                </div>
              ) : reviews && reviews.length > 0 ? (
                <>
                  <div className="divide-y">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">
                            {review.users ? 
                              `${review.users.first_name || ''} ${review.users.last_name || ''}`.trim() || review.users.email || 'Anonymous'
                              : 'Anonymous'
                            }
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < review.rating 
                                  ? "text-yellow-400 fill-yellow-400" 
                                  : "text-gray-300"
                              }`} 
                            />
                          ))}
                        </div>
                        {review.title && (
                          <h5 className="font-medium mt-2">{review.title}</h5>
                        )}
                        {review.content && (
                          <p className="text-sm mt-2">{review.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 text-center">
                    <Button variant="outline">Load More Reviews</Button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                  <p>No reviews yet. Be the first to review this business!</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessDetails;
