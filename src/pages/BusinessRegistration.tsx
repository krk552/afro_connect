import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessManagement } from "@/hooks/useBusinessManagement";
import { useCategories } from "@/hooks/useCategories";
import { 
  Store, 
  ArrowRight, 
  CheckCircle,
  Star,
  Users,
  Clock,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

const BusinessRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBusiness, loading: submitting } = useBusinessManagement();
  const { categories, loading: categoriesLoading } = useCategories();
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    address: "",
    city: "Windhoek",
    phone: "",
    email: user?.email || "",
    description: "",
  });

  const cities = [
    "Windhoek", "Walvis Bay", "Swakopmund", "Oshakati", 
    "Rundu", "Katima Mulilo", "Gobabis", "Otjiwarongo"
  ];

  const benefits = [
    { icon: Users, title: "Reach New Customers", desc: "Connect with locals looking for your services" },
    { icon: Clock, title: "Manage Bookings", desc: "Easy appointment scheduling and management" },
    { icon: Star, title: "Build Your Reputation", desc: "Get reviews and grow your online presence" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessName.trim() || !formData.category || !formData.phone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const businessData = {
        name: formData.businessName.trim(),
        category_id: formData.category,
        street_address: formData.address.trim(),
        city: formData.city,
        region: "Khomas", // Default for now
        country: "Namibia",
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        description: formData.description.trim(),
        price_range: "moderate" as const,
        business_hours: [
          { day_of_week: 1, open_time: "09:00", close_time: "17:00", is_closed: false },
          { day_of_week: 2, open_time: "09:00", close_time: "17:00", is_closed: false },
          { day_of_week: 3, open_time: "09:00", close_time: "17:00", is_closed: false },
          { day_of_week: 4, open_time: "09:00", close_time: "17:00", is_closed: false },
          { day_of_week: 5, open_time: "09:00", close_time: "17:00", is_closed: false },
          { day_of_week: 6, open_time: "10:00", close_time: "15:00", is_closed: false },
          { day_of_week: 0, open_time: "10:00", close_time: "15:00", is_closed: true }
        ],
        services: [
          {
            name: "General Service",
            description: "Our main service offering",
            price: 100,
            duration_minutes: 60,
            currency: "NAD",
            is_active: true
          }
        ]
      };

      const result = await createBusiness(businessData);
      
      if (result.error) {
        throw result.error;
      }

      toast.success("🎉 Business registered successfully! We'll review your application and get back to you soon.");
      navigate('/business/status');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Failed to register business. Please try again.");
    }
  };

        return (
    <div className="min-h-screen bg-gradient-to-br from-afro-orange/5 via-white to-afro-blue/5">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-afro-orange rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Makna for Business</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Back to Makna
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Benefits */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-afro-orange" />
                <span className="text-sm font-medium text-afro-orange">JOIN MAKNA TODAY</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Grow Your Business with Makna
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Join Namibia's local services marketplace and connect with customers 
                who need your services. Start growing your business today.
              </p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-afro-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-afro-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                  </div>
                </div>
              ))}
                </div>
                
            {/* Platform Benefits */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">✨ Platform Benefits</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Free business profile creation</span>
                        </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Easy booking management</span>
                        </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Customer reviews and ratings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Register Your Business
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Takes less than 2 minutes
                  </p>
            </div>
            
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Business Name */}
                  <div>
                    <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                      Business Name *
                    </Label>
                  <Input
                      id="businessName"
                      name="businessName"
                      type="text"
                      value={formData.businessName}
                    onChange={handleInputChange}
                      placeholder="e.g. Maria's Hair Salon"
                      className="mt-1"
                    required
                  />
                </div>
                
                  {/* Category */}
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Business Category *
                    </Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                        City *
                      </Label>
                      <select
                        id="city"
                        name="city"
                    value={formData.city} 
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange"
                        required
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                        Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address"
                        className="mt-1"
                      />
                </div>
              </div>
              
                  {/* Contact */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number *
                      </Label>
                  <Input
                    id="phone"
                    name="phone"
                        type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                        placeholder="+264 81 123 4567"
                        className="mt-1"
                    required
                  />
                </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                        placeholder="your@business.com"
                        className="mt-1"
                  />
                </div>
              </div>
              
                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Business Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                  onChange={handleInputChange}
                      placeholder="Tell customers about your services..."
                      rows={3}
                      className="mt-1"
                />
              </div>
              
                  {/* Submit */}
                  <Button 
                    type="submit" 
                    className="w-full bg-afro-orange hover:bg-afro-orange/90 py-3 mt-6"
                    disabled={submitting || categoriesLoading}
                  >
                    {submitting ? (
                      'Registering Your Business...'
                    ) : (
                      <>
                        Register My Business
                        <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By registering, you agree to our Terms of Service and Privacy Policy. 
                    We'll review your application within 24 hours.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistration;
