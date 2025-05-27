import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { 
  Calendar, Clock, User, Phone, Mail, MessageSquare, 
  ArrowLeft, Check, Loader2, Star, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useBusiness } from "@/hooks/useBusinesses";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";

const BookingPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get business data and booking hooks
  const { business, loading: businessLoading, error: businessError } = useBusiness(id || '');
  const { createBooking } = useBookings();

  // Pre-select service from URL params
  const preSelectedService = searchParams.get('service');

  useEffect(() => {
    if (preSelectedService && business?.services) {
      const service = business.services.find(s => s.id === preSelectedService);
      if (service) {
        setSelectedService(preSelectedService);
      }
    }
  }, [preSelectedService, business]);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setCustomerName(`${user.first_name || ''} ${user.last_name || ''}`.trim());
      setCustomerEmail(user.email || '');
      setCustomerPhone(user.phone || '');
    }
  }, [user]);

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  // Generate available dates (next 30 days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to make a booking",
        variant: "destructive",
      });
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select a service, date, and time",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedServiceData = business?.services?.find(s => s.id === selectedService);
      
      const bookingData = {
        business_id: id!,
        service_id: selectedService,
        booking_date: selectedDate,
        booking_time: selectedTime,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        notes: notes || undefined,
        total_amount: selectedServiceData?.price || 0,
      };

      const result = await createBooking(bookingData);
      
      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Booking confirmed!",
        description: "Your booking has been successfully created. You will receive a confirmation email shortly.",
      });

      // Redirect to bookings page or business page
      navigate('/bookings');
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (businessLoading) {
    return (
      <div className="pt-16 pb-24 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading business details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (businessError || !business) {
    return (
      <div className="pt-16 pb-24 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Business not found</h2>
          <p className="text-muted-foreground mb-4">
            {businessError || "The business you're trying to book doesn't exist."}
          </p>
          <Button asChild>
            <Link to="/businesses">Browse Businesses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const selectedServiceData = business.services?.find(s => s.id === selectedService);

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to={`/business/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Business
            </Link>
          </Button>
          
          <div className="flex items-start space-x-4">
            <img
              src={business.logo_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035"}
              alt={business.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{business.name}</h1>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{business.city}, {business.region}</span>
              </div>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm font-medium">{business.average_rating?.toFixed(1) || 'N/A'}</span>
                <span className="ml-1 text-sm text-muted-foreground">({business.review_count || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Book an Appointment</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection */}
            <div>
              <Label htmlFor="service">Select Service *</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {business.services?.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{service.name}</span>
                        <span className="ml-4 text-sm text-muted-foreground">
                          {business.currency} {service.price} • {service.duration_minutes}min
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedServiceData && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedServiceData.description}
                </p>
              )}
            </div>
            
            {/* Date Selection */}
                        <div>
              <Label htmlFor="date">Select Date *</Label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a date" />
                </SelectTrigger>
                <SelectContent>
                  {generateAvailableDates().map((date) => (
                    <SelectItem key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                          </div>

            {/* Time Selection */}
            <div>
              <Label htmlFor="time">Select Time *</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots().map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or notes for your appointment"
                  rows={3}
                  />
                </div>
              </div>
              
            {/* Booking Summary */}
            {selectedServiceData && selectedDate && selectedTime && (
              <Card className="p-4 bg-muted/50">
                <h3 className="font-medium mb-2">Booking Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{selectedServiceData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{selectedServiceData.duration_minutes} minutes</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total:</span>
                    <span>{business.currency} {selectedServiceData.price}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting || !selectedService || !selectedDate || !selectedTime}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Booking
                </>
              )}
            </Button>
          </form>
            </Card>
      </div>
    </div>
  );
};

export default BookingPage;
