import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useCategoriesWithBusinessCount } from "@/hooks/useCategories";
import * as Icons from "lucide-react";

const Categories = () => {
  const { categories, loading, error } = useCategoriesWithBusinessCount();

  // Icon mapping for categories
  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className="h-8 w-8" /> : <Icons.Folder className="h-8 w-8" />;
  };

  if (loading) {
    return (
      <div className="pt-20 pb-28">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 pb-28">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Error loading categories</h2>
            <p className="text-muted-foreground">
              Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-28">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse Categories</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing local businesses across Namibia. From beauty salons to automotive services, 
            find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories?.map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-6 text-center">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: category.color || '#6B7280' }}
                  >
                    {getIcon(category.icon || 'Folder')}
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <Badge variant="secondary" className="text-xs">
                    {category.business_count || 0} businesses
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories && categories.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No categories available</h3>
            <p className="text-muted-foreground">
              Categories will appear here once they are added.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-muted-foreground mb-6">
              Use our search feature to find specific businesses or services across all categories.
            </p>
            <Link 
              to="/search" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Search All Businesses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories; 