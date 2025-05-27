import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Business = Database['public']['Tables']['businesses']['Row'];
type BusinessWithCategory = Business & {
  categories: Database['public']['Tables']['categories']['Row'] | null;
  services: Database['public']['Tables']['services']['Row'][];
  business_hours: Database['public']['Tables']['business_hours']['Row'][];
};

interface BusinessFilters {
  category?: string;
  city?: string;
  region?: string;
  priceRange?: Database['public']['Enums']['price_range_enum'];
  rating?: number;
  search?: string;
  featured?: boolean;
  verified?: boolean;
  sortBy?: 'rating' | 'name' | 'newest';
  limit?: number;
}

export function useBusinesses(filters: BusinessFilters = {}) {
  const [businesses, setBusinesses] = useState<BusinessWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('businesses')
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          ),
          services (
            id,
            name,
            description,
            price,
            duration_minutes,
            category,
            is_active
          ),
          business_hours (
            day_of_week,
            open_time,
            close_time,
            is_closed
          )
        `)
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .order('average_rating', { ascending: false });

      // Apply filters
      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters.city) {
        query = query.eq('city', filters.city);
      }

      if (filters.region) {
        query = query.eq('region', filters.region);
      }

      if (filters.priceRange) {
        query = query.eq('price_range', filters.priceRange as Database['public']['Enums']['price_range_enum']);
      }

      if (filters.rating) {
        query = query.gte('average_rating', filters.rating);
      }

      if (filters.featured !== undefined) {
        query = query.eq('is_featured', filters.featured);
      }

      if (filters.verified !== undefined) {
        query = query.eq('is_verified', filters.verified);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'name':
            query = query.order('name', { ascending: true });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'rating':
          default:
            query = query.order('average_rating', { ascending: false });
            break;
        }
      }

      // Apply limit
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setBusinesses(data as BusinessWithCategory[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [JSON.stringify(filters)]);

  return {
    businesses,
    loading,
    error,
    refetch: fetchBusinesses,
  };
}

export function useBusiness(businessId: string) {
  const [business, setBusiness] = useState<BusinessWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          ),
          services (
            id,
            name,
            description,
            price,
            duration_minutes,
            category,
            is_active,
            sort_order
          ),
          business_hours (
            day_of_week,
            open_time,
            close_time,
            is_closed
          )
        `)
        .eq('id', businessId)
        .eq('status', 'active')
        .single();

      if (error) {
        throw error;
      }

      setBusiness(data as BusinessWithCategory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Business not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  return {
    business,
    loading,
    error,
    refetch: fetchBusiness,
  };
}

export function useBusinessesByCategory(categorySlug: string) {
  const [businesses, setBusinesses] = useState<BusinessWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinessesByCategory = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          categories!inner (
            id,
            name,
            slug,
            icon,
            color
          ),
          services (
            id,
            name,
            description,
            price,
            duration_minutes,
            category,
            is_active
          ),
          business_hours (
            day_of_week,
            open_time,
            close_time,
            is_closed
          )
        `)
        .eq('categories.slug', categorySlug)
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .order('average_rating', { ascending: false });

      if (error) {
        throw error;
      }

      setBusinesses(data as BusinessWithCategory[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categorySlug) {
      fetchBusinessesByCategory();
    }
  }, [categorySlug]);

  return {
    businesses,
    loading,
    error,
    refetch: fetchBusinessesByCategory,
  };
}

export function useFeaturedBusinesses(limit: number = 6) {
  const [businesses, setBusinesses] = useState<BusinessWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          ),
          services (
            id,
            name,
            description,
            price,
            duration_minutes,
            category,
            is_active
          ),
          business_hours (
            day_of_week,
            open_time,
            close_time,
            is_closed
          )
        `)
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('average_rating', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      setBusinesses(data as BusinessWithCategory[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedBusinesses();
  }, [limit]);

  return {
    businesses,
    loading,
    error,
    refetch: fetchFeaturedBusinesses,
  };
} 