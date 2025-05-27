import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Star, 
  DollarSign, 
  Clock, 
  Filter,
  X,
  SlidersHorizontal
} from "lucide-react";

interface SearchFilters {
  query: string;
  location: string;
  category: string;
  rating: number[];
  priceRange: number[];
  availability: string[];
  amenities: string[];
  sortBy: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

const categories = [
  "All Categories",
  "Hair & Beauty Salon",
  "Restaurant",
  "Auto Services", 
  "Home Services",
  "Cleaning Services",
  "Events & Entertainment",
  "Retail & Shopping",
  "Health & Wellness",
  "Education & Training"
];

const locations = [
  "All Locations",
  "Windhoek",
  "Walvis Bay", 
  "Swakopmund",
  "Oshakati",
  "Rundu",
  "Katima Mulilo",
  "Otjiwarongo",
  "Gobabis"
];

const amenities = [
  "Free WiFi",
  "Parking Available", 
  "Wheelchair Accessible",
  "Credit Card Payment",
  "Air Conditioning",
  "Online Booking",
  "Home Service Available",
  "24/7 Service"
];

const availabilityOptions = [
  "Open Now",
  "Open Today",
  "Open Weekends",
  "24/7 Available"
];

const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "rating", label: "Highest Rated" },
  { value: "distance", label: "Nearest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" }
];

export const AdvancedSearch = ({ onSearch, onClear }: AdvancedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    category: "",
    rating: [0],
    priceRange: [0, 1000],
    availability: [],
    amenities: [],
    sortBy: "relevance"
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    const clearedFilters: SearchFilters = {
      query: "",
      location: "",
      category: "",
      rating: [0],
      priceRange: [0, 1000],
      availability: [],
      amenities: [],
      sortBy: "relevance"
    };
    setFilters(clearedFilters);
    onClear();
  };

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities;
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    updateFilter("amenities", updated);
  };

  const toggleAvailability = (option: string) => {
    const current = filters.availability;
    const updated = current.includes(option)
      ? current.filter(a => a !== option)
      : [...current, option];
    updateFilter("availability", updated);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.location && filters.location !== "All Locations") count++;
    if (filters.category && filters.category !== "All Categories") count++;
    if (filters.rating[0] > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.availability.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    return count;
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search businesses, services, or keywords..."
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        
        <div className="flex gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="h-12 px-4 relative"
              >
                <SlidersHorizontal className="mr-2" size={18} />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Advanced Filters</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleClear}
                      className="text-muted-foreground"
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin size={16} />
                      Location
                    </Label>
                    <Select 
                      value={filters.location} 
                      onValueChange={(value) => updateFilter("location", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={filters.category} 
                      onValueChange={(value) => updateFilter("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Star size={16} />
                      Minimum Rating
                    </Label>
                    <div className="px-2">
                      <Slider
                        value={filters.rating}
                        onValueChange={(value) => updateFilter("rating", value)}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>Any</span>
                        <span className="flex items-center gap-1">
                          {filters.rating[0]} <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <DollarSign size={16} />
                      Price Range (N$)
                    </Label>
                    <div className="px-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => updateFilter("priceRange", value)}
                        max={1000}
                        min={0}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>N${filters.priceRange[0]}</span>
                        <span>N${filters.priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Clock size={16} />
                      Availability
                    </Label>
                    <div className="space-y-2">
                      {availabilityOptions.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={option}
                            checked={filters.availability.includes(option)}
                            onCheckedChange={() => toggleAvailability(option)}
                          />
                          <Label htmlFor={option} className="text-sm font-normal">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities Filter */}
                  <div className="space-y-3">
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                      {amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity}
                            checked={filters.amenities.includes(amenity)}
                            onCheckedChange={() => toggleAmenity(amenity)}
                          />
                          <Label htmlFor={amenity} className="text-sm font-normal">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>

          <Button onClick={handleSearch} className="h-12 px-6">
            Search
          </Button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="sort" className="text-sm">Sort by:</Label>
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => updateFilter("sortBy", value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.query && (
              <Badge variant="secondary" className="gap-1">
                "{filters.query}"
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => updateFilter("query", "")}
                />
              </Badge>
            )}
            {filters.location && filters.location !== "All Locations" && (
              <Badge variant="secondary" className="gap-1">
                <MapPin size={12} />
                {filters.location}
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => updateFilter("location", "")}
                />
              </Badge>
            )}
            {filters.category && filters.category !== "All Categories" && (
              <Badge variant="secondary" className="gap-1">
                {filters.category}
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => updateFilter("category", "")}
                />
              </Badge>
            )}
            {filters.rating[0] > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                {filters.rating[0]}+ stars
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => updateFilter("rating", [0])}
                />
              </Badge>
            )}
            {filters.availability.map((option) => (
              <Badge key={option} variant="secondary" className="gap-1">
                <Clock size={12} />
                {option}
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => toggleAvailability(option)}
                />
              </Badge>
            ))}
            {filters.amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="gap-1">
                {amenity}
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-destructive" 
                  onClick={() => toggleAmenity(amenity)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch; 