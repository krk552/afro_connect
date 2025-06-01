import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];
type BookingStatus = Database['public']['Enums']['booking_status'];

export type BookingWithDetails = Booking & {
  businesses: Database['public']['Tables']['businesses']['Row'] | null;
  services: Database['public']['Tables']['services']['Row'] | null;
  users: Database['public']['Tables']['users']['Row'] | null;
};

interface CreateBookingData {
  businessId: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
  guestCount?: number;
}

export function useBookings() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUserBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          businesses (
            id,
            name,
            slug,
            logo_url,
            phone,
            street_address,
            city,
            region
          ),
          services (
            id,
            name,
            description,
            price,
            duration_minutes,
            currency
          ),
          users (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('customer_id', user.id)
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: false });

      if (error) {
        throw error;
      }

      setBookings(data as BookingWithDetails[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [user]);

  const createBooking = async (bookingData: CreateBookingData) => {
    if (!user) {
      return { error: new Error('User must be logged in to create bookings') };
    }

    try {
      // First, get the service details to calculate total amount
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('price, duration_minutes, currency')
        .eq('id', bookingData.serviceId)
        .single();

      if (serviceError) {
        throw serviceError;
      }

      const bookingInsert: BookingInsert = {
        customer_id: user.id,
        business_id: bookingData.businessId,
        service_id: bookingData.serviceId,
        booking_date: bookingData.bookingDate,
        booking_time: bookingData.bookingTime,
        duration_minutes: service.duration_minutes,
        guest_count: bookingData.guestCount || 1,
        service_price: service.price,
        total_amount: service.price || 0,
        currency: service.currency || 'NAD',
        notes: bookingData.notes,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingInsert)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Refresh bookings list
      await fetchUserBookings();

      return { data, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Failed to create booking') 
      };
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus, reason?: string) => {
    try {
      const updateData: BookingUpdate = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'cancelled' && reason) {
        updateData.cancellation_reason = reason;
        updateData.cancelled_at = new Date().toISOString();
      } else if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) {
        throw error;
      }

      // Refresh bookings list
      await fetchUserBookings();

      return { error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err : new Error('Failed to update booking') 
      };
    }
  };

  const cancelBooking = async (bookingId: string, reason: string) => {
    return updateBookingStatus(bookingId, 'cancelled', reason);
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    refetch: fetchUserBookings,
  };
}

export function useBusinessBookings(businessId?: string) {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const fetchBusinessBookings = async () => {
    if (!user || !businessId || profile?.role !== 'business_owner') {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          businesses (
            id,
            name,
            slug,
            logo_url,
            phone,
            street_address,
            city,
            region
          ),
          services (
            id,
            name,
            description,
            price,
            duration_minutes,
            currency
          ),
          users (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('business_id', businessId)
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (error) {
        throw error;
      }

      setBookings(data as BookingWithDetails[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch business bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessBookings();
  }, [user, businessId, profile]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBusinessBookings,
  };
}

export function useBooking(bookingId: string) {
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          businesses (
            id,
            name,
            slug,
            logo_url,
            phone,
            street_address,
            city,
            region,
            email,
            website
          ),
          services (
            id,
            name,
            description,
            price,
            duration_minutes,
            currency,
            category
          ),
          users (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('id', bookingId)
        .single();

      if (error) {
        throw error;
      }

      setBooking(data as BookingWithDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  return {
    booking,
    loading,
    error,
    refetch: fetchBooking,
  };
} 