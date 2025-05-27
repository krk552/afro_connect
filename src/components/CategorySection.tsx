import { Link } from "react-router-dom";
import { Scissors, Home, Bell, Car, Paintbrush, ArrowRight, Sparkles, Loader2, Utensils, Dumbbell, Stethoscope, Wrench, ShoppingBag, Briefcase, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCategoriesWithBusinessCount } from "@/hooks/useCategories";

// Icon mapping for categories
const categoryIcons: { [key: string]: LucideIcon } = {
  'beauty-wellness': Scissors,
  'health-medical': Stethoscope,
  'automotive': Car,
  'food-dining': Utensils,
  'fitness-sports': Dumbbell,
  'home-services': Home,
  'events-entertainment': Bell,
  'cleaning-maintenance': Paintbrush,
  'retail-shopping': ShoppingBag,
  'professional-services': Briefcase,
};

// Color mapping for categories
const categoryColors: { [key: string]: string } = {
  'beauty-wellness': "bg-gradient-to-br from-afro-pink to-afro-purple",
  'health-medical': "bg-gradient-to-br from-afro-blue to-afro-teal",
  'automotive': "bg-gradient-to-br from-afro-teal to-afro-green",
  'food-dining': "bg-gradient-to-br from-afro-orange to-afro-yellow",
  'fitness-sports': "bg-gradient-to-br from-afro-green to-afro-teal",
  'home-services': "bg-gradient-to-br from-afro-blue to-afro-teal",
  'events-entertainment': "bg-gradient-to-br from-afro-purple to-afro-pink",
  'cleaning-maintenance': "bg-gradient-to-br from-afro-green to-afro-yellow",
  'retail-shopping': "bg-gradient-to-br from-afro-pink to-afro-orange",
  'professional-services': "bg-gradient-to-br from-afro-purple to-afro-blue",
};

const CategorySection = () => {
  const { categories, loading, error } = useCategoriesWithBusinessCount();

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-afro-orange/10 text-afro-orange px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Popular Categories
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-afro-orange to-afro-purple bg-clip-text text-transparent">
              Explore Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the best local businesses and services across different categories in Namibia
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-afro-orange/10 text-afro-orange px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Popular Categories
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-afro-orange to-afro-purple bg-clip-text text-transparent">
              Explore Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the best local businesses and services across different categories in Namibia
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unable to load categories. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  // Show only the first 5 categories for the homepage
  const displayCategories = categories?.slice(0, 5) || [];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-10 w-32 h-32 bg-afro-yellow/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-afro-purple/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-afro-orange/10 text-afro-orange px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Popular Categories
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-afro-orange to-afro-purple bg-clip-text text-transparent">
            Explore Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the best local businesses and services across different categories in Namibia
          </p>
        </div>

        {displayCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {displayCategories.map((category) => {
              const IconComponent = categoryIcons[category.slug] || Briefcase;
              const colorClass = categoryColors[category.slug] || "bg-gradient-to-br from-afro-orange to-afro-purple";
              
              return (
                <Link to={`/category/${category.slug}`} key={category.id} className="group">
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent size={28} className="text-white" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-afro-orange transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        {category.business_count || 0}+ businesses
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild className="shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <Link to="/categories" className="flex items-center gap-2">
              View All Categories 
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
