
import { Search, Calendar, Star } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: Search,
    title: "Discover",
    description: "Find local businesses and services based on your location and preferences",
    color: "bg-afro-orange",
  },
  {
    id: 2,
    icon: Calendar,
    title: "Book",
    description: "Schedule appointments or make reservations with just a few clicks",
    color: "bg-afro-green",
  },
  {
    id: 3,
    icon: Star,
    title: "Rate & Review",
    description: "Share your experience and help others find the best local services",
    color: "bg-afro-blue",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AfroBiz Connect makes it easy to find and book local services in just three simple steps
          </p>
        </div>

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
    </section>
  );
};

export default HowItWorks;
