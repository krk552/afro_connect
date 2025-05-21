
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, Mail, Phone, MapPin, Edit, LogOut, 
  Calendar, Heart, Settings, Bell, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Maria Nangolo",
    email: "maria.n@example.com",
    phone: "+264 81 123 4567",
    location: "Windhoek, Namibia",
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-6">
              {!isEditing ? (
                <div className="flex flex-col md:flex-row md:items-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956" />
                    <AvatarFallback>MN</AvatarFallback>
                  </Avatar>
                  
                  <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-bold">{profileData.name}</h1>
                        <p className="text-muted-foreground">Member since May 2023</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit Profile
                      </Button>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{profileData.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{profileData.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956" />
                      <AvatarFallback>MN</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="ml-4">
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={profileData.location}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        
          <Tabs defaultValue="bookings">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="favorites">My Favorites</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings" className="mt-6">
              <div className="space-y-4">
                <Link to="/bookings">
                  <Card className="card-hover">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <Calendar className="h-10 w-10 p-2 bg-primary/10 text-primary rounded-md mr-4" />
                        <div>
                          <h3 className="font-medium">Upcoming Appointments</h3>
                          <p className="text-sm text-muted-foreground">View your scheduled appointments</p>
                        </div>
                      </div>
                      <div>2</div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Card className="card-hover">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="h-10 w-10 p-2 bg-muted rounded-md mr-4" />
                      <div>
                        <h3 className="font-medium">Past Appointments</h3>
                        <p className="text-sm text-muted-foreground">View your booking history</p>
                      </div>
                    </div>
                    <div>8</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Favorite Businesses</h3>
                    <Link to="/favorites" className="text-primary text-sm">
                      View All
                    </Link>
                  </div>
                  
                  <div className="text-center py-10">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-4 text-muted-foreground">You don't have any favorites yet</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link to="/categories">Explore Businesses</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Notification Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Booking Reminders</p>
                            <p className="text-sm text-muted-foreground">Receive reminders about upcoming appointments</p>
                          </div>
                        </div>
                        <div>
                          <Button variant="outline" size="sm">Enabled</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Promotion Alerts</p>
                            <p className="text-sm text-muted-foreground">Receive notifications about deals and promotions</p>
                          </div>
                        </div>
                        <div>
                          <Button variant="outline" size="sm">Disabled</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Account Settings</h3>
                    
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/change-password">
                          <Shield className="h-5 w-5 mr-2" />
                          Change Password
                        </Link>
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" asChild>
                        <Link to="/logout">
                          <LogOut className="h-5 w-5 mr-2" />
                          Log Out
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
