
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, Calendar, User } from "lucide-react";

const navItems = [
  {
    name: "Home",
    icon: Home,
    path: "/",
  },
  {
    name: "Search",
    icon: Search,
    path: "/search",
  },
  {
    name: "Favorites",
    icon: Heart,
    path: "/favorites",
  },
  {
    name: "Bookings",
    icon: Calendar,
    path: "/bookings",
  },
  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
];

const BottomNav = () => {
  const location = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
