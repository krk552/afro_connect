
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedBusinesses from "@/components/FeaturedBusinesses";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import BusinessPromotion from "@/components/BusinessPromotion";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <CategorySection />
        <FeaturedBusinesses />
        <HowItWorks />
        <Testimonials />
        <BusinessPromotion />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
