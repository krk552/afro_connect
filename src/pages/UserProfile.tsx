import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  User, Mail, Phone, MapPin, Edit, LogOut, 
  Calendar, Heart, Settings, Bell, Shield,
  Camera, Star, Clock, Award, TrendingUp,
  CreditCard, Gift, HelpCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import { useFavorites } from "@/hooks/useFavorites";

const UserProfile = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { bookings, loading: bookingsLoading } = useBookings();
  const { favorites, loading: favoritesLoading } = useFavorites();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    joinDate: ""
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    bookingReminders: true,
    language: "en",
    currency: "NAD"
  });

  // Load user data when profile is available
  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        location: profile.location_city ? `${profile.location_city}${profile.location_region ? ', ' + profile.location_region : ''}` : "",
        bio: "", // Bio field doesn't exist in users table yet
        joinDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }) : ""
      });
    } else if (user && !profile) {
      // Fallback to user metadata if profile not loaded
      setProfileData({
        firstName: user.user_metadata?.first_name || "",
        lastName: user.user_metadata?.last_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        location: "",
        bio: "",
        joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }) : ""
      });
    }
  }, [profile, user]);

  // Filter bookings for current user
  const userBookings = bookings?.filter(b => b.customer_id === user?.id) || [];
  const completedBookings = userBookings.filter(b => b.status === 'completed');
  const upcomingBookings = userBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const userStats = {
    totalBookings: userBookings.length,
    favoriteBusinesses: favorites?.length || 0,
    reviewsWritten: 0, // TODO: Implement when reviews are connected
    membershipLevel: userBookings.length >= 10 ? "Gold" : userBookings.length >= 5 ? "Silver" : "Bronze"
  };

  // Generate real activity data from user actions
  const generateActivityFeed = () => {
    const activities: any[] = [];

    // Add recent bookings as activities
    userBookings
      .slice(0, 5) // Get last 5 bookings
      .forEach(booking => {
        if (booking.created_at) {
          activities.push({
            id: `booking-${booking.id}`,
            type: 'booking',
            message: `Booked appointment at ${booking.businesses?.name || 'a business'}`,
            date: new Date(booking.created_at),
            dotColor: 'bg-green-500',
            bgColor: 'bg-green-50'
          });
        }
      });

    // Add recent favorites as activities
    favorites
      ?.slice(0, 3) // Get last 3 favorites
      .forEach(favorite => {
        if (favorite.created_at) {
          activities.push({
            id: `favorite-${favorite.id}`,
            type: 'favorite',
            message: `Added ${favorite.businesses?.name || 'a business'} to favorites`,
            date: new Date(favorite.created_at),
            dotColor: 'bg-purple-500',
            bgColor: 'bg-purple-50'
          });
        }
      });

    // Sort by date (newest first) and return top 10
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  };

  const recentActivities = generateActivityFeed();

  // Helper function to format relative time
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  if (authLoading) {
    return (
      <div className="pt-16 pb-24 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-16 pb-24 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-muted-foreground mb-6">You need to be signed in to view your profile.</p>
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated successfully! ✨",
      description: "Your profile information has been saved.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const StatCard = ({ icon: Icon, title, value, color, loading = false }: { 
    icon: any, title: string, value: string | number, color: string, loading?: boolean 
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <p className="text-xl font-bold">{value}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-16 pb-24 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <Card className="mb-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              {!isEditing ? (
                <div>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                        <AvatarImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956" />
                        <AvatarFallback className="text-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Badge className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                        {userStats.membershipLevel}
                      </Badge>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {profileData.firstName} {profileData.lastName}
                          </h1>
                          <p className="text-muted-foreground mt-1">Member since {profileData.joinDate}</p>
                          {profileData.bio && (
                            <p className="text-sm text-muted-foreground mt-2 max-w-md">{profileData.bio}</p>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(true)}
                          className="border-2 hover:border-purple-300"
                        >
                          <Edit className="h-4 w-4 mr-2" /> 
                          Edit Profile
                        </Button>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-purple-500" />
                          <span>{profileData.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-purple-500" />
                          <span>{profileData.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-purple-500" />
                          <span>{profileData.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                      icon={Calendar} 
                      title="Total Bookings" 
                      value={userStats.totalBookings} 
                      color="bg-gradient-to-r from-blue-500 to-blue-600"
                      loading={bookingsLoading}
                    />
                    <StatCard 
                      icon={Heart} 
                      title="Favorites" 
                      value={userStats.favoriteBusinesses} 
                      color="bg-gradient-to-r from-red-500 to-pink-500"
                      loading={favoritesLoading}
                    />
                    <StatCard 
                      icon={Star} 
                      title="Reviews Written" 
                      value={userStats.reviewsWritten} 
                      color="bg-gradient-to-r from-yellow-500 to-orange-500"
                    />
                    <StatCard 
                      icon={Award} 
                      title="Membership Level" 
                      value={userStats.membershipLevel} 
                      color="bg-gradient-to-r from-purple-500 to-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                        <AvatarImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956" />
                        <AvatarFallback className="text-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                          {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full border-2 bg-white"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Edit Profile</h2>
                      <p className="text-muted-foreground">Update your personal information</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleChange}
                          className="border-2 focus:border-purple-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleChange}
                          className="border-2 focus:border-purple-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleChange}
                          className="border-2 focus:border-purple-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                          className="border-2 focus:border-purple-300"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={profileData.location}
                          onChange={handleChange}
                          className="border-2 focus:border-purple-300"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleChange}
                          placeholder="Tell us a bit about yourself..."
                          className="border-2 focus:border-purple-300"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        
          <Tabs defaultValue="activity" className="space-y-6">
            <TabsList className="grid grid-cols-4 h-12">
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className={`flex items-center gap-4 p-3 rounded-lg ${activity.bgColor}`}>
                        <div className={`w-2 h-2 ${activity.dotColor} rounded-full`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.date)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No recent activity</p>
                      <p className="text-sm text-muted-foreground">
                        Start exploring businesses and making bookings to see your activity here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bookings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/bookings">
                  <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">Upcoming Appointments</h3>
                          <p className="text-sm text-muted-foreground">View and manage your scheduled appointments</p>
                          <p className="text-2xl font-bold text-blue-600 mt-2">{upcomingBookings.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/bookings">
                  <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">Booking History</h3>
                          <p className="text-sm text-muted-foreground">View your past appointments and experiences</p>
                          <p className="text-2xl font-bold text-gray-600 mt-2">{userStats.totalBookings}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Favorite Businesses
                    </CardTitle>
                    <Link to="/favorites">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {userStats.favoriteBusinesses > 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">You have {userStats.favoriteBusinesses} favorites!</h3>
                      <p className="text-muted-foreground mb-4">Your favorite businesses are just a click away</p>
                      <Button asChild>
                        <Link to="/favorites">View Favorites</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <p className="text-muted-foreground mb-4">You don't have any favorites yet</p>
                      <Button variant="outline" asChild>
                        <Link to="/businesses">Explore Businesses</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive booking confirmations and updates</p>
                    </div>
                    <Switch 
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Get text reminders for appointments</p>
                    </div>
                    <Switch 
                      checked={preferences.smsNotifications}
                      onCheckedChange={(checked) => handlePreferenceChange('smsNotifications', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Receive promotions and special offers</p>
                    </div>
                    <Switch 
                      checked={preferences.marketingEmails}
                      onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Booking Reminders</p>
                      <p className="text-sm text-muted-foreground">Get reminded about upcoming appointments</p>
                    </div>
                    <Switch 
                      checked={preferences.bookingReminders}
                      onCheckedChange={(checked) => handlePreferenceChange('bookingReminders', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    App Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="af">Afrikaans</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={preferences.currency} onValueChange={(value) => handlePreferenceChange('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NAD">Namibian Dollar (N$)</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Account & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Gift className="h-4 w-4 mr-2" />
                    Referral Program
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help & Support
                  </Button>
                  <Separator />
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
