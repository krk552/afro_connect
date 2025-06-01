import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export type Notification = Database['public']['Tables']['notifications']['Row'] & {
  // Add any client-side specific fields if needed, e.g., formatted timestamp
  // For now, we'll use the DB Row type directly and format in component
};

interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: Error | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>; // Manual refresh function
}

const useNotifications = (): UseNotificationsReturn => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    console.log('🎣 Fetching notifications for user:', user.id);
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('❌ Error fetching notifications:', fetchError);
        throw new Error(fetchError.message);
      }
      
      console.log('✅ Notifications fetched:', data);
      setNotifications(data || []);
    } catch (err) {
      console.error(' पकड़ा गया त्रुटि (Caught error) fetching notifications:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
      setNotifications([]); // Clear notifications on error
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();

    // Optional: Set up Supabase real-time subscription for notifications
    // This requires RLS policies on 'notifications' table to allow SELECT for authenticated users
    // and the table to be enabled for real-time updates in Supabase dashboard.
    if (!user) return;

    const channel = supabase
      .channel(`notifications_user_${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          console.log('🔔 Real-time notification change received:', payload);
          // Refetch all notifications to ensure consistency, 
          // or implement more granular update logic (e.g., new, update, delete)
          toast.info('New notification received!');
          fetchNotifications(); 
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('🎧 Subscribed to real-time notifications for user:', user.id);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error('❌ Real-time notification subscription error:', err);
        }
      });

    return () => {
      console.log('🧹 Unsubscribing from real-time notifications');
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user?.id || ''); // Ensure user can only update their own

      if (updateError) throw updateError;

      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      toast.success('Notification marked as read');
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false); // Only update unread ones

      if (updateError) throw updateError;

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user?.id || ''); // Ensure user can only delete their own

      if (deleteError) throw deleteError;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Failed to delete notification');
    }
  };

  return { notifications, loading, error, markAsRead, markAllAsRead, deleteNotification, fetchNotifications };
};

export default useNotifications; 