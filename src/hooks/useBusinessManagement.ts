import { useState, useCallback } from 'react';
import { supabase, handleSupabaseError, ENV } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type Business = Database['public']['Tables']['businesses']['Row'];
type BusinessInsert = Database['public']['Tables']['businesses']['Insert'];
type BusinessUpdate = Database['public']['Tables']['businesses']['Update'];
type BusinessHour = Database['public']['Tables']['business_hours']['Row'];
type BusinessHourInsert = Database['public']['Tables']['business_hours']['Insert'];
type Service = Database['public']['Tables']['services']['Row'];
type ServiceInsert = Database['public']['Tables']['services']['Insert'];
type ServiceUpdate = Database['public']['Tables']['services']['Update'];

export interface BusinessFormData {
  name: string;
  description: string;
  category_id: string;
  email: string;
  phone: string;
  website?: string;
  street_address: string;
  city: string;
  region: string;
  postal_code?: string;
  country: string;
  logo_url?: string;
  cover_image_url?: string;
  price_range: Database['public']['Enums']['price_range_enum'];
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
  };
  business_hours: {
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_closed: boolean;
  }[];
  services: {
    id?: string;
    name: string;
    description: string;
    price: number;
    duration_minutes: number;
    currency: string;
    is_active: boolean;
  }[];
}

// Define a custom error type that includes Supabase error properties
interface SupabaseError extends Error {
  context?: string;
  code?: string;
  details?: unknown;
  hint?: unknown;
}

