import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Star, 
  Heart,
  Calendar,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/hooks/useBusinesses';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from 'sonner';

const BusinessDetails = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { business, loading, error } = useBusiness(businessId || '');
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'services' | 'hours'>('overview');

  if (loading) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-afro-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading business details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || "The business you're looking for doesn't exist or has been removed."}
          </p>
            <Button onClick={() => navigate('/')}>
              Go Home
          </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please sign in to book appointments');
      navigate('/login');
      return;
    }
    navigate(`/booking/${businessId}`);
  };

  const handleFavorite = () => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      navigate('/login');
      return;
    }
    toggleFavorite(business.id);
  };

  const formatTime = (time: string) => {
    if (!time) return 'Closed';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Business Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
                      {business.is_verified && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
      </div>

                    {business.categories && (
                      <Badge variant="outline" className="mb-3">
                        {business.categories.name}
                      </Badge>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{business.city}, {business.region}</span>
                      </div>
                      {business.average_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span>{business.average_rating.toFixed(1)}</span>
                          {business.review_count && (
                            <span>({business.review_count} reviews)</span>
                          )}
                </div>
                )}
              </div>

                    {business.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {business.description}
                      </p>
                    )}
            </div>

                  <div className="flex flex-col gap-2 ml-4">
              <Button
                variant="outline"
                      size="sm"
                      onClick={handleFavorite}
                      className={isFavorite(business.id) ? 'text-red-600 border-red-200' : ''}
              >
                      <Heart className={`w-4 h-4 mr-2 ${isFavorite(business.id) ? 'fill-red-600' : ''}`} />
                      {isFavorite(business.id) ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="bg-afro-orange hover:bg-afro-orange/90 flex-1"
                    onClick={handleBookNow}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                  {business.phone && (
                    <Button variant="outline" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          
            {/* Tabs */}
            <Card>
              <CardHeader>
                <div className="flex gap-4 border-b">
                  <button
                    className={`pb-2 px-1 font-medium transition-colors ${
                      selectedTab === 'overview'
                        ? 'text-afro-orange border-b-2 border-afro-orange'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setSelectedTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`pb-2 px-1 font-medium transition-colors ${
                      selectedTab === 'services'
                        ? 'text-afro-orange border-b-2 border-afro-orange'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setSelectedTab('services')}
                  >
                    Services
                  </button>
                  <button
                    className={`pb-2 px-1 font-medium transition-colors ${
                      selectedTab === 'hours'
                        ? 'text-afro-orange border-b-2 border-afro-orange'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setSelectedTab('hours')}
                  >
                    Hours
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {selectedTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Contact Information */}
                      <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        {business.street_address && (
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-700">
                              {business.street_address}, {business.city}, {business.region}
                            </span>
                          </div>
                        )}
                        {business.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-700">{business.phone}</span>
                          </div>
                        )}
                        {business.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-700">{business.email}</span>
                          </div>
                        )}
                        {business.website && (
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-gray-400" />
                            <a 
                              href={business.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Visit Website
                            </a>
                        </div>
                        )}
                      </div>
                    </div>

                    {/* Business Hours Preview */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
                      <div className="space-y-2">
                                                 {(business as any)?.business_hours?.slice(0, 3).map((hour: any) => (
                          <div key={hour.day_of_week} className="flex justify-between text-sm">
                            <span className="text-gray-600">{getDayName(hour.day_of_week)}</span>
                            <span className="text-gray-900">
                              {hour.is_closed ? 'Closed' : `${formatTime(hour.open_time)} - ${formatTime(hour.close_time)}`}
                            </span>
                        </div>
                        ))}
                        <button
                          onClick={() => setSelectedTab('hours')}
                          className="text-afro-orange hover:underline text-sm"
                        >
                          View all hours →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'services' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
                                         {(business as any)?.services && (business as any).services.length > 0 ? (
                       <div className="space-y-4">
                         {(business as any).services.map((service: any) => (
                          <div key={service.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              <span className="font-semibold text-gray-900">
                                N$ {service.price}
                              </span>
                            </div>
                            {service.description && (
                              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                            )}
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{service.duration_minutes} minutes</span>
                              <Button 
                                size="sm"
                                onClick={() => navigate(`/booking/${businessId}?service=${service.id}`)}
                              >
                                Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No services available yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedTab === 'hours' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
                    <div className="space-y-3">
                                             {(business as any)?.business_hours?.map((hour: any) => (
                        <div key={hour.day_of_week} className="flex justify-between items-center py-2">
                          <span className="font-medium text-gray-900">{getDayName(hour.day_of_week)}</span>
                          <span className="text-gray-700">
                            {hour.is_closed ? 'Closed' : `${formatTime(hour.open_time)} - ${formatTime(hour.close_time)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                </div>
              )}
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
                  className="w-full bg-afro-orange hover:bg-afro-orange/90"
                  onClick={handleBookNow}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
                {business.phone && (
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Business
                    </Button>
                  )}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleFavorite}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFavorite(business.id) ? 'fill-red-600' : ''}`} />
                  {isFavorite(business.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </CardContent>
            </Card>

            {/* Business Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <Badge variant={business.status === 'active' ? 'default' : 'secondary'}>
                    {business.status === 'active' ? 'Open' : 'Closed'}
                  </Badge>
              </div>
              
                {business.price_range && (
                  <div>
                    <div className="text-sm text-gray-500">Price Range</div>
                    <div className="text-sm font-medium capitalize">{business.price_range}</div>
                        </div>
                )}

                {business.created_at && (
                  <div>
                    <div className="text-sm text-gray-500">Member Since</div>
                    <div className="text-sm font-medium">
                      {new Date(business.created_at).toLocaleDateString()}
                      </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Booking Information:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Bookings are subject to availability</li>
                      <li>• 24-hour cancellation notice required</li>
                      <li>• Contact business for special requests</li>
                    </ul>
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

export default BusinessDetails;
