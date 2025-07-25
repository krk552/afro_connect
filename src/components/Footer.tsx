
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center">
              <span className="text-xl font-display font-bold text-white">
                AfroBiz<span className="text-afro-orange">Connect</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              Connecting Namibian consumers to local businesses and services. 
              Discover, book, and enjoy the best local experiences.
            </p>
            <div className="flex mt-6 space-x-5">
              <a href="#" className="hover:text-afro-orange transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-afro-orange transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-afro-orange transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-afro-orange transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5">Categories</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/categories/salons" className="hover:text-afro-orange transition-colors">Hair Salons</Link></li>
              <li><Link to="/categories/home" className="hover:text-afro-orange transition-colors">Home Services</Link></li>
              <li><Link to="/categories/events" className="hover:text-afro-orange transition-colors">Events & Entertainment</Link></li>
              <li><Link to="/categories" className="hover:text-afro-orange transition-colors">View All</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5">Company</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/about" className="hover:text-afro-orange transition-colors">About Us</Link></li>
              <li><Link to="/business/register" className="hover:text-afro-orange transition-colors">For Businesses</Link></li>
              <li><Link to="/contact" className="hover:text-afro-orange transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-5">Contact</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-0.5 text-afro-orange flex-shrink-0" />
                <span>123 Independence Avenue, Windhoek, Namibia</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-afro-orange flex-shrink-0" />
                <span>+264 61 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-afro-orange flex-shrink-0" />
                <span>hello@afrobizconnect.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {currentYear} AfroBiz Connect. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="hover:text-afro-orange transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-afro-orange transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
