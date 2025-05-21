import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Filter, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Import our existing category section component to reuse categories
import { categories } from "@/components/CategorySection";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Empty businesses array
  const filteredBusinesses: any[] = [];

  useEffect(() => {
    // Find the current category info based on the URL parameter
    if (categoryId) {
      const category = categories.find(cat => cat.link.includes(categoryId));
      setCurrentCategory(category);
    } else {
      setCurrentCategory(null);
    }
  }, [categoryId]);

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="my-6">
          <h1 className="text-2xl font-bold mb-2">
            {currentCategory ? currentCategory.name : "All Categories"}
          </h1>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={`Search ${currentCategory ? currentCategory.name : "businesses"}...`}
                className="pr-10"
              />
            </div>
            <Button>Search</Button>
          </div>
        </div>

        {!categoryId && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Browse Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link to={category.link} key={category.id}>
                  <Card className="card-hover border-0 text-center h-full">
                    <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                      <div className={`category-icon ${category.color} mb-3`}>
                        <category.icon size={24} />
                      </div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        0 listings
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <p className="text-sm text-muted-foreground">
            0 businesses found
          </p>
        </div>

        {isFilterOpen && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Filter Results</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
                  Close
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Distance</h4>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input type="radio" name="distance" id="dist1" className="mr-2" />
                      <label htmlFor="dist1">Less than 1 km</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="distance" id="dist2" className="mr-2" />
                      <label htmlFor="dist2">1 - 3 km</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="distance" id="dist3" className="mr-2" />
                      <label htmlFor="dist3">3 - 5 km</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="distance" id="dist4" className="mr-2" />
                      <label htmlFor="dist4">Over 5 km</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Rating</h4>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input type="checkbox" id="rating5" className="mr-2" />
                      <label htmlFor="rating5">5 stars</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="rating4" className="mr-2" />
                      <label htmlFor="rating4">4+ stars</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="rating3" className="mr-2" />
                      <label htmlFor="rating3">3+ stars</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Features</h4>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <input type="checkbox" id="feature1" className="mr-2" />
                      <label htmlFor="feature1">Online Booking</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="feature2" className="mr-2" />
                      <label htmlFor="feature2">Same Day Service</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="feature3" className="mr-2" />
                      <label htmlFor="feature3">Deals Available</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline">Clear All</Button>
                <Button>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            {currentCategory ? (
              <currentCategory.icon className="h-8 w-8 text-muted-foreground" />
            ) : (
              <Building2 className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <h2 className="mt-4 text-xl font-medium">No businesses found</h2>
          <p className="mt-2 text-muted-foreground">
            There are no businesses in this category yet
          </p>
          <Button className="mt-4" asChild>
            <Link to="/categories">Browse Categories</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
