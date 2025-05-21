
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const SearchResults = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Empty search results
  const searchResults: any[] = [];
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [location.search]);

  return (
    <div className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="my-6">
          <div className="flex items-center mb-2">
            <h1 className="text-2xl font-bold">Search Results</h1>
            <span className="text-muted-foreground ml-2">
              0 results for "{query}"
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for businesses, services..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button>Search</Button>
          </div>
        </div>

        <div className="text-center py-12">
          <SlidersHorizontal className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <h2 className="mt-4 text-xl font-medium">No results found</h2>
          <p className="mt-2 text-muted-foreground">
            No businesses match your search criteria yet. Try a different search or browse all categories.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/categories">Browse Categories</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
