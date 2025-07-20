import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  MapPin, 
  Star,
  Heart,
  Filter,
  Grid,
  List,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const BusinessListing = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get search parameters
  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';
  const search = searchParams.get('q') || '';

  // Fetch businesses with filters
  const { businesses, loading, error } = useBusinesses({
    category: category || undefined,
    city: city || undefined,
    search: search || undefined,
    sortBy: 'rating',
    limit: 50
  });

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      if (selectedCategory) params.set('category', selectedCategory);
      setSearchParams(params);
    }
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
  };

  const handleFavorite = (businessId: string) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      navigate('/login');
      return;
    }
    toggleFavorite(businessId);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSearchParams({});
  };

  const categories = [
    { id: '1', name: 'Beauty & Wellness', icon: '💅' },
    { id: '2', name: 'Home Services', icon: '🏠' },
    { id: '3', name: 'Technology', icon: '💻' },
    { id: '4', name: 'Health & Fitness', icon: '💪' },
    { id: '5', name: 'Education', icon: '📚' },
    { id: '6', name: 'Food & Catering', icon: '🍽️' }
  ];

  if (loading) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-afro-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading businesses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Businesses</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
        </div>
  );
  }

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category ? `${category} Businesses` : 'All Businesses'}
          </h1>
          <p className="text-gray-600">
            {businesses.length > 0 
              ? `Found ${businesses.length} business${businesses.length === 1 ? '' : 'es'}`
              : 'No businesses found'
            }
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="bg-afro-orange hover:bg-afro-orange/90">
              Search
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(cat.id)}
                className="text-sm"
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory) && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="text-sm">
                  Search: {searchQuery}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="text-sm">
                  Category: {categories.find(c => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Business List */}
        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory 
                ? 'Try adjusting your search criteria or filters.'
                : 'We\'re still building our business directory. Be the first to join!'
              }
            </p>
            {!searchQuery && !selectedCategory && (
              <Button 
                onClick={() => navigate('/business/register')}
                className="bg-afro-orange hover:bg-afro-orange/90"
              >
                Register Your Business
              </Button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {businesses.map((business) => (
              <Card 
                key={business.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                onClick={() => navigate(`/business/${business.id}`)}
              >
                <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className={viewMode === 'list' ? 'flex items-center gap-4' : ''}>
                    {/* Business Image */}
                    <div className={`${viewMode === 'list' ? 'w-20 h-20' : 'w-full h-32'} mb-3 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden`}>
                      {business.logo_url ? (
                        <img 
                          src={business.logo_url} 
                          alt={business.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-2xl">🏢</div>
                      )}
              </div>
              
                    {/* Business Info */}
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {business.name}
                          </h3>
                          {business.categories && (
                            <Badge variant="outline" className="text-xs mb-2">
                              {business.categories.name}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavorite(business.id);
                          }}
                          className={`p-1 ${isFavorite(business.id) ? 'text-red-600' : 'text-gray-400'}`}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite(business.id) ? 'fill-red-600' : ''}`} />
                        </Button>
              </div>
              
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{business.city}, {business.region}</span>
            </div>
            
                        {business.average_rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span>{business.average_rating.toFixed(1)}</span>
                            {business.review_count && (
                              <span>({business.review_count} reviews)</span>
                            )}
            </div>
        )}

                        {business.is_verified && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            <span className="text-xs">Verified</span>
                          </div>
                        )}
              </div>

                      {business.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {business.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/business/${business.id}`);
                          }}
                        >
                          View Details
                        </Button>
                        {business.phone && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`tel:${business.phone}`);
                            }}
                          >
                            Call
                          </Button>
                        )}
          </div>
              </div>
            </div>
                </CardContent>
          </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessListing;
