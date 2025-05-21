
import { Link } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Favorites = () => {
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
      </div>
    </div>
  );
};

export default Favorites;
