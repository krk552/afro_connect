
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What People Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from our customers and business owners about their experience with AfroBiz Connect
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="bg-white border-0 shadow-md">
            <CardContent className="p-8 text-center">
              <div className="mb-6 text-afro-orange flex justify-center">
                <Quote size={48} />
              </div>
              
              <p className="text-lg mb-8 italic">
                No testimonials yet. As customers use your service, their feedback will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
