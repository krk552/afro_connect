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

      const { data, error: fetchError } = await supabase
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

      if (fetchError) {
        throw fetchError;
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
      return { data: null, error: new Error('User must be logged in to create bookings') };
    }

    try {
      // First, get the service details to calculate total amount
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('price, duration_minutes, currency, name')
        .eq('id', bookingData.serviceId)
        .single();

      if (serviceError) {
        throw serviceError;
      }

      if (!service) {
        throw new Error('Service not found');
      }

      // Get business details
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('id, owner_id, name')
        .eq('id', bookingData.businessId)
        .single();

      if (businessError) {
        throw businessError;
      }

      if (!business) {
        throw new Error('Business not found');
      }

      // Generate a unique booking number
      const bookingNumber = `BK-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      // Create the booking
      const bookingInsert: BookingInsert = {
        booking_number: bookingNumber,
        customer_id: user.id,
        business_id: bookingData.businessId,
        service_id: bookingData.serviceId,
        booking_date: bookingData.bookingDate,
        booking_time: bookingData.bookingTime,
        duration_minutes: service.duration_minutes,
        guest_count: bookingData.guestCount || 1,
        service_price: service.price,
        total_amount: service.price,
        currency: service.currency || 'NAD',
        notes: bookingData.notes || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customer_name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim(),
        customer_email: user.email || '',
        customer_phone: user.user_metadata?.phone || null,
      };

      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert([bookingInsert])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Send notification to business owner (would be implemented with a trigger in production)
      try {
        await supabase.from('notifications').insert([
          {
            user_id: business.owner_id,
            title: 'New Booking Request',
            message: `You have a new booking request (${bookingNumber}) for ${service.name} on ${bookingData.bookingDate} at ${bookingData.bookingTime}`,
            type: 'booking_confirmed', // Using a valid enum value
            data: { booking_id: data.id },
            is_read: false,
            created_at: new Date().toISOString(),
          }
        ]);
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
        // Don't fail the booking creation if notification fails
      }

      // Refresh the bookings list
      await fetchUserBookings();

      return { data, error: null };
    } catch (err) {
      console.error('Error creating booking:', err);
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
  const { user } = useAuth();

  const fetchBusinessBookings = async () => {
    if (!businessId && !user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // If businessId is provided, use that. Otherwise, fetch all bookings for businesses owned by the user
      const query = supabase
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
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: false });

      // Apply filter based on businessId or user's businesses
      if (businessId) {
        query.eq('business_id', businessId);
      } else if (user) {
        // First get businesses owned by user
        const { data: userBusinesses, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id);

        if (businessError) {
          throw businessError;
        }

        if (userBusinesses && userBusinesses.length > 0) {
          const businessIds = userBusinesses.map(b => b.id);
          query.in('business_id', businessIds);
        } else {
          // No businesses found for user
          setBookings([]);
          setLoading(false);
          return;
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setBookings(data as BookingWithDetails[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, user]);

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
      await fetchBusinessBookings();

      return { error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err : new Error('Failed to update booking') 
      };
    }
  };

  return {
    bookings,
    loading,
    error,
    updateBookingStatus,
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

      const { data, error: fetchError } = await supabase
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
        .eq('id', bookingId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setBooking(data as BookingWithDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch booking');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const updateBookingStatus = async (status: BookingStatus, reason?: string) => {
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

      // Refresh booking data
      await fetchBooking();

      return { error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err : new Error('Failed to update booking') 
      };
    }
  };

  return {
    booking,
    loading,
    error,
    updateBookingStatus,
    refetch: fetchBooking,
  };
}
