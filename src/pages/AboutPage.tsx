
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, Users, Globe, Shield, MapPin } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="pt-16 pb-12">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-afro-orange to-afro-purple text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">About AfroBiz Connect</h1>
            <p className="text-lg md:text-xl opacity-90 leading-relaxed">
              Connecting Namibians to the best local services and businesses in their community.
            </p>
          </div>
        </div>
      </section>

      {/* Mission section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              AfroBiz Connect was founded with a simple but powerful mission: to create a digital 
              platform that connects Namibian consumers with local businesses and services, 
              making it easier for both sides to thrive in the digital economy.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're committed to boosting the growth of local businesses across Namibia by 
              providing them with digital visibility and powerful tools, while giving consumers 
              a trusted platform to discover, book, and review the services they need.
            </p>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-afro-orange/10 rounded-full flex items-center justify-center text-afro-orange mb-4">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Local Impact</h3>
              <p className="text-muted-foreground">
                We prioritize the growth and success of local Namibian businesses and communities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-afro-green/10 rounded-full flex items-center justify-center text-afro-green mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality & Trust</h3>
              <p className="text-muted-foreground">
                We maintain high standards and build trust through transparency and reliability.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-afro-purple/10 rounded-full flex items-center justify-center text-afro-purple mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-muted-foreground">
                We foster connections between businesses and customers to build stronger communities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-afro-blue/10 rounded-full flex items-center justify-center text-afro-blue mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Inclusivity</h3>
              <p className="text-muted-foreground">
                We create opportunities for all businesses, from startups to established enterprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              AfroBiz Connect was established in 2025 in Windhoek, Namibia, by a team of local 
              entrepreneurs who saw a gap between small businesses' need for digital presence and 
              consumers' desire to discover local services.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Starting with just a handful of businesses in Windhoek, we've grown to support 
              hundreds of local enterprises across Namibia, connecting them with thousands of 
              customers and facilitating countless successful bookings and transactions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our ultimate goal is to create the most comprehensive and trusted platform for local 
              service discovery and booking across Africa, starting with our home in Namibia.
            </p>
          </div>
        </div>
      </section>

      {/* Coverage section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Where We Operate</h2>
            <p className="text-lg text-muted-foreground mb-10">
              We're currently operating in the following cities in Namibia:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm">
                <MapPin className="h-4 w-4 text-primary mr-2" />
                <span>Windhoek</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm">
                <MapPin className="h-4 w-4 text-primary mr-2" />
                <span>Swakopmund</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm">
                <MapPin className="h-4 w-4 text-primary mr-2" />
                <span>Walvis Bay</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm">
                <MapPin className="h-4 w-4 text-primary mr-2" />
                <span>Oshakati</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm">
                <MapPin className="h-4 w-4 text-primary mr-2" />
                <span>Rundu</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm">
                <MapPin className="h-4 w-4 text-primary mr-2" />
                <span>Katima Mulilo</span>
              </div>
            </div>
            
            <p className="text-muted-foreground mt-8">
              And we're expanding to more locations soon!
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-gradient-to-br from-afro-teal to-afro-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg opacity-90 mb-8">
              Whether you're a business owner looking to expand your reach or a customer seeking 
              quality local services, AfroBiz Connect is here for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/business/register">
                <Button className="bg-white text-afro-teal hover:bg-white/90">
                  List Your Business
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-transparent border border-white hover:bg-white/10">
                  Create an Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
