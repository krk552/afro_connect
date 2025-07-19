// Edge Function for business status notifications
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const payload = await req.json();
    const { data: { new: business } } = payload;

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!);

    if (business.status === 'active') {
      await supabase.from('notifications').insert({
        user_id: business.owner_id,
        title: 'Business Approved',
        message: 'Your business has been approved and is now live!',
        type: 'system_announcement',
        data: { business_id: business.id },
        is_read: false,
        created_at: new Date().toISOString(),
      });
    } else if (business.status === 'rejected') {
      await supabase.from('notifications').insert({
        user_id: business.owner_id,
        title: 'Business Review Update',
        message: 'Your business submission needs revisions. Check details.',
        type: 'system_announcement',
        data: { business_id: business.id, reason: business.rejection_reason || 'No reason provided' },
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
});