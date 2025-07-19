import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  if (!isAdmin()) return <div>Access Denied</div>;

  const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');

  useEffect(() => {
    const fetchPending = async () => {
      const { data } = await supabase.from('businesses').select('*').eq('status', 'pending');
      setPendingBusinesses(data || []);
      setLoading(false);
    };
    fetchPending();
  }, []);

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Pending Businesses</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingBusinesses.map(b => (
            <TableRow key={b.id}>
              <TableCell>{b.name}</TableCell>
              <TableCell>{new Date(b.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button onClick={async () => {
                  await supabase.from('businesses').update({ status: 'active' }).eq('id', b.id);
                  fetchPending();
                }}><Check /> Approve</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="ml-2"><X /> Decline</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Input placeholder="Rejection Reason" onChange={(e) => setReason(e.target.value)} />
                    <Button onClick={async () => {
                      await supabase.from('businesses').update({ status: 'rejected', rejection_reason: reason }).eq('id', b.id);
                      fetchPending();
                    }}>Confirm Decline</Button>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDashboard;