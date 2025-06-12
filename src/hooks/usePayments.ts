import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type Payment = Database['public']['Tables']['payments']['Row'];
type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
type PaymentStatus = Database['public']['Enums']['payment_status'];

interface CreatePaymentData {
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer' | 'cash';
  paymentReference?: string;
}

export function usePayments() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  /**
   * Create a new payment for a booking
   */
  const createPayment = async (paymentData: CreatePaymentData) => {
    if (!user) {
      return { data: null, error: new Error('User must be logged in to make payments') };
    }

    setLoading(true);
    setError(null);

    try {
      // First, get the booking details to verify the amount and customer
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', paymentData.bookingId)
        .single();

      if (bookingError) {
        throw bookingError;
      }

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Verify that the user is the customer for this booking
      if (booking.customer_id !== user.id) {
        throw new Error('You can only make payments for your own bookings');
      }

      // Verify the payment amount matches the booking total
      if (paymentData.amount !== booking.total_amount) {
        throw new Error(`Payment amount must match booking total: ${booking.total_amount} ${booking.currency}`);
      }

      // Generate a unique payment reference if not provided
      const paymentReference = paymentData.paymentReference || 
        `PAY-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      // In a real implementation, you would integrate with a payment gateway here
      // For now, we'll simulate a successful payment

      // Create the payment record
      const paymentInsert: PaymentInsert = {
        booking_id: paymentData.bookingId,
        customer_id: user.id,
        business_id: booking.business_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_method: paymentData.paymentMethod,
        payment_reference: paymentReference,
        status: 'completed', // In a real implementation, this would initially be 'pending'
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(), // In a real implementation, this would be set when payment is confirmed
      };

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert([paymentInsert])
        .select()
        .single();

      if (paymentError) {
        throw paymentError;
      }

      // Update the booking status to 'confirmed' since payment is completed
      await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          confirmed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentData.bookingId);

      // Send notification to business owner about the payment
      await supabase.from('notifications').insert([
        {
          user_id: booking.business_id, // This should be the business owner's ID in a real implementation
          title: 'Payment Received',
          message: `Payment of ${paymentData.amount} ${paymentData.currency} received for booking ${booking.booking_number}`,
          type: 'payment_received',
          data: { 
            booking_id: booking.id,
            payment_id: payment.id,
            amount: paymentData.amount,
            currency: paymentData.currency
          },
          is_read: false,
          created_at: new Date().toISOString(),
        }
      ]);

      // Send notification to customer about the payment
      await supabase.from('notifications').insert([
        {
          user_id: user.id,
          title: 'Payment Successful',
          message: `Your payment of ${paymentData.amount} ${paymentData.currency} for booking ${booking.booking_number} was successful`,
          type: 'payment_confirmed',
          data: { 
            booking_id: booking.id,
            payment_id: payment.id,
            amount: paymentData.amount,
            currency: paymentData.currency
          },
          is_read: false,
          created_at: new Date().toISOString(),
        }
      ]);

      toast.success('Payment successful!');

      return { data: payment, error: null };
    } catch (err) {
      console.error('Error creating payment:', err);
      setError(err instanceof Error ? err : new Error('Failed to process payment'));
      
      toast.error(err instanceof Error ? err.message : 'Failed to process payment');
      
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Failed to process payment') 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch payments for a user
   */
  const fetchUserPayments = async () => {
    if (!user) {
      return { data: [], error: new Error('User must be logged in to view payments') };
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('payments')
        .select(`
          *,
          bookings (
            id,
            booking_number,
            service_id,
            business_id,
            booking_date,
            booking_time,
            status
          ),
          businesses (
            id,
            name,
            logo_url
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setPayments(data || []);
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch payments'));
      
      return { 
        data: [], 
        error: err instanceof Error ? err : new Error('Failed to fetch payments') 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch payments for a business
   */
  const fetchBusinessPayments = async (businessId: string) => {
    if (!user) {
      return { data: [], error: new Error('User must be logged in to view business payments') };
    }

    setLoading(true);
    setError(null);

    try {
      // First, verify that the user owns this business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .eq('owner_id', user.id)
        .single();

      if (businessError) {
        throw businessError;
      }

      if (!business) {
        throw new Error('Business not found or you do not have permission to view its payments');
      }

      const { data, error: fetchError } = await supabase
        .from('payments')
        .select(`
          *,
          bookings (
            id,
            booking_number,
            service_id,
            customer_id,
            booking_date,
            booking_time,
            status
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
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setPayments(data || []);
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Error fetching business payments:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch business payments'));
      
      return { 
        data: [], 
        error: err instanceof Error ? err : new Error('Failed to fetch business payments') 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update payment status (for admin or business owner)
   */
  const updatePaymentStatus = async (paymentId: string, status: PaymentStatus) => {
    if (!user) {
      return { error: new Error('User must be logged in to update payment status') };
    }

    setLoading(true);
    setError(null);

    try {
      // Get the payment details
      const { data: payment, error: fetchError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Verify that the user is authorized (business owner or admin)
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('owner_id')
        .eq('id', payment.business_id)
        .single();

      if (businessError) {
        throw businessError;
      }

      if (!business || (business.owner_id !== user.id && user.user_metadata?.role !== 'admin')) {
        throw new Error('You do not have permission to update this payment');
      }

      // Update the payment status
      const updateData: Partial<Payment> = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else if (status === 'refunded') {
        updateData.refunded_at = new Date().toISOString();
      } else if (status === 'failed') {
        updateData.failed_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId);

      if (updateError) {
        throw updateError;
      }

      // If payment is completed, update the booking status
      if (status === 'completed') {
        await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            confirmed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', payment.booking_id);
      } else if (status === 'refunded') {
        await supabase
          .from('bookings')
          .update({
            status: 'cancelled',
            payment_status: 'refunded',
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', payment.booking_id);
      }

      toast.success(`Payment status updated to ${status}`);

      return { error: null };
    } catch (err) {
      console.error('Error updating payment status:', err);
      setError(err instanceof Error ? err : new Error('Failed to update payment status'));
      
      toast.error(err instanceof Error ? err.message : 'Failed to update payment status');
      
      return { 
        error: err instanceof Error ? err : new Error('Failed to update payment status') 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    payments,
    createPayment,
    fetchUserPayments,
    fetchBusinessPayments,
    updatePaymentStatus,
  };
}
