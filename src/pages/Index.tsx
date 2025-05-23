
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedBusinesses from "@/components/FeaturedBusinesses";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import BusinessPromotion from "@/components/BusinessPromotion";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-16"> {/* Add top padding to prevent content overlap with navbar */}
        <Hero />
        <CategorySection />
        <FeaturedBusinesses />
        <HowItWorks />
        <Testimonials />
        <BusinessPromotion />
      </main>
    </div>
  );
};

export default Index;
