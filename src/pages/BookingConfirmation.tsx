
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Check, Star, Share2 } from "lucide-react";

const BookingConfirmation = () => {
  const { id } = useParams();
  
  // Placeholder data for demonstration purposes
  const booking = {
    id: id || "123456",
    status: "confirmed",
    date: new Date(),
    time: "10:00 AM",
    service: "Women's Haircut",
    duration: "45 min",
    price: "N$250",
    business: {
      id: "1",
      name: "Namibia Hair Studio",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      address: "15 Independence Ave, Windhoek, Namibia",
    },
  };

  // Format the booking date
  const formattedDate = booking.date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground mt-2">
              Your appointment has been successfully booked.
            </p>
          </div>

          <Card className="p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-md overflow-hidden">
                <img 
                  src={booking.business.image} 
                  alt={booking.business.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{booking.business.name}</h3>
                <Link to={`/business/${booking.business.id}`} className="text-sm text-primary">
                  View business
                </Link>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex">
                <Calendar className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-muted-foreground">
                    {formattedDate} at {booking.time}
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <Clock className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Service Details</p>
                  <p className="text-muted-foreground">
                    {booking.service} · {booking.duration} · {booking.price}
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <MapPin className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{booking.business.address}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-muted p-4 rounded-md flex items-center">
              <div className="flex-1">
                <p className="font-medium">Booking Reference</p>
                <p className="text-muted-foreground select-all">{booking.id}</p>
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            
            <div className="mt-6 space-y-3">
              <Button className="w-full" asChild>
                <Link to="/bookings">View My Bookings</Link>
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link to="/business/1">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Another Service
                </Link>
              </Button>
            </div>
          </Card>
          
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-2">
              Enjoy your appointment? Leave a review afterward.
            </p>
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-1" />
              Remind me to review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
