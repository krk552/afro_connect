
import { Link } from "react-router-dom";
import { Scissors, Home, Bell, Car, Paintbrush, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const categories = [
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
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Explore Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the best local businesses and services across different categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map((category) => (
            <Link to={category.link} key={category.id}>
              <Card className="card-hover border-0 text-center h-full shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <div className={`category-icon ${category.color} mb-4 shadow-sm`}>
                    <category.icon size={24} />
                  </div>
                  <h3 className="font-medium text-base md:text-lg">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-12">
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
