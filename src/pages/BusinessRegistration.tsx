import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ChevronRight, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useBusinessManagement } from "@/hooks/useBusinessManagement";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";

const BusinessRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBusiness, loading: submitting } = useBusinessManagement();
  const { categories, loading: categoriesLoading } = useCategories();
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    address: "",
    city: "",
    region: "Khomas", // Default region
    phone: "",
    email: "",
    website: "",
    description: "",
    openingHours: {
      monday: { open: "09:00", close: "17:00", isOpen: true },
      tuesday: { open: "09:00", close: "17:00", isOpen: true },
      wednesday: { open: "09:00", close: "17:00", isOpen: true },
      thursday: { open: "09:00", close: "17:00", isOpen: true },
      friday: { open: "09:00", close: "17:00", isOpen: true },
      saturday: { open: "10:00", close: "15:00", isOpen: false },
      sunday: { open: "10:00", close: "15:00", isOpen: false },
    },
    services: [{ name: "", description: "", price: "" }],
    logo: null,
    photos: []
  });
  
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    
    setFormData((prev) => ({
      ...prev,
      services: updatedServices
    }));
  };
  
  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: "", description: "", price: "" }]
    }));
  };
  
  const removeService = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      services: updatedServices
    }));
  };
  
  const handleHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };
  
  const toggleDayOpen = (day) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          isOpen: !prev.openingHours[day].isOpen
        }
      }
    }));
  };
  
  const handleNext = () => {
    // Validation logic would go here
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to register your business.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Validate required fields
    if (!formData.businessName || !formData.category || !formData.address || 
        !formData.city || !formData.phone || !formData.email || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert opening hours to the format expected by the database
      const businessHours = Object.entries(formData.openingHours).map(([day, hours], index) => ({
        day_of_week: index === 6 ? 0 : index + 1, // Sunday = 0, Monday = 1, etc.
        open_time: hours.isOpen ? hours.open : null,
        close_time: hours.isOpen ? hours.close : null,
        is_closed: !hours.isOpen,
      }));

      // Convert services to the format expected by the database
      const services = formData.services
        .filter(service => service.name && service.description && service.price)
        .map(service => ({
          name: service.name,
          description: service.description,
          price: parseFloat(service.price),
          duration_minutes: 60, // Default duration
          currency: "NAD",
          is_active: true,
        }));

      // Create business data object
      const businessData = {
        name: formData.businessName,
        description: formData.description,
        category_id: formData.category,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || undefined,
        street_address: formData.address,
        city: formData.city,
        region: formData.region,
        country: "Namibia",
        price_range: "moderate" as const,
        business_hours: businessHours,
        services: services,
      };

      const result = await createBusiness(businessData);
      
      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Registration submitted successfully!",
        description: "We'll review your information and get back to you shortly.",
      });
      
      // Show success message and then navigate after delay
      setCurrentStep(totalSteps + 1); // Move to success screen
    } catch (error) {
      console.error("Business registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to register business. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Basic Information</h2>
              <p className="text-muted-foreground">Let's start with the basics about your business</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name<span className="text-destructive">*</span></Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Your Business Name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category<span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="" disabled>Loading categories...</SelectItem>
                      ) : categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>No categories available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Business Description<span className="text-destructive">*</span></Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell customers what makes your business special..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe your business in a way that attracts customers. What products or services do you offer?
                    What makes your business unique?
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact & Location</h2>
              <p className="text-muted-foreground">Let customers know where and how to find you</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address<span className="text-destructive">*</span></Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Business Street"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City<span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.city} 
                    onValueChange={(value) => {
                      handleSelectChange("city", value);
                      // Auto-set region based on city
                      const cityRegionMap = {
                        "Windhoek": "Khomas",
                        "Walvis Bay": "Erongo",
                        "Swakopmund": "Erongo",
                        "Oshakati": "Oshana",
                        "Rundu": "Kavango East",
                        "Otjiwarongo": "Otjozondjupa",
                        "Rehoboth": "Hardap",
                        "Keetmanshoop": "Karas",
                        "Tsumeb": "Oshikoto",
                        "Gobabis": "Omaheke",
                        "Katima Mulilo": "Zambezi",
                        "Ondangwa": "Oshana",
                        "Okahandja": "Otjozondjupa",
                        "Outjo": "Kunene"
                      };
                      if (cityRegionMap[value]) {
                        setFormData(prev => ({ ...prev, region: cityRegionMap[value] }));
                      }
                    }}
                  >
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Windhoek">Windhoek</SelectItem>
                      <SelectItem value="Walvis Bay">Walvis Bay</SelectItem>
                      <SelectItem value="Swakopmund">Swakopmund</SelectItem>
                      <SelectItem value="Oshakati">Oshakati</SelectItem>
                      <SelectItem value="Rundu">Rundu</SelectItem>
                      <SelectItem value="Otjiwarongo">Otjiwarongo</SelectItem>
                      <SelectItem value="Rehoboth">Rehoboth</SelectItem>
                      <SelectItem value="Keetmanshoop">Keetmanshoop</SelectItem>
                      <SelectItem value="Tsumeb">Tsumeb</SelectItem>
                      <SelectItem value="Gobabis">Gobabis</SelectItem>
                      <SelectItem value="Katima Mulilo">Katima Mulilo</SelectItem>
                      <SelectItem value="Ondangwa">Ondangwa</SelectItem>
                      <SelectItem value="Okahandja">Okahandja</SelectItem>
                      <SelectItem value="Outjo">Outjo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number<span className="text-destructive">*</span></Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+264 XX XXX XXXX"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address<span className="text-destructive">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="business@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="www.yourbusiness.com"
                />
              </div>
              
              <div className="space-y-4 border rounded-lg p-4 mt-4 bg-muted/20">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Location Preview</h3>
                </div>
                <div className="bg-muted h-[200px] rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Map preview will be available once location is verified</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Business Hours & Services</h2>
              <p className="text-muted-foreground">Let customers know when you're open and what you offer</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Business Hours</h3>
                <div className="space-y-3">
                  {Object.entries(formData.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center gap-3">
                      <div className="w-24 font-medium capitalize">{day}</div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`${day}-open`}
                          checked={hours.isOpen}
                          onChange={() => toggleDayOpen(day)}
                          className="mr-2"
                        />
                        <label htmlFor={`${day}-open`} className="text-sm">
                          {hours.isOpen ? "Open" : "Closed"}
                        </label>
                      </div>
                      {hours.isOpen && (
                        <>
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                              className="w-[120px]"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                              className="w-[120px]"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Services & Offerings</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addService}>
                    Add Service
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {formData.services.map((service, index) => (
                    <div key={index} className="border rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Service {index + 1}</h4>
                        {formData.services.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeService(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`service-name-${index}`}>Service Name</Label>
                          <Input
                            id={`service-name-${index}`}
                            value={service.name}
                            onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                            placeholder="e.g. Haircut, Car Wash, etc."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`service-desc-${index}`}>Description (Optional)</Label>
                          <Input
                            id={`service-desc-${index}`}
                            value={service.description}
                            onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                            placeholder="Brief description of the service"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`service-price-${index}`}>Price (Optional)</Label>
                          <Input
                            id={`service-price-${index}`}
                            value={service.price}
                            onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                            placeholder="N$"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Business Photos</h2>
              <p className="text-muted-foreground">Upload photos that showcase your business</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Logo</Label>
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <div className="mx-auto flex flex-col items-center">
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop your logo here, or click to browse
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setIsUploading(true)}
                    >
                      Upload Logo
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Business Photos (Up to 5)</Label>
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <div className="mx-auto flex flex-col items-center">
                      <svg
                        className="h-12 w-12 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop photos here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload photos that showcase your business, products, or services
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setIsUploading(true)}
                    >
                      Upload Photos
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <h3 className="font-medium">Final Review</h3>
                  <p className="text-sm text-muted-foreground">
                    Please review all information before submitting. Once submitted, our team will verify
                    your business details before publishing your listing.
                  </p>
                  
                  <div className="p-4 bg-primary/10 rounded-md mt-4">
                    <p className="text-sm">
                      By submitting this form, you agree to our{" "}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 5: // Success screen
        return (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Registration Complete!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Thank you for registering your business with AfroBiz Connect. Our team will review your
              submission and get back to you within 24-48 hours.
            </p>
            <div className="pt-6">
              <Button onClick={() => navigate("/")} className="mx-auto">
                Return to Homepage
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 pb-16">
      <div className="max-w-3xl mx-auto">
        {currentStep <= totalSteps && (
          <div className="mb-8 space-y-4">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold">Register Your Business</h1>
              <p className="text-muted-foreground mt-2">
                Join AfroBiz Connect and reach thousands of potential customers in Namibia
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{progress}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        )}
        
        <Card className="p-6">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            {currentStep <= totalSteps && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNext}>
                    Continue <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Registration"}
                  </Button>
                )}
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BusinessRegistration;
