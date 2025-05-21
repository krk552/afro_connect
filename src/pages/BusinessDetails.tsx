
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  MapPin, Phone, Clock, Globe, Star, Heart, Share, Calendar, 
  ChevronDown, ChevronUp, MapIcon, MessageSquare, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

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
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Placeholder data for an example business
  const business: Business = {
    id: id || "1",
    name: "Namibia Hair Studio",
    category: "Hair Salon",
    rating: 4.7,
    reviews: 98, // This is the count of reviews
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
    location: "15 Independence Ave, Windhoek, Namibia",
    phone: "+264 61 123 4567",
    website: "www.namibiahair.com",
    hours: "Mon-Sat: 9:00 AM - 7:00 PM",
    description: "Namibia Hair Studio is a premier salon offering a wide range of hair styling and beauty services. Our team of skilled professionals is dedicated to providing exceptional service and creating beautiful, personalized looks for all clients. We use only the highest quality products and stay up-to-date with the latest trends and techniques in hair styling.",
    amenities: ["Free WiFi", "Air Conditioning", "Wheelchair Accessible", "Credit Card Payment"],
    services: [
      { name: "Women's Haircut", price: "N$250", duration: "45 min" },
      { name: "Men's Haircut", price: "N$150", duration: "30 min" },
      { name: "Hair Coloring", price: "N$500", duration: "2 hrs" },
      { name: "Braiding", price: "N$350", duration: "1.5 hrs" },
      { name: "Hair Treatment", price: "N$400", duration: "1 hr" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702",
    ],
    reviewList: [ // Renamed from 'reviews' to avoid property name conflict
      {
        id: 1,
        author: "Maria N.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Absolutely loved my experience at Namibia Hair Studio. The stylist was amazing and my hair has never looked better!",
      },
      {
        id: 2,
        author: "Thomas K.",
        rating: 4,
        date: "1 month ago",
        comment: "Great service and friendly staff. Would recommend to anyone looking for a quality haircut.",
      }
    ]
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "This business has been removed from your favorites" : "This business has been added to your favorites",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: `Check out ${business.name} on AfroBiz Connect!`,
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

  return (
    <div className="pt-16 pb-24">
      {/* Hero image */}
      <div className="relative h-60 md:h-80">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="inline-block bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
            {business.category}
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
                  <span className="ml-1 font-medium">{business.rating}</span>
                  <span className="ml-1 text-muted-foreground">({business.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className={isFavorite ? "text-red-500" : ""}
                onClick={toggleFavorite}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground mr-2 flex-shrink-0" />
              <span>{business.location}</span>
            </div>
            <div className="flex items-start">
              <Phone className="h-4 w-4 mt-0.5 text-muted-foreground mr-2 flex-shrink-0" />
              <span>{business.phone}</span>
            </div>
            <div className="flex items-start">
              <Globe className="h-4 w-4 mt-0.5 text-muted-foreground mr-2 flex-shrink-0" />
              <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-primary">
                {business.website}
              </a>
            </div>
            <div className="flex items-start">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground mr-2 flex-shrink-0" />
              <span>{business.hours}</span>
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
                  {showFullDescription 
                    ? business.description 
                    : business.description.slice(0, 150) + "..."}
                </p>
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
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {business.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
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
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" /> Call
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Gallery</h3>
                <div className="grid grid-cols-3 gap-2">
                  {business.gallery.map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={image}
                        alt={`${business.name} gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="services" className="mt-4">
            <Card>
              <div className="divide-y">
                {business.services.map((service, index) => (
                  <div key={index} className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <div className="flex text-sm text-muted-foreground mt-1">
                        <span>{service.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{service.price}</div>
                      <Button size="sm" className="mt-1">Book</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-4">
            <Card>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Customer Reviews</h3>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" /> Write a Review
                  </Button>
                </div>
                <div className="flex items-center mt-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium text-lg">{business.rating}</span>
                  <span className="ml-1 text-muted-foreground">({business.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="divide-y">
                {business.reviewList.map((review) => (
                  <div key={review.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{review.author}</h4>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
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
                    <p className="text-sm mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 text-center">
                <Button variant="outline">Load More Reviews</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessDetails;
