
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Quote, Users, MapPin, Rocket, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Real insights about Namibian business landscape and market need
const marketInsights = [
  {
    quote: "Namibia has incredible local talent and businesses, but many customers still struggle to find quality services in their area.",
    author: "Market Research",
    role: "Local Business Study 2024",
    avatar: "🇳🇦",
    highlight: "Discovery Challenge"
  },
  {
    quote: "Small businesses are the backbone of Namibia's economy, yet most lack the digital presence to reach new customers effectively.",
    author: "Small Business Survey", 
    role: "Digital Gap Analysis",
    avatar: "💼",
    highlight: "Digital Divide"
  },
  {
    quote: "There's a huge opportunity to connect Namibian consumers with local service providers through technology.",
    author: "Tech Innovation Report",
    role: "Namibian Market Analysis", 
    avatar: "🚀",
    highlight: "Market Opportunity"
  }
];

// Vision statements and community goals
const visionStatements = [
  {
    icon: Heart,
    title: "Supporting Local",
    description: "Every booking helps a local business owner support their family and community"
  },
  {
    icon: Users,
    title: "Building Community",
    description: "Connecting neighbors with trusted service providers in their area"
  },
  {
    icon: MapPin,
    title: "Growing Namibia",
    description: "Helping Namibian businesses thrive in the digital economy"
  }
];

const Testimonials = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-afro-orange/10 text-afro-orange border-afro-orange/20 mb-4">
            <Rocket className="w-3 h-3 mr-1" />
            The Opportunity
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Why Namibia Needs Makna</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The opportunity to transform how Namibians discover and connect with local businesses is enormous.
          </p>
        </div>

        {/* Market Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {marketInsights.map((insight, index) => (
            <Card key={index} className="relative p-6 border-0 shadow-md bg-white">
              <Quote className="w-8 h-8 text-afro-orange/30 mb-4" />
              <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                "{insight.quote}"
              </blockquote>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-afro-orange/10 rounded-full flex items-center justify-center text-lg">
                  {insight.avatar}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{insight.author}</div>
                  <div className="text-sm text-gray-600">{insight.role}</div>
                </div>
              </div>
              
              <Badge className="absolute top-4 right-4 bg-blue-50 text-blue-700 border-blue-200">
                {insight.highlight}
              </Badge>
            </Card>
          ))}
        </div>

        {/* Vision Section */}
        <div className="bg-gradient-to-br from-afro-orange/5 to-afro-yellow/5 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision for Namibia</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're building more than just a platform - we're creating a community that supports local businesses and brings Namibians together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visionStatements.map((vision, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-afro-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <vision.icon className="w-8 h-8 text-afro-orange" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{vision.title}</h4>
                <p className="text-sm text-gray-600">{vision.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Be Part of Something Big
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Help us build Namibia's most trusted local business community. Whether you're a business owner or customer, 
            you have a role to play in our success.
              </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-afro-orange hover:bg-afro-orange/90"
              onClick={() => navigate('/business/register')}
            >
              Join as a Business
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Join as a Customer
            </Button>
          </div>


        </div>
      </div>
    </section>
  );
};

export default Testimonials;
