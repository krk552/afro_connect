
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  content: string;
  name: string;
  role: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "AfroBiz Connect has transformed how I find local services. I found an amazing salon through the app that I would have never discovered otherwise.",
    name: "Amara Okafor",
    role: "Customer",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
  },
  {
    id: 2,
    content: "Since listing my restaurant on AfroBiz Connect, we've seen a 30% increase in bookings. The platform has made it easy to reach new customers.",
    name: "Emmanuel Adeyemi",
    role: "Restaurant Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
  {
    id: 3,
    content: "The booking system is seamless and the customer insights have helped me optimize my hair salon's offerings. Highly recommended for local businesses!",
    name: "Grace Mutambo",
    role: "Salon Owner",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

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
            <CardContent className="p-8">
              <div className="mb-6 text-afro-orange">
                <Quote size={48} />
              </div>
              
              <p className="text-lg mb-8 italic">
                {testimonials[currentIndex].content}
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">{testimonials[currentIndex].name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-8 space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant={index === currentIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 p-0 rounded-full ${
                  index === currentIndex ? "bg-afro-orange" : ""
                }`}
              >
                <span className="sr-only">Go to slide {index + 1}</span>
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
