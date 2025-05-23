
import { Link } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FeaturedBusinesses = () => {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Businesses</h2>
            <p className="text-muted-foreground mt-2">
              Discover top-rated local businesses in Namibia
            </p>
          </div>
          <Link to="/businesses" className="hidden md:flex items-center text-primary hover:underline">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <Card className="bg-gray-50 border-0 shadow-sm">
          <div className="text-center py-16 md:py-20">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-xl font-medium">No featured businesses yet</h3>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              When businesses join AfroBiz Connect, the most popular ones will be featured here.
              Be the first to register your business!
            </p>
            <Button className="mt-8 shadow-sm" asChild>
              <Link to="/business/register">Register Your Business</Link>
            </Button>
          </div>
        </Card>
        
        <div className="text-center mt-10 md:hidden">
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
