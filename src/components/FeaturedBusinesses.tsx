import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Users, 
  MapPin, 
  Rocket, 
  ArrowRight, 
  CheckCircle,
  Heart,
  Calendar,
  Star
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const FeaturedBusinesses = () => {
  const navigate = useNavigate();

  // Categories we're looking for businesses in
  const targetCategories = [
    {
      name: "Beauty & Wellness",
      description: "Hair salons, spas, beauty services",
      icon: "💄",
      color: "bg-pink-500"
    },
    {
      name: "Home Services", 
      description: "Cleaning, repairs, maintenance",
      icon: "🏠",
      color: "bg-blue-500"
    },
    {
      name: "Automotive",
      description: "Car wash, repairs, services",
      icon: "🚗", 
      color: "bg-gray-600"
    },
    {
      name: "Food & Dining",
      description: "Restaurants, catering, delivery",
      icon: "🍽️",
      color: "bg-orange-500"
    },
    {
      name: "Health & Fitness",
      description: "Gyms, trainers, wellness",
      icon: "💪",
      color: "bg-green-500"
    },
    {
      name: "Technology",
      description: "Phone repair, IT services",
      icon: "💻",
      color: "bg-purple-500"
    }
  ];

  const platformBenefits = [
    {
      icon: Store,
      title: "Your Business, Online",
      description: "Create your professional business profile and reach new customers"
    },
    {
      icon: Users,
      title: "Connect with Customers", 
      description: "Build relationships with local customers who need your services"
    },
    {
      icon: Calendar,
      title: "Manage Bookings",
      description: "Simple booking system to organize your appointments and services"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Call to Action for Business Owners */}
      <div className="text-center">
        <div className="mb-8">
          <Badge className="bg-afro-orange/10 text-afro-orange border-afro-orange/20">
            <Rocket className="w-3 h-3 mr-1" />
            Launching Soon
          </Badge>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Are You a Local Business Owner?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Join Makna and help us build Namibia's local business community. 
          Connect with customers in your area and grow your business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {platformBenefits.map((benefit, index) => (
            <Card key={index} className="p-6 text-center border-0 shadow-md bg-gradient-to-br from-gray-50 to-white">
              <div className="w-12 h-12 bg-afro-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-6 h-6 text-afro-orange" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-afro-orange hover:bg-afro-orange/90"
            onClick={() => navigate('/business/register')}
          >
            <Store className="w-4 h-4 mr-2" />
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
      </div>

      {/* Categories We're Looking For */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Business Categories We're Looking For
        </h3>
        <p className="text-gray-600 mb-8">
          Be among the first in your category to join Makna
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {targetCategories.map((category, index) => (
            <Card 
              key={index} 
              className="p-4 text-center border-0 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <h4 className="font-medium text-gray-900 mb-1">{category.name}</h4>
              <p className="text-xs text-gray-600">{category.description}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3 text-afro-orange hover:text-afro-orange hover:bg-afro-orange/5"
                onClick={() => navigate('/business/register')}
              >
                Join this category
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Platform Benefits */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Why Join Makna?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Easy Online Presence</div>
              <div className="text-sm text-gray-600">Professional business profile setup</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Customer Discovery</div>
              <div className="text-sm text-gray-600">Connect with local customers</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Booking Management</div>
              <div className="text-sm text-gray-600">Simple appointment scheduling</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900">Local Market Access</div>
              <div className="text-sm text-gray-600">Reach customers in your area</div>
            </div>
          </div>
        </div>

        <Button 
          size="lg" 
          className="mt-6 bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/business/register')}
        >
          Register Your Business
        </Button>
      </Card>

      {/* For Customers */}
      <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Looking for Services?
        </h3>
        <p className="text-gray-600 mb-6">
          Sign up to be notified when businesses in your area join Makna. 
          Be the first to discover and book with local service providers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/signup')}
          >
            <Users className="w-4 h-4 mr-2" />
            Sign Up Now
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate('/categories')}
          >
            Browse Categories
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBusinesses;
