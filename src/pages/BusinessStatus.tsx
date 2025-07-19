import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, Clock, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BusinessStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) return;
      const { data } = await supabase.from('businesses').select('status').eq('owner_id', user.id).single();
      setStatus(data?.status || 'no_business');
      setLoading(false);
    };
    fetchStatus();
  }, [user]);

  if (loading) return <Loader2 className="animate-spin" />;

  let content;
  if (status === 'pending') {
    content = <>
      <Clock className="h-12 w-12 mx-auto text-yellow-500" />
      <h2>Under Review</h2>
      <p>We'll email you soon.</p>
    </>;
  } else if (status === 'active') {
    content = <>
      <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
      <h2>Approved!</h2>
      <p>Your business is live.</p>
      <Button asChild><Link to="/business/dashboard">Go to Dashboard</Link></Button>
    </>;
  } else if (status === 'rejected') {
    content = <>
      <X className="h-12 w-12 mx-auto text-red-500" />
      <h2>Needs Revisions</h2>
      <p>Check email for details and re-submit.</p>
      <Button asChild><Link to="/business/register">Re-submit</Link></Button>
    </>;
  } else {
    content = <>
      <h2>No Business Found</h2>
      <Button asChild><Link to="/business/register">Register Now</Link></Button>
    </>;
  }

  return (
    <div className="p-8">
      <Card className="max-w-md mx-auto">
        <div className="p-6 text-center">
          {content}
        </div>
      </Card>
    </div>
  );
};

export default BusinessStatus;