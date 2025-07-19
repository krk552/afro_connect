import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Star, 
  TrendingUp, 
  DollarSign,
  Eye,
  MessageSquare,
  Settings,
  Plus,
  Edit,
  Clock,
  MapPin,
  Phone,
  Mail,
  Camera,
  Save,
  Bell,
  Filter,
  Download,
  MoreHorizontal,
  Search,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings, BookingWithDetails } from "@/hooks/useBookings";
import { useBusinesses, BusinessWithCategory } from "@/hooks/useBusinesses";
import useServices, { Service as ServiceType, ServiceInsert } from "@/hooks/useServices";
import { useCategories } from '@/hooks/useCategories';

interface BusinessStats {
  totalBookings: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  profileViews: number;
  responseRate: number;
}

const BusinessDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const { bookings: allBookings, loading: bookingsLoading, updateBookingStatus } = useBookings();
  const { businesses, loading: businessesLoading } = useBusinesses();
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    fetchServicesByBusiness,
    addService,
    updateService,
    deleteService
  } = useServices();
  const { categories: dynamicCategories, loading: categoriesLoading } = useCategories();

  const userBusiness = businesses?.find(b => b.owner_id === user?.id);

  useEffect(() => {
    if (userBusiness?.id) {
      fetchServicesByBusiness(userBusiness.id);
    }
  }, [userBusiness?.id, fetchServicesByBusiness]);

  const businessBookings = allBookings?.filter(b => b.business_id === userBusiness?.id) || [];

  const businessStats: BusinessStats = {
    totalBookings: businessBookings.length,
    monthlyRevenue: businessBookings
      .filter(b => b.booking_date && new Date(b.booking_date).getMonth() === new Date().getMonth())
      .reduce((sum, b) => sum + (b.total_amount || 0), 0),
    averageRating: userBusiness?.average_rating || 0,
    totalReviews: userBusiness?.review_count || 0,
    profileViews: userBusiness?.view_count || 0,
    responseRate: 95
  };

  const recentBookings: BookingWithDetails[] = businessBookings
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleBookingStatusChange = async (bookingId: string, newStatus: BookingWithDetails['status']) => {
    if (!newStatus) {
      toast.error("Invalid status selected");
      return;
    }
    const result = await updateBookingStatus(bookingId, newStatus);
    if (result && !result.error) {
      toast.success(`Booking status changed to ${newStatus}`);
    } else {
      toast.error(result?.error?.message || "Failed to update booking status");
    }
  };

  const handleAddNewService = async () => {
    if (!userBusiness?.id) {
      toast.error("Business not found to add service to.");
      return;
    }
    const newServiceData: ServiceInsert = {
      business_id: userBusiness.id,
      name: "New Awesome Service",
      description: "A detailed description of this new service.",
      price: 100,
      currency: userBusiness.currency || "NAD",
      duration_minutes: 60,
      is_active: true,
    };
    const { error } = await addService(newServiceData);
    if (!error) {
      toast({
        title: "Service added",
        description: "Your new service has been added successfully.",
        variant: "default",
      });
      // Refresh services list
      if (userBusiness?.id) {
        await fetchBusinessServices(userBusiness.id);
      }
    } else {
      toast({
        title: "Failed to add service",
        description: error.message || "An error occurred while adding the service.",
        variant: "destructive",
      });
    }
  };

  if (bookingsLoading || businessesLoading || (userBusiness?.id && servicesLoading)) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userBusiness) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">No Business Found</h1>
            <p className="text-muted-foreground mb-6">
              You don't have a business registered yet. Register your business to access the dashboard.
            </p>
            <Button asChild>
              <Link to="/business/register">Register Your Business</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Business Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage {userBusiness.name} - bookings, services, and analytics
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{businessStats.totalBookings}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {businessStats.totalBookings > 0 ? '+12% from last month' : 'No bookings yet'}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                    <p className="text-2xl font-bold">{userBusiness.currency || 'N$'} {businessStats.monthlyRevenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {businessStats.monthlyRevenue > 0 ? '+8% from last month' : 'No revenue yet'}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold flex items-center">
                      {businessStats.averageRating.toFixed(1)}
                      <Star className="ml-1 h-5 w-5 text-yellow-400 fill-yellow-400" />
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {businessStats.totalReviews} reviews
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                    <p className="text-2xl font-bold">{businessStats.profileViews.toLocaleString()}</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {businessStats.profileViews > 0 ? '+15% from last week' : 'No views yet'}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 lg:grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Bookings</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="#" onClick={() => setActiveTab("bookings")}>View All</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {recentBookings.length > 0 ? (
                      <div className="space-y-4">
                        {recentBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium">
                                  {booking.customer_name || 'Customer'}
                                </p>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {booking.services?.name || 'Service'} • {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'}
                              </p>
                              <p className="text-sm font-medium text-primary">
                                {booking.currency || userBusiness?.currency || 'N$'} {booking.total_amount}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No bookings yet</p>
                        <p className="text-sm text-muted-foreground">
                          Bookings will appear here once customers start booking your services
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex-col">
                        <Plus className="h-6 w-6 mb-2" />
                        Add Service
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Calendar className="h-6 w-6 mb-2" />
                        View Calendar
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <BarChart3 className="h-6 w-6 mb-2" />
                        Analytics
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Settings className="h-6 w-6 mb-2" />
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Bookings</CardTitle>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {businessBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{(booking.customer_name || 'C').split(' ').map(n => n[0])[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{booking.customer_name || 'N/A'}</p>
                                <p className="text-sm text-muted-foreground">{booking.customer_phone || 'N/A'}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.services?.name || 'N/A'}</TableCell>
                          <TableCell>
                            <div>
                              <p>{booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'}</p>
                              <p className="text-sm text-muted-foreground">{booking.booking_time || 'N/A'}</p>
                            </div>
                          </TableCell>
                          <TableCell>{userBusiness?.currency || 'N$'}{booking.total_amount}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleBookingStatusChange(booking.id, "confirmed")}>
                                  Confirm
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBookingStatusChange(booking.id, "completed")}>
                                  Mark Complete
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBookingStatusChange(booking.id, "cancelled")}>
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Your Services</CardTitle>
                  <Button onClick={handleAddNewService}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Service
                  </Button>
                </CardHeader>
                <CardContent>
                  {servicesLoading && <p>Loading services...</p>}
                  {servicesError && <p className="text-red-500">Error loading services: {servicesError.message}</p>}
                  {!servicesLoading && !servicesError && services.length === 0 && (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No services found for this business.</p>
                      <p className="text-sm text-muted-foreground">
                        Click "Add New Service" to get started.
                      </p>
                    </div>
                  )}
                  {!servicesLoading && !servicesError && services.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((service: ServiceType) => (
                        <Card key={service.id} className="relative">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold">{service.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {service.description}
                                </p>
                              </div>
                              <Switch checked={service.is_active || false} />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-lg font-bold text-primary">
                                  {service.currency || userBusiness?.currency || 'N$'}{service.price}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {service.duration_minutes ? `${service.duration_minutes} min` : 'N/A'}
                                </p>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => toast.info(`Edit service: ${service.name} (TODO)`)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Revenue chart would be displayed here</p>
                        <p className="text-sm">Integration with charting library needed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {services.map((service, index) => (
                        <div key={service.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-sm text-muted-foreground">{userBusiness?.currency || 'N$'}{service.price}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{Math.floor(Math.random() * 50) + 10} bookings</p>
                            <p className="text-sm text-muted-foreground">This month</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input id="businessName" defaultValue={userBusiness.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select defaultValue={userBusiness.category_id || undefined}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category"/>
                        </SelectTrigger>
                        <SelectContent>
                          {/* Dynamic categories from database */}
                          {dynamicCategories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue={userBusiness.phone || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue={userBusiness.email || ""} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue={`${userBusiness.street_address || ''}${userBusiness.city ? ', ' + userBusiness.city : ''}`} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea 
                      id="description" 
                      defaultValue={userBusiness.description || ""}
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard; 