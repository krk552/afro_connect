import { useState, useEffect } from "react";
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
  AlertCircle,
  MoreHorizontal,
  Loader2
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
import { useAuth } from "@/contexts/AuthContext";
import { useBookings, BookingWithDetails } from "@/hooks/useBookings";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const BookingHistory = () => {
  const { user } = useAuth();
  const { bookings, loading, updateBookingStatus } = useBookings();
  const [tab, setTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Filter bookings for current user
  const userBookings = bookings?.filter(booking => booking.customer_id === user?.id) || [];

  const upcomingBookings = userBookings.filter(booking => 
    booking.status === "pending" || booking.status === "confirmed"
  );
  
  const pastBookings = userBookings.filter(booking => 
    booking.status === "completed" || booking.status === "cancelled"
  );

  const currentBookings = tab === "upcoming" ? upcomingBookings : pastBookings;

  const filteredBookings = currentBookings.filter(booking =>
    (booking.businesses?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (booking.services?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.booking_date || 0).getTime() - new Date(a.booking_date || 0).getTime();
      case "business":
        return (a.businesses?.name || '').localeCompare(b.businesses?.name || '');
      case "price":
        return (b.total_amount || 0) - (a.total_amount || 0);
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string | null | undefined) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const cancelBooking = async (bookingId: string) => {
    const result = await updateBookingStatus(bookingId, 'cancelled');
    if (result && !result.error) {
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled",
      });
    } else {
      toast({
        title: "Error",
        description: result?.error?.message || "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const canCancelBooking = (booking: BookingWithDetails) => {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') return false;
    
    // Allow cancellation if booking is more than 24 hours away
    const bookingDateTime = new Date(`${booking.booking_date} ${booking.booking_time}`);
    const now = new Date();
    const hoursDiff = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff > 24;
  };

  if (loading) {
    return (
      <div className="pt-16 pb-24 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-16 pb-24 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-muted-foreground mb-6">You need to be signed in to view your booking history.</p>
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const BookingCard = ({ booking }: { booking: BookingWithDetails }) => (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={booking.businesses?.logo_url || undefined} alt={booking.businesses?.name} />
              <AvatarFallback>{(booking.businesses?.name || 'B').charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{booking.businesses?.name || 'Business'}</CardTitle>
              <p className="text-sm text-muted-foreground">{booking.services?.name || 'Service'}</p>
            </div>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatDate(booking.booking_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.booking_time || 'N/A'} ({booking.duration_minutes || 'N/A'} min)</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.businesses?.street_address || 'Address not available'}</span>
          </div>
          {booking.total_amount && booking.total_amount > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{booking.currency || 'N$'} {booking.total_amount}</span>
            </div>
          )}
        </div>

        {booking.notes && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Notes: {booking.notes}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{booking.businesses?.phone || 'N/A'}</span>
          </div>
          
          <div className="flex gap-2">
            {canCancelBooking(booking) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => cancelBooking(booking.id)}
              >
                Cancel
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to={`/business/${booking.business_id}`}>View Business</Link>
                </DropdownMenuItem>
                {booking.status === 'completed' && (
                  <DropdownMenuItem>
                    Leave Review
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  Download Receipt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
