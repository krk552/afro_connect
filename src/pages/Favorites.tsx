
import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Heart, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Favorites = () => {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Namibia Hair Studio",
      category: "Hair Salon",
      rating: 4.7,
      reviews: 98,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      location: "Independence Ave, Windhoek",
    },
    {
      id: 2,
      name: "Peach Tree Restaurant",
      category: "Restaurant",
      rating: 4.5,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      location: "Sam Nujoma Dr, Windhoek",
    },
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
    toast({
      title: "Removed from favorites",
      description: "The business has been removed from your favorites",
    });
  };

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="my-6">
          <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search favorites..."
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((business) => (
              <Card key={business.id} className="overflow-hidden">
                <div className="relative">
                  <Link to={`/business/${business.id}`}>
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                      <span className="text-white text-xs font-medium px-2 py-1 rounded-full bg-primary">
                        {business.category}
                      </span>
                    </div>
                  </Link>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-rose-500 hover:text-rose-600"
                    onClick={() => removeFavorite(business.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="p-4">
                  <Link to={`/business/${business.id}`}>
                    <h3 className="font-bold text-lg hover:text-primary transition-colors">{business.name}</h3>
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
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-xl font-medium">No favorites yet</h2>
            <p className="mt-2 text-muted-foreground">
              You haven't added any businesses to your favorites yet
            </p>
            <Button className="mt-6" asChild>
              <Link to="/businesses">Explore Businesses</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
