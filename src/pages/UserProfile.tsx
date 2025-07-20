import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  X,
  Settings,
  LogOut,
  Calendar,
  Heart,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        location: profile.location_city || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const { error } = await updateProfile({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
        location_city: formData.location.trim() || null,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (!user || !profile) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-afro-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
                    </div>
                    
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  {!isEditing ? (
                        <Button 
                          variant="outline" 
                      size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                        </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                    </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    {isEditing ? (
                        <Input
                          id="firstName"
                          name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.first_name || 'Not set'}</p>
                    )}
                      </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    {isEditing ? (
                        <Input
                          id="lastName"
                          name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.last_name || 'Not set'}</p>
                    )}
                  </div>
                      </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                      </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    {isEditing ? (
                        <Input
                          id="phone"
                          name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+264 81 123 4567"
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{profile.phone || 'Not set'}</p>
                    )}
                  </div>
                      </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location
                  </Label>
                  {isEditing ? (
                        <Input
                          id="location"
                          name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Windhoek"
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{profile.location_city || 'Not set'}</p>
                  )}
                </div>

                {/* Account Info */}
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Account Type</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className="capitalize">
                        {profile.role || 'customer'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Member Since</Label>
                    <p className="mt-1 text-gray-900">
                      {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
                      </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
              <Card>
                <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/business/register')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Register Business
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/contact')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                      </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                      </Button>
                </CardContent>
              </Card>
            
            {/* Account Stats */}
              <Card>
                <CardHeader>
                <CardTitle className="text-lg">Account Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Bookings</span>
                  </div>
                  <span className="text-sm font-medium">0</span>
                </div>
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Favorites</span>
                  </div>
                  <span className="text-sm font-medium">0</span>
                </div>
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Reviews</span>
                  </div>
                  <span className="text-sm font-medium">0</span>
                  </div>
                </CardContent>
              </Card>
                  </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
