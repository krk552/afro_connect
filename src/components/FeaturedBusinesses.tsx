
import { Link } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-xl font-medium">No businesses yet</h3>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            When businesses register on AfroBiz Connect, they will appear here. 
            Check back soon or encourage businesses to join our platform.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/business-registration">Register a Business</Link>
          </Button>
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
