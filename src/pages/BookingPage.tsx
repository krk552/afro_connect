
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar as CalendarIcon, Clock } from "lucide-react";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // Placeholder data
  const business = {
    id: id || "1",
    name: "Namibia Hair Studio",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
    services: [
      { id: "1", name: "Women's Haircut", price: "N$250", duration: "45 min" },
      { id: "2", name: "Men's Haircut", price: "N$150", duration: "30 min" },
      { id: "3", name: "Hair Coloring", price: "N$500", duration: "2 hrs" },
      { id: "4", name: "Braiding", price: "N$350", duration: "1.5 hrs" },
      { id: "5", name: "Hair Treatment", price: "N$400", duration: "1 hr" },
    ],
    timeSlots: [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
      "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
      "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
      "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a random booking ID for demo purposes
    const bookingId = Math.floor(Math.random() * 1000000);
    navigate(`/booking/confirmation/${bookingId}`);
  };

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to business
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Book an Appointment</h1>
              <p className="text-muted-foreground mt-1">{business.name}</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* 1. Select Service */}
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-3">1. Select a Service</h2>
                <div className="grid gap-3">
                  {business.services.map((item) => (
                    <Card 
                      key={item.id} 
                      className={`cursor-pointer transition-all ${
                        service === item.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setService(item.id)}
                    >
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="flex text-sm text-muted-foreground mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{item.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{item.price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* 2. Select Date */}
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-3">2. Select a Date</h2>
                <Card>
                  <CardContent className="p-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="mx-auto"
                      disabled={(date) => {
                        // Disable past dates and Sundays
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || date.getDay() === 0;
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
              
              {/* 3. Select Time */}
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-3">3. Select a Time</h2>
                <div className="grid grid-cols-4 gap-2">
                  {business.timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={timeSlot === time ? "default" : "outline"}
                      onClick={() => setTimeSlot(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* 4. Add Notes */}
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-3">4. Additional Notes (Optional)</h2>
                <div className="space-y-2">
                  <Label htmlFor="notes">Special requests or notes for the business</Label>
                  <Input
                    id="notes"
                    placeholder="E.g., Specific stylist preference, health concerns, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!service || !date || !timeSlot}
              >
                Confirm Booking
              </Button>
            </form>
          </div>
          
          <div className="md:w-1/3">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Booking Summary</h3>
                
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden">
                    <img 
                      src={business.image} 
                      alt={business.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{business.name}</h4>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">
                      {service ? business.services.find(s => s.id === service)?.name || 'Not selected' : 'Not selected'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium flex items-center">
                      {date ? (
                        <>
                          <CalendarIcon className="mr-1 h-4 w-4" />
                          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </>
                      ) : 'Not selected'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium flex items-center">
                      {timeSlot ? (
                        <>
                          <Clock className="mr-1 h-4 w-4" />
                          {timeSlot}
                        </>
                      ) : 'Not selected'}
                    </span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between text-lg">
                    <span>Total:</span>
                    <span className="font-bold">
                      {service ? business.services.find(s => s.id === service)?.price || 'N/A' : 'N/A'}
                    </span>
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
