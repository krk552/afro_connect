import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Search, 
  CalendarRange, 
  Clock, 
  MapPin, 
  Star,
  DollarSign,
  Phone,
  MessageCircle,
  Download,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  businessName: string;
  businessImage: string;
  businessAddress: string;
  businessPhone: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  duration: string;
  status: "upcoming" | "completed" | "cancelled" | "confirmed" | "pending";
  rating?: number;
  review?: string;
  bookingDate: string;
  canCancel: boolean;
  canReschedule: boolean;
}

const BookingHistory = () => {
  const [tab, setTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Mock booking data
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "123456",
      businessName: "Namibia Hair Studio",
      businessImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      businessAddress: "15 Independence Ave, Windhoek",
      businessPhone: "+264 61 123 4567",
      serviceName: "Women's Haircut & Styling",
      servicePrice: 250,
      date: "2024-01-25",
      time: "10:00 AM",
      duration: "45 minutes",
      status: "confirmed",
      bookingDate: "2024-01-20",
      canCancel: true,
      canReschedule: true
    },
    {
      id: "789012",
      businessName: "Desert Rose Spa",
      businessImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
      businessAddress: "Klein Windhoek",
      businessPhone: "+264 61 987 6543",
      serviceName: "Relaxing Full Body Massage",
      servicePrice: 450,
      date: "2024-01-30",
      time: "2:00 PM",
      duration: "90 minutes",
      status: "upcoming",
      bookingDate: "2024-01-18",
      canCancel: true,
      canReschedule: true
    },
    {
      id: "345678",
      businessName: "Kalahari Auto Care",
      businessImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3",
      businessAddress: "Northern Industrial Area",
      businessPhone: "+264 61 555 0123",
      serviceName: "Full Service Oil Change",
      servicePrice: 180,
      date: "2024-01-15",
      time: "9:00 AM",
      duration: "30 minutes",
      status: "completed",
      rating: 5,
      review: "Excellent service! Very professional and quick.",
      bookingDate: "2024-01-10",
      canCancel: false,
      canReschedule: false
    },
    {
      id: "901234",
      businessName: "Taste of Africa Restaurant",
      businessImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      businessAddress: "City Center, Windhoek",
      businessPhone: "+264 61 444 5678",
      serviceName: "Table Reservation for 4",
      servicePrice: 0,
      date: "2024-01-12",
      time: "7:00 PM",
      duration: "2 hours",
      status: "completed",
      rating: 4,
      bookingDate: "2024-01-08",
      canCancel: false,
      canReschedule: false
    },
    {
      id: "567890",
      businessName: "Windhoek Fitness Center",
      businessImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      businessAddress: "Olympia, Windhoek",
      businessPhone: "+264 61 333 9876",
      serviceName: "Personal Training Session",
      servicePrice: 300,
      date: "2024-01-08",
      time: "6:00 AM",
      duration: "60 minutes",
      status: "cancelled",
      bookingDate: "2024-01-05",
      canCancel: false,
      canReschedule: false
    }
  ]);

  const upcomingBookings = bookings.filter(booking => 
    booking.status === "upcoming" || booking.status === "confirmed" || booking.status === "pending"
  );
  
  const pastBookings = bookings.filter(booking => 
    booking.status === "completed" || booking.status === "cancelled"
  );

  const currentBookings = tab === "upcoming" ? upcomingBookings : pastBookings;

  const filteredBookings = currentBookings.filter(booking =>
    booking.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "business":
        return a.businessName.localeCompare(b.businessName);
      case "price":
        return b.servicePrice - a.servicePrice;
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "cancelled" as const, canCancel: false, canReschedule: false }
          : booking
      )
    );
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been successfully cancelled",
    });
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={booking.businessImage} alt={booking.businessName} />
              <AvatarFallback>{booking.businessName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{booking.businessName}</CardTitle>
              <p className="text-sm text-muted-foreground">{booking.serviceName}</p>
            </div>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.time} ({booking.duration})</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.businessAddress}</span>
          </div>
          {booking.servicePrice > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">N${booking.servicePrice}</span>
            </div>
          )}
        </div>

        {booking.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < booking.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Your rating</span>
          </div>
        )}

        {booking.review && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm italic">"{booking.review}"</p>
          </div>
        )}

        <Separator />

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/business/${booking.id.slice(0, 1)}`}>
              View Business
            </Link>
          </Button>
          
          {booking.status === "completed" && !booking.rating && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/review/${booking.id}`}>
                <Star className="h-4 w-4 mr-1" />
                Leave Review
              </Link>
            </Button>
          )}
          
          {booking.canReschedule && (
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Reschedule
            </Button>
          )}
          
          {booking.canCancel && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => cancelBooking(booking.id)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
          
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
          
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-1" />
            Message
          </Button>
          
          {booking.status === "completed" && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Receipt
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-16 pb-24 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage your appointments and reservations
          </p>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="business">Sort by Business</SelectItem>
              <SelectItem value="price">Sort by Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="upcoming" onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4" />
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {sortedBookings.length === 0 ? (
            <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Calendar className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-indigo-400 rounded-full animate-pulse delay-300"></div>
                </div>
                
                <h2 className="text-2xl font-bold mb-2">
                  {upcomingBookings.length === 0 ? "No upcoming bookings" : "No matches found"}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {upcomingBookings.length === 0 
                    ? "You don't have any upcoming appointments or reservations"
                    : "Try adjusting your search criteria"
                  }
                </p>
                
                <Button size="lg" asChild>
                  <Link to="/businesses">
                    <Calendar className="mr-2 h-5 w-5" />
                    Make a Booking
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
            </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {sortedBookings.length === 0 ? (
            <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CalendarRange className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                </div>
                
                <h2 className="text-2xl font-bold mb-2">
                  {pastBookings.length === 0 ? "No booking history" : "No matches found"}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {pastBookings.length === 0 
                    ? "You haven't made any bookings yet"
                    : "Try adjusting your search criteria"
                  }
                </p>
                
                <Button size="lg" asChild>
                  <Link to="/businesses">
                    <Calendar className="mr-2 h-5 w-5" />
                    Make Your First Booking
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
            </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookingHistory;
