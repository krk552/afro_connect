import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/hooks/useBusinesses';
import { useBookings } from '@/hooks/useBookings';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type BusinessWithDetails = Database['public']['Tables']['businesses']['Row'] & {
  categories: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  } | null;
  services: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration_minutes: number;
    category: string;
    is_active: boolean;
    sort_order: number;
  }[];
  business_hours: {
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_closed: boolean;
  }[];
};

const BookingPage = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { createBooking } = useBookings();
  
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Get business details
  const { business, loading: businessLoading, error: businessError } = useBusiness(businessId || '');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        phone: profile.phone || '',
        email: user?.email || ''
      });
    }
  }, [profile, user]);

  useEffect(() => {
    if (business && (business as BusinessWithDetails)?.services && (business as BusinessWithDetails).services.length > 0) {
      setSelectedService((business as BusinessWithDetails).services[0].id);
    }
  }, [business]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to make a booking');
      navigate('/login');
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Please provide your name and phone number');
      return;
    }

    setLoading(true);
    try {
      const selectedServiceData = (business as BusinessWithDetails)?.services?.find(s => s.id === selectedService);
      
      const bookingData = {
        businessId: businessId!,
        serviceId: selectedService,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        notes: notes.trim() || undefined,
        guestCount: 1
      };

      const { data, error } = await createBooking(bookingData);
      
      if (error) throw error;

      toast.success('Booking created successfully!');
      navigate(`/booking/confirmation/${data?.id}`);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!business) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-afro-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading business details...</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedServiceData = (business as BusinessWithDetails)?.services?.find(s => s.id === selectedService);

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">Schedule your appointment with {business.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Selection */}
                  <div>
                    <Label htmlFor="service" className="text-sm font-medium text-gray-700">
                      Select Service *
                    </Label>
                    <div className="mt-2 space-y-2">
                      {(business as BusinessWithDetails)?.services?.map((service) => (
                        <div
                          key={service.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedService === service.id
                              ? 'border-afro-orange bg-afro-orange/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedService(service.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">{service.name}</h3>
                              <p className="text-sm text-gray-600">{service.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                N$ {service.price}
                              </div>
                              <div className="text-sm text-gray-500">
                                {service.duration_minutes} min
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date and Time Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                        Date *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                        Time *
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+264 81 123 4567"
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                      Special Requests or Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests or additional information..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-afro-orange hover:bg-afro-orange/90"
                    disabled={loading}
                  >
                    {loading ? 'Creating Booking...' : 'Confirm Booking'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Business Info Sidebar */}
          <div className="space-y-6">
            {/* Business Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{business.name}</h3>
                  <p className="text-sm text-gray-600">{business.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {business.street_address}, {business.city}
                    </span>
                  </div>
                  
                  {business.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{business.phone}</span>
                    </div>
                  )}
                  
                  {business.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{business.email}</span>
                    </div>
                  )}
                </div>

                {business.categories && (
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {business.categories.name}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Summary */}
            {selectedServiceData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Service:</span>
                    <span className="text-sm font-medium">{selectedServiceData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">{selectedServiceData.duration_minutes} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-sm font-medium">N$ {selectedServiceData.price}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg">N$ {selectedServiceData.price}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Important Notes */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Please arrive 5 minutes before your appointment</li>
                      <li>• Cancellations require 24 hours notice</li>
                      <li>• Contact the business directly for changes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
