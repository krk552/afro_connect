import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Review = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

type ReviewWithDetails = Review & {
  users: Database['public']['Tables']['users']['Row'] | null;
  businesses: Database['public']['Tables']['businesses']['Row'] | null;
};

interface CreateReviewData {
  businessId: string;
  bookingId?: string;
  rating: number;
  title?: string;
  content?: string;
  serviceRating?: number;
  qualityRating?: number;
  valueRating?: number;
  cleanlinessRating?: number;
}

export function useReviews(businessId?: string) {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('reviews')
        .select(`
          *,
          users (
            id,
            first_name,
            last_name,
            profile_image_url
          ),
          businesses (
            id,
            name,
            slug
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setReviews(data as ReviewWithDetails[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [businessId]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
  };
}

export function useUserReviews() {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUserReviews = async () => {
    if (!user) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users (
            id,
            first_name,
            last_name,
            profile_image_url
          ),
          businesses (
            id,
            name,
            slug,
            logo_url
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setReviews(data as ReviewWithDetails[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, [user]);

  const createReview = async (reviewData: CreateReviewData) => {
    if (!user) {
      return { error: new Error('User must be logged in to create reviews') };
    }

    try {
      const reviewInsert: ReviewInsert = {
        business_id: reviewData.businessId,
        customer_id: user.id,
        booking_id: reviewData.bookingId,
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        service_rating: reviewData.serviceRating,
        quality_rating: reviewData.qualityRating,
        value_rating: reviewData.valueRating,
        cleanliness_rating: reviewData.cleanlinessRating,
        status: 'pending', // Reviews need approval
        is_verified: false,
      };

      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewInsert)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Refresh user reviews
      await fetchUserReviews();

      return { data, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Failed to create review') 
      };
    }
  };

  const updateReview = async (reviewId: string, updates: Partial<CreateReviewData>) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .eq('customer_id', user?.id); // Ensure user can only update their own reviews

      if (error) {
        throw error;
      }

      // Refresh user reviews
      await fetchUserReviews();

      return { error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err : new Error('Failed to update review') 
      };
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('customer_id', user?.id); // Ensure user can only delete their own reviews

      if (error) {
        throw error;
      }

      // Refresh user reviews
      await fetchUserReviews();

      return { error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err : new Error('Failed to delete review') 
      };
    }
  };

  return {
    reviews,
    loading,
    error,
    createReview,
    updateReview,
    deleteReview,
    refetch: fetchUserReviews,
  };
}

export function useBusinessReviews(businessId: string) {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });

  const fetchBusinessReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users (
            id,
            first_name,
            last_name,
            profile_image_url
          )
        `)
        .eq('business_id', businessId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setReviews(data as ReviewWithDetails[]);

      // Calculate statistics
      if (data.length > 0) {
        const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / data.length;

        const ratingDistribution = data.reduce((dist, review) => {
          dist[review.rating as keyof typeof dist]++;
          return dist;
        }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

        setStats({
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: data.length,
          ratingDistribution,
        });
      } else {
        setStats({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch business reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchBusinessReviews();
    }
  }, [businessId]);

  return {
    reviews,
    stats,
    loading,
    error,
    refetch: fetchBusinessReviews,
  };
} 