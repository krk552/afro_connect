
import { Link } from "react-router-dom";
import { Star, MapPin, Heart, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Business {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  location: string;
  featured: boolean;
}

const businesses: Business[] = [
  {
    id: 1,
    name: "Mama's Kitchen",
    category: "Restaurant",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    location: "Lagos, Nigeria",
    featured: true,
  },
  {
    id: 2,
    name: "Afro Hair Studio",
    category: "Hair Salon",
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
    location: "Lagos, Nigeria",
    featured: true,
  },
  {
    id: 3,
    name: "Home Comfort Services",
    category: "Home Services",
    rating: 4.5,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    location: "Lagos, Nigeria",
    featured: true,
  },
  {
    id: 4,
    name: "KariGari Auto Repair",
    category: "Auto Services",
    rating: 4.6,
    reviews: 53,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e",
    location: "Lagos, Nigeria",
    featured: true,
  },
];

const FeaturedBusinesses = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Businesses</h2>
            <p className="text-muted-foreground mt-2">
              Discover top-rated local businesses near you
            </p>
          </div>
          <Link to="/businesses" className="hidden md:flex items-center text-primary hover:underline">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.map((business) => (
            <Card key={business.id} className="overflow-hidden card-hover border-0 shadow-sm">
              <div className="relative h-48">
                <img
                  src={business.image}
                  alt={business.name}
                  className="h-full w-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-white hover:text-red-500 bg-black/20 hover:bg-white rounded-full"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <span className="text-white text-xs font-medium px-2 py-1 rounded-full bg-primary">
                    {business.category}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <Link to={`/business/${business.id}`}>
                  <h3 className="font-bold text-lg mb-1 hover:text-primary transition-colors">{business.name}</h3>
                </Link>
                <div className="flex items-center text-sm mb-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium ml-1">{business.rating}</span>
                  <span className="text-muted-foreground ml-1">({business.reviews} reviews)</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{business.location}</span>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" size="sm" className="rounded-full" asChild>
                  <Link to={`/business/${business.id}`}>View Details</Link>
                </Button>
                <Button size="sm" className="rounded-full" asChild>
                  <Link to={`/book/${business.id}`}>
                    <Calendar className="mr-1 h-4 w-4" /> Book
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8 md:hidden">
          <Link 
            to="/businesses"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            View All Businesses
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
