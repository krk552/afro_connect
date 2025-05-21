
import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Search, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";

const BookingHistory = () => {
  const [tab, setTab] = useState("upcoming");
  
  // Empty booking arrays
  const upcomingBookings: any[] = [];
  const pastBookings: any[] = [];

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
          </TabsContent>
          
          <TabsContent value="past">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookingHistory;
