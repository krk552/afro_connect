import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const OnboardingPage = () => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: 'Windhoek'
  });

  const locations = [
    'Windhoek', 'Walvis Bay', 'Swakopmund', 'Oshakati', 
    'Rundu', 'Katima Mulilo', 'Gobabis', 'Otjiwarongo', 'Rehoboth', 'Mariental'
  ];

  // Pre-fill if we have user data
  useEffect(() => {
    if (user?.user_metadata) {
      setFormData({
        firstName: user.user_metadata.first_name || '',
        lastName: user.user_metadata.last_name || '',
        phone: user.user_metadata.phone || '',
        location: 'Windhoek'
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      // Update profile in our users table
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user?.id,
          email: user?.email,
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          phone: formData.phone.trim() || null,
        location_city: formData.location,
          role: 'customer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update auth metadata
      await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          phone: formData.phone.trim(),
          onboarding_completed: true
        }
      });

      await refreshProfile();
      
      toast.success('Welcome to Makna! 🎉');
      navigate('/');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

        return (
    <div className="min-h-screen bg-gradient-to-br from-afro-orange/5 via-white to-afro-blue/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-afro-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-afro-orange" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Makna!
          </h1>
          <p className="text-gray-600">
            Let's get you set up in just a minute
              </p>
            </div>
            
        {/* Quick Setup Form */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone (optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+264 81 123 4567"
                  className="mt-1"
                />
              </div>
              
              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Your location
                </Label>
                <select
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange"
                  required
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                className="w-full bg-afro-orange hover:bg-afro-orange/90 mt-6"
                disabled={loading}
              >
                {loading ? (
                  'Setting up your account...'
                ) : (
                  <>
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Skip Option */}
            <div className="text-center mt-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700"
              >
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">With your account you can:</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Save favorites</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Get notified</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Quick booking</span>
            </div>
          </div>
          </div>
          </div>
    </div>
  );
};

export default OnboardingPage; 