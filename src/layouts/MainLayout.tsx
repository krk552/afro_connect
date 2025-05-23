
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        <Outlet />
      </main>
      <div className="md:hidden h-16"></div> {/* Spacer for bottom nav on mobile */}
      <BottomNav />
      <Footer />
    </div>
  );
};

export default MainLayout;
