
import { Link } from "react-router-dom";
import { UtensilsCrossed, Scissors, Home, Bell, Car, Paintbrush, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const categories = [
  {
    id: 1,
    name: "Restaurants",
    icon: UtensilsCrossed,
    color: "bg-afro-orange",
    link: "/categories/restaurants",
  },
  {
    id: 2,
    name: "Hair & Beauty",
    icon: Scissors,
    color: "bg-afro-pink",
    link: "/categories/salons",
  },
  {
    id: 3,
    name: "Home Services",
    icon: Home,
    color: "bg-afro-blue",
    link: "/categories/home",
  },
  {
    id: 4,
    name: "Events",
    icon: Bell,
    color: "bg-afro-purple",
    link: "/categories/events",
  },
  {
    id: 5,
    name: "Auto Services",
    icon: Car,
    color: "bg-afro-teal",
    link: "/categories/auto",
  },
  {
    id: 6,
    name: "Cleaning",
    icon: Paintbrush,
    color: "bg-afro-green",
    link: "/categories/cleaning",
  },
];

const CategorySection = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Explore Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the best local businesses and services across different categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link to={category.link} key={category.id}>
              <Card className="card-hover border-0 text-center h-full">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                  <div className={`category-icon ${category.color} mb-3`}>
                    <category.icon size={24} />
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                  {/* Removed the listing count display */}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/categories"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            View All Categories 
            <Star className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
