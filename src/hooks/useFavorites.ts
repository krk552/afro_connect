import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type UserFavorite = Database['public']['Tables']['user_favorites']['Row'];

type FavoriteWithBusiness = UserFavorite & {
  businesses: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logo_url: string | null;
    cover_image_url: string | null;
    city: string | null;
    region: string | null;
    price_range: Database['public']['Enums']['price_range_enum'] | null;
    average_rating: number | null;
    review_count: number | null;
    is_verified: boolean | null;
    categories: {
      id: string;
      name: string;
      slug: string;
      icon: string | null;
      color: string | null;
    } | null;
  } | null;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteWithBusiness[]>([]);
  const [favoriteBusinessIds, setFavoriteBusinessIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setFavoriteBusinessIds(new Set());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          businesses (
            id,
            name,
            slug,
            description,
            logo_url,
            cover_image_url,
            city,
            region,
            price_range,
            average_rating,
            review_count,
            is_verified,
            categories (
              id,
              name,
              slug,
              icon,
              color
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setFavorites(data as FavoriteWithBusiness[]);

      // Create a set of business IDs for quick lookup
      const businessIds = new Set(
        data
          .map(fav => fav.business_id)
          .filter((id): id is string => id !== null)
      );
      setFavoriteBusinessIds(businessIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const addToFavorites = async (businessId: string) => {
    if (!user) {
      return { error: new Error('User must be logged in to add favorites') };
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          business_id: businessId,
        });

      if (error) {
        throw error;
      }

      // Update local state immediately for better UX
      setFavoriteBusinessIds(prev => new Set([...prev, businessId]));
      
      // Refresh favorites list
      await fetchFavorites();

      return { error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err : new Error('Failed to add to favorites') 
      };
    }
  };

  const removeFromFavorites = async (businessId: string) => {
    if (!user) {
      return { error: new Error('User must be logged in to remove favorites') };
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('business_id', businessId);

      if (error) {
        throw error;
      }

      // Update local state immediately for better UX
      setFavoriteBusinessIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(businessId);
        return newSet;
      });
      
      // Refresh favorites list
      await fetchFavorites();

      return { error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err : new Error('Failed to remove from favorites') 
      };
    }
  };

  const toggleFavorite = async (businessId: string) => {
    if (favoriteBusinessIds.has(businessId)) {
      return removeFromFavorites(businessId);
    } else {
      return addToFavorites(businessId);
    }
  };

  const isFavorite = (businessId: string) => {
    return favoriteBusinessIds.has(businessId);
  };

  return {
    favorites,
    favoriteBusinessIds,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
} 