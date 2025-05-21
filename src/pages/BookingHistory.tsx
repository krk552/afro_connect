
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, Clock, CheckCircle, XCircle, MapPin, 
  ChevronRight, Search, CalendarRange 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const BookingHistory = () => {
  const [tab, setTab] = useState("upcoming");
  
  const upcomingBookings = [
    {
      id: "BK12345",
      status: "confirmed",
      date: "2025-05-25",
      time: "14:00",
      businessId: 1,
      businessName: "Namibia Hair Studio",
      businessImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      service: "Women's Haircut",
      price: "N$250",
      location: "Independence Ave, Windhoek",
    },
    {
      id: "BK12346",
      status: "pending",
      date: "2025-05-30",
      time: "10:00",
      businessId: 2,
      businessName: "Peach Tree Restaurant",
      businessImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      service: "Table Reservation (4 people)",
      price: "N/A",
      location: "Sam Nujoma Dr, Windhoek",
    },
  ];
  
  const pastBookings = [
    {
      id: "BK12340",
      status: "completed",
      date: "2025-05-10",
      time: "11:30",
      businessId: 1,
      businessName: "Namibia Hair Studio",
      businessImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      service: "Hair Treatment",
      price: "N$400",
      location: "Independence Ave, Windhoek",
    },
    {
      id: "BK12338",
      status: "completed",
      date: "2025-05-05",
      time: "19:00",
      businessId: 2,
      businessName: "Peach Tree Restaurant",
      businessImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      service: "Dinner Reservation (2 people)",
      price: "N/A",
      location: "Sam Nujoma Dr, Windhoek",
    },
    {
      id: "BK12335",
      status: "canceled",
      date: "2025-04-28",
      time: "16:00",
      businessId: 3,
      businessName: "Clean & Clear Services",
      businessImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
      service: "Home Cleaning",
      price: "N$350",
      location: "Robert Mugabe Ave, Windhoek",
    },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Confirmed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Completed</Badge>;
      case "canceled":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Canceled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="my-6">
          <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search bookings..."
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="upcoming" onValueChange={setTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-40 h-32 relative">
                          <img
                            src={booking.businessImage}
                            alt={booking.businessName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-4 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link to={`/business/${booking.businessId}`} className="font-bold text-lg hover:text-primary transition-colors">
                                {booking.businessName}
                              </Link>
                              <div className="mt-1">{getStatusBadge(booking.status)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Booking ID</div>
                              <div className="font-mono">{booking.id}</div>
                            </div>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                              <span>{formatDate(booking.date)}, {booking.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-sm">{booking.location}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="text-sm">{booking.service}</div>
                            {booking.price !== "N/A" && (
                              <div className="font-medium">{booking.price}</div>
                            )}
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            {booking.status === "confirmed" && (
                              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                                Cancel
                              </Button>
                            )}
                            <Link to={`/booking/confirmation/${booking.id}`} className="text-primary font-medium text-sm flex items-center ml-auto">
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="mt-4 text-xl font-medium">No upcoming bookings</h2>
                <p className="mt-2 text-muted-foreground">
                  You don't have any upcoming appointments or reservations
                </p>
                <Button className="mt-6" asChild>
                  <Link to="/businesses">Make a Booking</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-40 h-32 relative">
                          <img
                            src={booking.businessImage}
                            alt={booking.businessName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-4 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link to={`/business/${booking.businessId}`} className="font-bold text-lg hover:text-primary transition-colors">
                                {booking.businessName}
                              </Link>
                              <div className="mt-1">{getStatusBadge(booking.status)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Booking ID</div>
                              <div className="font-mono">{booking.id}</div>
                            </div>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                              <span>{formatDate(booking.date)}, {booking.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-sm">{booking.location}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="text-sm">{booking.service}</div>
                            {booking.price !== "N/A" && (
                              <div className="font-medium">{booking.price}</div>
                            )}
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            {booking.status === "completed" && (
                              <Button variant="outline" size="sm">
                                Leave a Review
                              </Button>
                            )}
                            <Link to={`/booking/confirmation/${booking.id}`} className="text-primary font-medium text-sm flex items-center ml-auto">
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <CalendarRange className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="mt-4 text-xl font-medium">No booking history</h2>
                <p className="mt-2 text-muted-foreground">
                  You haven't made any bookings yet
                </p>
                <Button className="mt-6" asChild>
                  <Link to="/businesses">Make Your First Booking</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookingHistory;
