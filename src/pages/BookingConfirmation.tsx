import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Calendar, Clock, MapPin, User, Phone, Mail, Star, Download, Share2 } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const { bookings, loading, error } = useBookings();

  // Find the specific booking
  const booking = bookings?.find(b => b.id === bookingId);

  if (loading) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Booking Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the booking you're looking for.
            </p>
            <Button asChild>
              <Link to="/bookings">View All Bookings</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get customer info from booking or user
  const customerInfo = {
    name: booking.customer_name || (user ? `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() : 'Customer'),
    email: booking.customer_email || user?.email || '',
    phone: booking.customer_phone || user?.user_metadata?.phone || ''
  };

  return (
    <div className="pt-16 pb-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Your booking has been successfully confirmed. You'll receive a confirmation email shortly.
            </p>
          </div>

          {/* Booking Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Booking Details</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Booking #{booking.booking_number}
                  </p>
                </div>
                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service Info */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Service</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.services?.name || 'Service'}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Date & Time</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.booking_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.booking_time} {booking.duration_minutes && `(${booking.duration_minutes} minutes)`}
                  </p>
                </div>
              </div>

              {/* Business Info */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Business</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.businesses?.name || 'Business Name'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.businesses?.street_address}, {booking.businesses?.city}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Customer Information</h3>
                  <p className="text-sm text-muted-foreground">{customerInfo.name}</p>
                  {customerInfo.email && (
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {customerInfo.email}
                    </p>
                  )}
                  {customerInfo.phone && (
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {customerInfo.phone}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Service Price</span>
                  <span>{booking.currency} {booking.service_price}</span>
                </div>
                {booking.additional_fees > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Additional Fees</span>
                    <span>{booking.currency} {booking.additional_fees}</span>
                  </div>
                )}
                {booking.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{booking.currency} {booking.discount_amount}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span>{booking.currency} {booking.total_amount}</span>
                </div>
              </div>

              {booking.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-1">Notes</h3>
                    <p className="text-sm text-muted-foreground">{booking.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button className="flex-1" asChild>
              <Link to="/bookings">View All Bookings</Link>
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-primary">1</span>
                </div>
                <p className="text-sm">You'll receive a confirmation email with all the details</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-primary">2</span>
                </div>
                <p className="text-sm">The business will contact you if any changes are needed</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-primary">3</span>
                </div>
                <p className="text-sm">Arrive on time for your appointment</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-primary">4</span>
                </div>
                <p className="text-sm">Don't forget to leave a review after your service</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