export function useBusinessManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SupabaseError | null>(null);

  /**
   * Create a new business listing
   */
  const createBusiness = async (formData: BusinessFormData) => {
    if (!user) {
      return { data: null, error: new Error('You must be logged in to create a business') };
    }

    setLoading(true);
    setError(null);

    try {
      // Generate a slug from the business name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');

      // Create the business record
      const businessData: BusinessInsert = {
        name: formData.name,
        description: formData.description,
        slug,
        category_id: formData.category_id,
        owner_id: user.id,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || null,
        street_address: formData.street_address,
        city: formData.city,
        region: formData.region,
        postal_code: formData.postal_code || null,
        country: formData.country,
        logo_url: formData.logo_url || null,
        cover_image_url: formData.cover_image_url || null,
        price_range: formData.price_range,
        whatsapp: formData.social_media?.whatsapp || null,
        settings: formData.social_media ? {
          social_media: {
            facebook: formData.social_media.facebook || null,
            instagram: formData.social_media.instagram || null,
            twitter: formData.social_media.twitter || null,
            linkedin: formData.social_media.linkedin || null
          }
        } : null,
        status: 'pending', // New businesses start as pending and require approval
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Insert the business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert([businessData])
        .select()
        .single();

      if (businessError) {
        throw businessError;
      }

      if (!business) {
        throw new Error('Failed to create business');
      }

      // Add business hours
      const businessHoursPromises = formData.business_hours.map(async (hour) => {
        const businessHourData: BusinessHourInsert = {
          business_id: business.id,
          day_of_week: hour.day_of_week,
          open_time: hour.open_time,
          close_time: hour.close_time,
          is_closed: hour.is_closed,
        };

        return supabase.from('business_hours').insert([businessHourData]);
      });

      await Promise.all(businessHoursPromises);

      // Add services
      const servicesPromises = formData.services.map(async (service) => {
        const serviceData: ServiceInsert = {
          business_id: business.id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration_minutes: service.duration_minutes,
          currency: service.currency,
          is_active: service.is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        return supabase.from('services').insert([serviceData]);
      });

      await Promise.all(servicesPromises);

      // Create notification for admin to approve the business
      if (ENV.ADMIN_USER_ID) {
        await supabase.from('notifications').insert({
          user_id: ENV.ADMIN_USER_ID, // Using the admin user ID from environment variables
          title: 'New Business Listing',
          message: `A new business "${business.name}" has been submitted for approval`,
          type: 'system_announcement', // Using a valid notification type from the enum
          data: { business_id: business.id, action_type: 'business_approval' },
          is_read: false,
          created_at: new Date().toISOString(),
        });
      } else {
        console.warn('Admin user ID not configured. Skipping admin notification.');
      }

      toast({
        title: 'Business created successfully',
        description: 'Your business listing has been submitted for approval',
      });

      return { data: business, error: null };
    } catch (err) {
      // Use the standardized error handling function
      const { error: formattedError } = handleSupabaseError(err instanceof Error ? err : new Error('Failed to create business'), 'business.create');
      
      // Create a properly typed SupabaseError object
      let errorObj: SupabaseError | null = null;
      
      if (formattedError) {
        errorObj = new Error(formattedError.message) as SupabaseError;
        errorObj.context = formattedError.context;
        errorObj.code = formattedError.code;
        errorObj.details = formattedError.details;
        errorObj.hint = formattedError.hint;
      }
      
      setError(errorObj);
      
      // Provide more specific error messages based on the error type
      let errorDescription = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        if (err.message.includes('duplicate key')) {
          errorDescription = 'A business with this name already exists. Please choose a different name.';
        } else if (err.message.includes('violates foreign key constraint')) {
          errorDescription = 'Invalid category selected. Please choose a valid category.';
        } else {
          errorDescription = err.message;
        }
      }
      
      toast({
        title: 'Failed to create business',
        description: errorDescription,
        variant: 'destructive',
      });
      
      return { 
        data: null, 
        error: formattedError 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing business listing
   * @param businessId The ID of the business to update
   * @param formData Partial business data to update
   * @returns Object containing updated business data or error
   */
  const updateBusiness = useCallback(async (businessId: string, formData: Partial<BusinessFormData>) => {
    if (!user) {
      return { data: null, error: new Error('You must be logged in to update a business') };
    }
    
    if (!businessId) {
      return { data: null, error: new Error('Business ID is required') };
    }

    setLoading(true);
    setError(null);

    try {
      // First, verify that the user owns this business
      const { data: existingBusiness, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .eq('owner_id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!existingBusiness) {
        throw new Error('Business not found or you do not have permission to update it');
      }
      
      // Validate required fields if they are being updated
      if (formData.name && formData.name.trim() === '') {
        throw new Error('Business name cannot be empty');
      }
      
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please provide a valid email address');
      }

      // Update the business record
      const businessData: BusinessUpdate = {
        updated_at: new Date().toISOString(),
      };

      // Only include fields that are provided in the formData
      if (formData.name) businessData.name = formData.name;
      if (formData.description) businessData.description = formData.description;
      if (formData.category_id) businessData.category_id = formData.category_id;
      if (formData.email) businessData.email = formData.email;
      if (formData.phone) businessData.phone = formData.phone;
      if (formData.website !== undefined) businessData.website = formData.website || null;
      if (formData.street_address) businessData.street_address = formData.street_address;
      if (formData.city) businessData.city = formData.city;
      if (formData.region) businessData.region = formData.region;
      if (formData.postal_code !== undefined) businessData.postal_code = formData.postal_code || null;
      if (formData.country) businessData.country = formData.country;
      if (formData.logo_url !== undefined) businessData.logo_url = formData.logo_url || null;
      if (formData.cover_image_url !== undefined) businessData.cover_image_url = formData.cover_image_url || null;
      if (formData.price_range) businessData.price_range = formData.price_range;
      // Update social media fields
      if (formData.social_media) {
        // Update WhatsApp directly as it's a field in the table
        if (formData.social_media.whatsapp !== undefined) {
          businessData.whatsapp = formData.social_media.whatsapp;
        }
        
        // Update other social media in the settings JSON field
        const { data: currentBusiness } = await supabase
          .from('businesses')
          .select('settings')
          .eq('id', businessId)
          .single();
          
        // Define a type for the business settings
        interface BusinessSettings {
          social_media?: {
            facebook?: string;
            instagram?: string;
            twitter?: string;
            linkedin?: string;
            whatsapp?: string;
          };
          [key: string]: unknown;
        }
        
        const currentSettings = (currentBusiness?.settings as BusinessSettings) || {};
        const currentSocialMedia = currentSettings.social_media || {};
        
        businessData.settings = {
          ...currentSettings,
          social_media: {
            ...currentSocialMedia,
            ...(formData.social_media.facebook !== undefined && { facebook: formData.social_media.facebook }),
            ...(formData.social_media.instagram !== undefined && { instagram: formData.social_media.instagram }),
            ...(formData.social_media.twitter !== undefined && { twitter: formData.social_media.twitter }),
            ...(formData.social_media.linkedin !== undefined && { linkedin: formData.social_media.linkedin })
          }
        };
      }

      // Update the business
      const { data: business, error: updateError } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', businessId)
        .select(`
          *,
          categories (id, name, slug, icon, color)
        `)
        .single();

      if (updateError) {
        throw updateError;
      }
      
      if (!business) {
        throw new Error('Failed to update business');
      }

      // Update business hours if provided
      if (formData.business_hours && formData.business_hours.length > 0) {
        // First delete existing hours
        await supabase
          .from('business_hours')
          .delete()
          .eq('business_id', businessId);

        // Then insert new hours
        const businessHoursPromises = formData.business_hours.map(async (hour) => {
          const businessHourData: BusinessHourInsert = {
            business_id: businessId,
            day_of_week: hour.day_of_week,
            open_time: hour.open_time,
            close_time: hour.close_time,
            is_closed: hour.is_closed,
          };

          return supabase.from('business_hours').insert([businessHourData]);
        });

        await Promise.all(businessHoursPromises);
      }

      // Update services if provided
      if (formData.services && formData.services.length > 0) {
        // Handle each service - update existing ones and create new ones
        const servicesPromises = formData.services.map(async (service) => {
          if (service.id) {
            // Update existing service
            const serviceData: ServiceUpdate = {
              name: service.name,
              description: service.description,
              price: service.price,
              duration_minutes: service.duration_minutes,
              currency: service.currency,
              is_active: service.is_active,
              updated_at: new Date().toISOString(),
            };

            return supabase
              .from('services')
              .update(serviceData)
              .eq('id', service.id)
              .eq('business_id', businessId);
          } else {
            // Create new service
            const serviceData: ServiceInsert = {
              business_id: businessId,
              name: service.name,
              description: service.description,
              price: service.price,
              duration_minutes: service.duration_minutes,
              currency: service.currency,
              is_active: service.is_active,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            return supabase.from('services').insert([serviceData]);
          }
        });

        await Promise.all(servicesPromises);
      }

      toast({
        title: 'Business updated successfully',
        description: 'Your business listing has been updated',
      });

      return { data: business, error: null };
    } catch (err) {
      // Use the standardized error handling function
      const { error: formattedError } = handleSupabaseError(err instanceof Error ? err : new Error('Failed to update business'), 'business.update');
      
      // Create a properly typed SupabaseError object
      let errorObj: SupabaseError | null = null;
      
      if (formattedError) {
        errorObj = new Error(formattedError.message) as SupabaseError;
        errorObj.context = formattedError.context;
        errorObj.code = formattedError.code;
        errorObj.details = formattedError.details;
        errorObj.hint = formattedError.hint;
      }
      
      setError(errorObj);
      
      // Provide more specific error messages based on the error type
      let errorDescription = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        if (err.message.includes('duplicate key')) {
          errorDescription = 'A business with this name already exists. Please choose a different name.';
        } else if (err.message.includes('violates foreign key constraint')) {
          errorDescription = 'Invalid category selected. Please choose a valid category.';
        } else if (err.message.includes('permission')) {
          errorDescription = 'You do not have permission to update this business.';
        } else {
          errorDescription = err.message;
        }
      }
      
      toast({
        title: 'Failed to update business',
        description: errorDescription,
        variant: 'destructive',
      });
      
      return { 
        data: null, 
        error: formattedError 
      };
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Delete a business listing and all related data
   * @param businessId The ID of the business to delete
   * @returns Object containing success status or error
   */
  const deleteBusiness = useCallback(async (businessId: string) => {
    if (!user) {
      return { success: false, error: new Error('You must be logged in to delete a business') };
    }
    
    if (!businessId) {
      return { success: false, error: new Error('Business ID is required') };
    }

    setLoading(true);
    setError(null);

    try {
      // First, verify that the user owns this business
      const { data: existingBusiness, error: fetchError } = await supabase
        .from('businesses')
        .select('name, id, owner_id')
        .eq('id', businessId)
        .eq('owner_id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!existingBusiness) {
        throw new Error('Business not found or you do not have permission to delete it');
      }
      
      // Get the business name for the confirmation message
      const businessName = existingBusiness.name;

      // Delete related records in a transaction-like manner
      // Note: Supabase doesn't support true transactions, but we'll handle errors appropriately
      
      // 1. First get service IDs for this business
      const { data: serviceIds, error: serviceIdError } = await supabase
        .from('services')
        .select('id')
        .eq('business_id', businessId);
        
      if (serviceIdError) {
        console.warn('Error fetching service IDs:', serviceIdError);
        // Continue with deletion, as this is not critical
      }
      
      // 2. Delete bookings related to these services if any were found
      if (serviceIds && serviceIds.length > 0) {
        const serviceIdArray = serviceIds.map(service => service.id);
        const { error: bookingsError } = await supabase
          .from('bookings')
          .delete()
          .in('service_id', serviceIdArray);
          
        if (bookingsError) {
          console.warn('Error deleting related bookings:', bookingsError);
          // Continue with deletion, as this is not critical
        }
      }
      
      // Note: We already handle bookingsError inside the if block above
      
      // 2. Delete services
      const { error: servicesError } = await supabase
        .from('services')
        .delete()
        .eq('business_id', businessId);
      
      if (servicesError) {
        throw servicesError;
      }
      
      // 3. Delete business hours
      const { error: hoursError } = await supabase
        .from('business_hours')
        .delete()
        .eq('business_id', businessId);
      
      if (hoursError) {
        throw hoursError;
      }
      
      // 4. Delete the business itself
      const { error: deleteError } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessId);

      if (deleteError) {
        throw deleteError;
      }

      toast({
        title: 'Business deleted successfully',
        description: `"${businessName}" has been permanently removed`,
      });

      return { success: true, error: null };
    } catch (err) {
      // Use the standardized error handling function
      const { error: formattedError } = handleSupabaseError(err instanceof Error ? err : new Error('Failed to delete business'), 'business.delete');
      
      // Create a properly typed SupabaseError object
      let errorObj: SupabaseError | null = null;
      
      if (formattedError) {
        errorObj = new Error(formattedError.message) as SupabaseError;
        errorObj.context = formattedError.context;
        errorObj.code = formattedError.code;
        errorObj.details = formattedError.details;
        errorObj.hint = formattedError.hint;
      }
      
      setError(errorObj);
      
      // Provide more specific error messages based on the error type
      let errorDescription = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        if (err.message.includes('foreign key constraint')) {
          errorDescription = 'This business has related data that cannot be deleted. Please contact support.';
        } else if (err.message.includes('permission')) {
          errorDescription = 'You do not have permission to delete this business.';
        } else {
          errorDescription = err.message;
        }
      }
      
      toast({
        title: 'Failed to delete business',
        description: errorDescription,
        variant: 'destructive',
      });
      
      return { 
        success: false,
        error: formattedError 
      };
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Upload a business image (logo or cover image)
   * @param file The file to upload
   * @param type The type of image (logo or cover)
   * @returns Object containing the public URL or error
   */
  const uploadBusinessImage = useCallback(async (file: File, type: 'logo' | 'cover') => {
    if (!user) {
      return { data: null, error: new Error('You must be logged in to upload images') };
    }
    
    // Validate file
    if (!file) {
      return { data: null, error: new Error('No file provided') };
    }
    
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      return { 
        data: null, 
        error: new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.') 
      };
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { 
        data: null, 
        error: new Error('File too large. Maximum size is 5MB.') 
      };
    }

    setLoading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `businesses/${user.id}/${fileName}`;

      // Upload the file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('business-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('business-images')
        .getPublicUrl(filePath);
      
      toast({
        title: 'Image uploaded successfully',
        description: `Your ${type} image has been uploaded`,
      });

      return { data: publicUrlData.publicUrl, error: null };
    } catch (err) {
      // Use the standardized error handling function
      const { error: formattedError } = handleSupabaseError(err instanceof Error ? err : new Error('Failed to upload image'), 'business.uploadImage');
      
      // Create a properly typed SupabaseError object
      let errorObj: SupabaseError | null = null;
      
      if (formattedError) {
        errorObj = new Error(formattedError.message) as SupabaseError;
        errorObj.context = formattedError.context;
        errorObj.code = formattedError.code;
        errorObj.details = formattedError.details;
        errorObj.hint = formattedError.hint;
      }
      
      setError(errorObj);
      
      // Provide more specific error messages based on the error type
      let errorDescription = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        if (err.message.includes('storage quota')) {
          errorDescription = 'Storage quota exceeded. Please contact support.';
        } else if (err.message.includes('permission')) {
          errorDescription = 'You do not have permission to upload files.';
        } else if (err.message.includes('already exists')) {
          errorDescription = 'A file with this name already exists. Please try again.';
        } else {
          errorDescription = err.message;
        }
      }
      
      toast({
        title: 'Failed to upload image',
        description: errorDescription,
        variant: 'destructive',
      });
      
      return { 
        data: null, 
        error: formattedError 
      };
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Get user's businesses with related data
   */
  const getUserBusinesses = useCallback(async () => {
    if (!user) {
      return { data: [], error: new Error('You must be logged in to view your businesses') };
    }

    setLoading(true);
    setError(null);

    try {
      // Enhanced query to fetch more related data for a complete business profile
      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select(`
          *,
          categories (id, name, slug, icon, color),
          business_hours (id, day_of_week, open_time, close_time, is_closed),
          services (id, name, description, price, duration_minutes, currency, is_active)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Add business status labels for UI display
      const enhancedData = (data || []).map(business => ({
        ...business,
        statusLabel: getBusinessStatusLabel(business.status),
      }));

      return { data: enhancedData, error: null };
    } catch (err) {
      const { error: formattedError } = handleSupabaseError(err instanceof Error ? err : new Error('Failed to fetch businesses'), 'business.getUserBusinesses');
      
      // Create a properly typed SupabaseError object
      let errorObj: SupabaseError | null = null;
      
      if (formattedError) {
        errorObj = new Error(formattedError.message) as SupabaseError;
        errorObj.context = formattedError.context;
        errorObj.code = formattedError.code;
        errorObj.details = formattedError.details;
        errorObj.hint = formattedError.hint;
      }
      
      setError(errorObj);
      
      toast({
        title: 'Failed to fetch businesses',
        description: formattedError?.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      
      return { 
        data: [], 
        error: formattedError 
      };
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  /**
   * Helper function to get a user-friendly status label
   */
  const getBusinessStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'Pending Approval',
      'active': 'Active',
      'inactive': 'Inactive',
      'rejected': 'Rejected',
      'suspended': 'Suspended'
    };
    
    return statusMap[status] || 'Unknown';
  };

  return {
    loading,
    error,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    uploadBusinessImage,
    getUserBusinesses,
  };
}
