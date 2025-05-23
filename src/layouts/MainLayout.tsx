
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <div className="md:hidden h-16"></div> {/* Spacer for bottom nav on mobile */}
      <BottomNav />
      <Footer />
    </div>
  );
};

export default MainLayout;
