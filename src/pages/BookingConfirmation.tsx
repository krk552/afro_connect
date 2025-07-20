import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/hooks/useBookings';
import { toast } from 'sonner';

const BookingConfirmation = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings } = useBookings();
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId && bookings.length > 0) {
      const foundBooking = bookings.find(b => b.id === bookingId);
      if (foundBooking) {
        setBooking(foundBooking);
      }
      setLoading(false);
    }
  }, [bookingId, bookings]);

  const handleDownload = () => {
    // In production, this would generate and download a PDF
    toast.info('Download feature coming soon!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Booking Confirmation',
        text: `I've booked an appointment with ${booking?.businesses?.name || 'a business'} on Makna!`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Booking link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-afro-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4 max-w-2xl">
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
            </div>

        {/* Success Message */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Your appointment has been successfully scheduled. You'll receive a confirmation email shortly.
            </p>
          </CardContent>
        </Card>

        {/* Booking Details */}
          <Card className="mb-6">
            <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <div className="text-sm text-gray-500 mb-1">Booking Number</div>
                <div className="font-medium">{booking.booking_number}</div>
                </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Status</div>
                <Badge variant={booking.status === 'pending' ? 'secondary' : 'default'}>
                  {booking.status === 'pending' ? 'Pending Confirmation' : booking.status}
                </Badge>
                </div>
              </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <div className="text-sm text-gray-500 mb-1">Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">
                    {new Date(booking.booking_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                </div>
                <div>
                <div className="text-sm text-gray-500 mb-1">Time</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{booking.booking_time}</span>
                </div>
                </div>
              </div>

            {booking.duration_minutes && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Duration</div>
                <div className="font-medium">{booking.duration_minutes} minutes</div>
              </div>
            )}

            {booking.notes && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Special Requests</div>
                <div className="text-sm bg-gray-50 p-3 rounded-lg">{booking.notes}</div>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Business Information */}
        {booking.businesses && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                <h3 className="font-semibold text-gray-900 mb-2">{booking.businesses.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {booking.businesses.street_address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {booking.businesses.street_address}, {booking.businesses.city}
                      </span>
                    </div>
                  )}
                  {booking.businesses.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{booking.businesses.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Information */}
        {booking.services && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{booking.services.name}</h3>
                  {booking.services.description && (
                    <p className="text-sm text-gray-600 mt-1">{booking.services.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    N$ {booking.total_amount}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.currency}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customer Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
                  <div>
              <div className="text-sm text-gray-500 mb-1">Name</div>
              <div className="font-medium">{booking.customer_name}</div>
            </div>
            {booking.customer_phone && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Phone</div>
                <div className="font-medium">{booking.customer_phone}</div>
              </div>
            )}
            {booking.customer_email && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Email</div>
                <div className="font-medium">{booking.customer_email}</div>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="flex-1 bg-afro-orange hover:bg-afro-orange/90"
            onClick={() => navigate('/bookings')}
          >
            View All Bookings
            </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleDownload}
          >
              <Download className="w-4 h-4 mr-2" />
            Download
            </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleShare}
          >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

        {/* Important Information */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-medium text-blue-900 mb-2">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Please arrive 5 minutes before your appointment</li>
              <li>• Cancellations require 24 hours notice</li>
              <li>• Contact the business directly for any changes</li>
              <li>• You'll receive a reminder 24 hours before your appointment</li>
            </ul>
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default BookingConfirmation;
