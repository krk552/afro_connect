
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  MapPin, 
  Target, 
  Rocket,
  Star,
  ArrowRight,
  Mail
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: "Supporting Local",
      description: "We believe in the power of local businesses to build strong communities and create lasting relationships."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Every feature we build is designed to bring Namibians together and strengthen local connections."
    },
    {
      icon: Target,
      title: "Transparency",
      description: "We're honest about our journey - we're new, we're learning, and we're committed to growing with you."
    },
    {
      icon: Star,
      title: "Quality Over Quantity",
      description: "We'd rather have fewer, high-quality businesses than thousands of unverified listings."
    }
  ];

  const milestones = [
    {
      title: "Platform Development",
      description: "Built a modern, mobile-first platform designed specifically for Namibian businesses",
      status: "completed"
    },
    {
      title: "Business Onboarding",
      description: "Welcoming local businesses to join our platform",
      status: "in-progress"
    },
    {
      title: "Community Launch",
      description: "Opening to all customers and businesses across Namibia",
      status: "upcoming"
    },
    {
      title: "National Expansion",
      description: "Growing to all regions and becoming Namibia's go-to local business platform",
      status: "future"
    }
  ];

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-afro-orange/10 text-afro-orange border-afro-orange/20 mb-6">
            <Rocket className="w-3 h-3 mr-1" />
            Our Story
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Building Namibia's Local Business Community
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Makna was born from a simple observation: Namibia has incredible local businesses, 
            but customers often struggle to find them. We're here to change that by creating 
            meaningful connections between businesses and the communities they serve.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-afro-orange/5 to-afro-yellow/5">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-afro-orange/10 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-afro-orange" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To empower every Namibian business owner with the tools they need to reach customers 
                and grow their business, while making it effortless for customers to discover 
                quality local services.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                A Namibia where every local business thrives, every customer finds exactly what 
                they need, and strong communities are built through local commerce and genuine 
                relationships.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Stand For</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These values guide every decision we make as we build Makna
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-afro-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-afro-orange" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* The Journey */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're just getting started, and we want you to be part of our story
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-4 mb-8 last:mb-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  milestone.status === 'completed' ? 'bg-green-500' :
                  milestone.status === 'in-progress' ? 'bg-afro-orange' :
                  milestone.status === 'upcoming' ? 'bg-blue-500' :
                  'bg-gray-300'
                }`}>
                  {milestone.status === 'completed' && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {milestone.status === 'in-progress' && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                  {milestone.status === 'upcoming' && (
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  )}
                  {milestone.status === 'future' && (
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{milestone.title}</h3>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                  <div className="mt-2">
                    <Badge variant="outline" className={`text-xs ${
                      milestone.status === 'completed' ? 'border-green-200 text-green-700' :
                      milestone.status === 'in-progress' ? 'border-afro-orange/20 text-afro-orange' :
                      milestone.status === 'upcoming' ? 'border-blue-200 text-blue-700' :
                      'border-gray-200 text-gray-600'
                    }`}>
                      {milestone.status === 'completed' ? 'Completed' :
                       milestone.status === 'in-progress' ? 'In Progress' :
                       milestone.status === 'upcoming' ? 'Coming Soon' :
                       'Future Goal'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Namibia Needs This */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white mb-16">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Namibia Needs Makna</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We see a huge opportunity to support local businesses and bring communities together
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl mb-3">🏪</div>
                <h3 className="font-semibold text-gray-900 mb-2">Hidden Gems</h3>
                <p className="text-sm text-gray-600">
                  Amazing businesses exist but customers can't find them easily
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="font-semibold text-gray-900 mb-2">Digital Gap</h3>
                <p className="text-sm text-gray-600">
                  Many local businesses lack the digital presence to reach new customers
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Connection</h3>
                <p className="text-sm text-gray-600">
                  We can strengthen local communities through better business discovery
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Join Our Journey */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Journey</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're building something meaningful for Namibia, and we'd love for you to be part of it. 
            Whether you're a business owner or customer, you have a role to play.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg"
              className="bg-afro-orange hover:bg-afro-orange/90"
              onClick={() => navigate('/business/register')}
            >
              List Your Business
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Join as Customer
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Have questions or feedback?</p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/contact')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
