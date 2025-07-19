import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ArrowRight, 
  Plus,
  Store,
  Users,
  Rocket
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { categories, loading } = useCategories();

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-afro-orange mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <Badge className="bg-afro-orange/10 text-afro-orange border-afro-orange/20">
              <Rocket className="w-3 h-3 mr-1" />
              Building Our Community
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse Service Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a category to discover local businesses and services. Each category page includes filters to help you find exactly what you need.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search categories..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCategories.map((category) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-lg transition-all duration-300 border-0 bg-white"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">{category.icon || "🏪"}</div>
                  <Badge variant="outline" className="text-xs">
                    Coming Soon
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-6">
                  {category.description || `Find and book ${category.name.toLowerCase()} services in your area.`}
                </p>

                {/* Current state - no businesses yet */}
                <div className="space-y-3">
                                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Store className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    Looking for businesses
                  </div>
                  <div className="text-xs text-gray-500">
                    Join this category to start connecting
                  </div>
                </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-afro-orange border-afro-orange hover:bg-afro-orange hover:text-white"
                      onClick={() => navigate('/business/register')}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      List Business
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/signup')}
                    >
                      Get Notified
                    </Button>
                  </div>
                  
                  <div className="mt-3 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs text-blue-600 hover:text-blue-700"
                      onClick={() => navigate(`/category/${category.slug}`)}
                    >
                      Browse {category.name} →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Owner CTA */}
        <Card className="bg-gradient-to-br from-afro-orange/5 to-afro-yellow/5 border-afro-orange/20">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-afro-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-afro-orange" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Own a Business in Namibia?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join Makna and start connecting with customers in your area. 
                Build your online presence and grow your business.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Rocket className="w-6 h-6 text-green-600" />
                </div>
                <div className="font-medium text-gray-900">Be First</div>
                <div className="text-sm text-gray-600">Join your category</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="font-medium text-gray-900">Easy Setup</div>
                <div className="text-sm text-gray-600">Quick business registration</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Store className="w-6 h-6 text-purple-600" />
                </div>
                <div className="font-medium text-gray-900">Free Setup</div>
                <div className="text-sm text-gray-600">Complete profile assistance</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-afro-orange hover:bg-afro-orange/90"
                onClick={() => navigate('/business/register')}
              >
                Register Your Business
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How It Works Section */}
        <div className="mt-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              How Category Browsing Works
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Click on any category below to explore businesses with advanced filters and search options.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">1</span>
              </div>
              <div className="font-medium text-gray-900">Choose Category</div>
              <div className="text-sm text-gray-600">Click on a category that matches your needs</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">2</span>
              </div>
              <div className="font-medium text-gray-900">Use Filters</div>
              <div className="text-sm text-gray-600">Filter by rating, price, distance, and features</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">3</span>
              </div>
              <div className="font-medium text-gray-900">Find & Book</div>
              <div className="text-sm text-gray-600">View business details and make bookings</div>
            </div>
          </div>
        </div>

        {/* Customer Section */}
        <div className="mt-8 text-center bg-blue-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Looking for Services?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Sign up to discover local businesses and get notified when new services become available.
          </p>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/signup')}
          >
            <Users className="w-4 h-4 mr-2" />
            Sign Up Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Categories; 