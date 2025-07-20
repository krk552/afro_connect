
import { Search, Calendar, Star, Rocket, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    id: 1,
    icon: Rocket,
    title: "We're Launching",
    description: "Makna is coming to Namibia. Be part of our community.",
    color: "bg-afro-orange",
    forType: "platform"
  },
  {
    id: 2,
    icon: Users,
    title: "Businesses Join",
    description: "Local service providers register and create their profiles",
    color: "bg-afro-green",
    forType: "business"
  },
  {
    id: 3,
    icon: Search,
    title: "Customers Discover",
    description: "People find and connect with local businesses they need",
    color: "bg-afro-blue",
    forType: "customer"
  }
];

const customerSteps = [
  {
    id: 1,
    icon: Search,
    title: "Search & Discover",
    description: "Find local businesses and services in your area",
    color: "bg-blue-500"
  },
  {
    id: 2,
    icon: Calendar,
    title: "Book & Connect",
    description: "Schedule appointments or contact businesses directly",
    color: "bg-green-500"
  },
  {
    id: 3,
    icon: Star,
    title: "Review & Share",
    description: "Share your experience to help others in the community",
    color: "bg-purple-500"
  }
];

const businessSteps = [
  {
    id: 1,
    icon: CheckCircle,
    title: "Create Profile",
    description: "Set up your business profile with services and details",
    color: "bg-orange-500"
  },
  {
    id: 2,
    icon: Users,
    title: "Get Discovered",
    description: "Customers find your business through search and categories",
    color: "bg-teal-500"
  },
  {
    id: 3,
    icon: Calendar,
    title: "Manage Bookings",
    description: "Receive and manage bookings through your dashboard",
    color: "bg-indigo-500"
  }
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Platform Launch Process */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How Makna Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            We're building Namibia's first comprehensive local business marketplace. 
            Here's how we're making it happen.
          </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="text-center">
              <div className="relative">
                <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center text-white mx-auto`}>
                  <step.icon size={32} />
                </div>
                {step.id < steps.length && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-200 -z-10">
                    <div className="absolute top-0 left-0 w-3 h-3 bg-gray-200 transform rotate-45 -translate-y-1"></div>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mt-6 mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
          </div>
        </div>

        {/* Two-Column: Business & Customer Flows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* For Businesses */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">For Businesses</h3>
              <p className="text-gray-600">Join as a business partner</p>
            </div>

            <div className="space-y-6">
              {businessSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${step.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                    <step.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button 
                className="bg-afro-orange hover:bg-afro-orange/90"
                onClick={() => navigate('/business/register')}
              >
                Register Your Business
              </Button>
            </div>
          </div>

          {/* For Customers */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">For Customers</h3>
              <p className="text-gray-600">Discover amazing local services</p>
            </div>

            <div className="space-y-6">
              {customerSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${step.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                    <step.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => navigate('/signup')}
              >
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>

        {/* Get Started Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-afro-orange/5 to-afro-yellow/5 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join Makna today and be part of Namibia's growing business community
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-afro-orange hover:bg-afro-orange/90"
              onClick={() => navigate('/business/register')}
            >
              List Your Business
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Sign Up as Customer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
