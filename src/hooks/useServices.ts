import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext'; // May not be needed if businessId is always passed
import { toast } from 'sonner';

export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: Error | null;
  fetchServicesByBusiness: (businessId: string) => Promise<void>;
  addService: (serviceData: ServiceInsert) => Promise<{ data: Service | null; error: Error | null }>;
  updateService: (serviceId: string, serviceData: ServiceUpdate) => Promise<{ data: Service | null; error: Error | null }>;
  deleteService: (serviceId: string) => Promise<{ error: Error | null }>;
}

const useServices = (): UseServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Initially false until a fetch is called
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth(); // For permission checks if needed for add/update/delete

  const fetchServicesByBusiness = useCallback(async (businessId: string) => {
    if (!businessId) {
      setServices([]);
      setLoading(false);
      return;
    }
    console.log('🎣 Fetching services for business:', businessId);
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId)
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      setServices(data || []);
      console.log('✅ Services fetched:', data);
    } catch (err) {
      console.error('❌ Error fetching services:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch services'));
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addService = async (serviceData: ServiceInsert): Promise<{ data: Service | null; error: Error | null }> => {
    if (!user || !serviceData.business_id) {
      // Potentially check if user owns the business_id being passed
      return { data: null, error: new Error('User must be authenticated and business ID provided.') };
    }
    setLoading(true);
    try {
      const { data, error: insertError } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
        .single();
      if (insertError) throw insertError;
      toast.success('Service added successfully!');
      // Re-fetch services for the specific business if business_id is available and matches current context
      // Or let the calling component handle refresh if it makes more sense.
      if (serviceData.business_id) fetchServicesByBusiness(serviceData.business_id);
      return { data, error: null };
    } catch (err) {
      console.error('❌ Error adding service:', err);
      toast.error('Failed to add service.');
      return { data: null, error: err instanceof Error ? err : new Error('Failed to add service') };
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (serviceId: string, serviceData: ServiceUpdate): Promise<{ data: Service | null; error: Error | null }> => {
    if (!user) {
      return { data: null, error: new Error('User must be authenticated.') };
    }
    setLoading(true);
    try {
      const { data, error: updateError } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', serviceId)
        // Add .eq('business_id', owned_business_id) here for security if business_id not in serviceData
        .select()
        .single();
      if (updateError) throw updateError;
      toast.success('Service updated successfully!');
      if (data?.business_id) fetchServicesByBusiness(data.business_id); // data will be the updated service
      return { data, error: null };
    } catch (err) {
      console.error('❌ Error updating service:', err);
      toast.error('Failed to update service.');
      return { data: null, error: err instanceof Error ? err : new Error('Failed to update service') };
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (serviceId: string): Promise<{ error: Error | null }> => {
    if (!user) {
      return { error: new Error('User must be authenticated.') };
    }
    setLoading(true);
    try {
      // Important: fetch the service first to get business_id for re-fetching, and for RLS check if needed
      const { data: serviceToDelete, error: fetchErr } = await supabase.from('services').select('business_id').eq('id', serviceId).single();
      if (fetchErr || !serviceToDelete) throw fetchErr || new Error('Service not found for deletion.');

      const { error: deleteError } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);
        // Add .eq('business_id', owned_business_id) for RLS/security on backend if not covered by policy
      if (deleteError) throw deleteError;
      toast.success('Service deleted successfully!');
      if (serviceToDelete.business_id) fetchServicesByBusiness(serviceToDelete.business_id);
      return { error: null };
    } catch (err) {
      console.error('❌ Error deleting service:', err);
      toast.error('Failed to delete service.');
      return { error: err instanceof Error ? err : new Error('Failed to delete service') };
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, error, fetchServicesByBusiness, addService, updateService, deleteService };
};

export default useServices; 