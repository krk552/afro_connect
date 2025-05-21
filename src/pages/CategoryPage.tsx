
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Import our existing category section component to reuse categories
import { categories } from "@/components/CategorySection";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Placeholder businesses data
  const allBusinesses = [
    {
      id: 1,
      name: "Namibia Hair Studio",
      category: "Hair & Beauty",
      categoryId: "salons",
      rating: 4.7,
      reviews: 98,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      location: "Independence Ave, Windhoek",
      distance: "1.2 km",
      features: ["Online Booking", "Air Conditioning"],
    },
    {
      id: 2,
      name: "Peach Tree Restaurant",
      category: "Restaurants",
      categoryId: "restaurants",
      rating: 4.5,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      location: "Sam Nujoma Dr, Windhoek",
      distance: "0.8 km",
      features: ["Table Service", "Takeaway"],
    },
    {
      id: 3,
      name: "Clean & Clear Services",
      category: "Cleaning",
      categoryId: "cleaning",
      rating: 4.3,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
      location: "Robert Mugabe Ave, Windhoek",
      distance: "1.5 km",
      features: ["Home Visits", "Same Day Service"],
    },
    {
      id: 4,
      name: "AutoFix Garage",
      category: "Auto Services",
      categoryId: "auto",
      rating: 4.6,
      reviews: 53,
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e",
      location: "Independence Ave, Windhoek",
      distance: "2.3 km",
      features: ["Emergency Service", "All Car Models"],
    },
    {
      id: 5,
      name: "Savanna Cafe",
      category: "Restaurants",
      categoryId: "restaurants",
      rating: 4.8,
      reviews: 112,
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
      location: "Mandume Ndemufayo Ave, Windhoek",
      distance: "1.7 km",
      features: ["Outdoor Seating", "Vegetarian Options"],
    },
    {
      id: 6,
      name: "Afro Styles",
      category: "Hair & Beauty",
      categoryId: "salons",
      rating: 4.4,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f",
      location: "Hosea Kutako Dr, Windhoek",
      distance: "3.1 km",
      features: ["Natural Hair Specialists", "Products For Sale"],
    },
    {
      id: 7,
      name: "Home Repairs LLC",
      category: "Home Services",
      categoryId: "home",
      rating: 4.5,
      reviews: 92,
      image: "https://images.unsplash.com/photo-1621905251189-08b45249ff78",
      location: "Eros, Windhoek",
      distance: "2.8 km",
      features: ["Same Day Service", "Licensed Professionals"],
    },
    {
      id: 8,
      name: "Events & More",
      category: "Events",
      categoryId: "events",
      rating: 4.9,
      reviews: 63,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      location: "Klein Windhoek, Windhoek",
      distance: "4.2 km",
      features: ["Full Event Planning", "Catering Available"],
    },
  ];

  // Filter businesses based on selected category
  const filteredBusinesses = categoryId 
    ? allBusinesses.filter(business => business.categoryId === categoryId)
    : allBusinesses;

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
                        {category.items} listings
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
            {filteredBusinesses.length} businesses found
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

        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <currentCategory.icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-xl font-medium">No businesses found</h2>
            <p className="mt-2 text-muted-foreground">
              There are no businesses in this category yet
            </p>
            <Button className="mt-4" asChild>
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBusinesses.map((business) => (
              <Link to={`/business/${business.id}`} key={business.id}>
                <Card className="card-hover overflow-hidden h-full">
                  <div className="relative h-48">
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-primary text-white text-xs font-medium m-2 px-2 py-1 rounded-full">
                      {business.category}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h2 className="font-bold">{business.name}</h2>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-medium">{business.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{business.location}</span>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {business.features.map((feature, index) => (
                        <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
