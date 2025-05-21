
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BusinessPromotion = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-afro-purple to-afro-blue"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534258936925-c58bed479fcb')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Grow Your Business with AfroBiz Connect
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Join thousands of businesses across Africa that are expanding their reach, 
              managing bookings effortlessly, and gaining valuable insights into customer preferences.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white mr-4 mt-1">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Expand Your Digital Presence</h3>
                  <p className="text-white/80">
                    Create a beautiful profile that showcases your services and attracts new customers 24/7.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white mr-4 mt-1">
                  <span className="font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Streamline Bookings & Scheduling</h3>
                  <p className="text-white/80">
                    Manage appointments and reservations with our easy-to-use scheduling tools.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white mr-4 mt-1">
                  <span className="font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Gain Customer Insights</h3>
                  <p className="text-white/80">
                    Access analytics on customer behavior and preferences to optimize your business strategy.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-afro-blue hover:bg-white/90" asChild>
                <Link to="/business/register">
                  List Your Business
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                <Link to="/business">Learn More</Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998" 
              alt="Business owner using tablet" 
              className="rounded-lg shadow-2xl transform translate-y-4 w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessPromotion;
