import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Bell } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BookingCard from '../../components/ui/BookingCard';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { bookingAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { providerSidebarItems } from './Dashboard';

const ProviderRequests = () => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try { const res = await bookingAPI.getProviderBookings({ status: 'pending', limit: 20 }); setBookings(res.data.data || []); }
    catch (e) { /* ignore */ }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, { status });
      showToast('success', `Booking ${status}!`);
      load();
    } catch (e) { showToast('error', e.response?.data?.message || 'Action failed'); }
  };

  return (
    <DashboardLayout sidebarItems={providerSidebarItems} title="Booking Requests">
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-5 h-40 animate-pulse" />)}</div>
      ) : bookings.length === 0 ? (
        <EmptyState icon={Bell} title="No pending requests" description="New booking requests will appear here." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {bookings.map(b => (
            <div key={b._id} className="space-y-2">
              <BookingCard booking={b} showActions={false} />
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="flex-1" onClick={() => handleStatus(b._id, 'accepted')}><CheckCircle className="h-3.5 w-3.5 mr-1" />Accept</Button>
                <Button variant="danger" size="sm" className="flex-1" onClick={() => handleStatus(b._id, 'rejected')}><XCircle className="h-3.5 w-3.5 mr-1" />Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProviderRequests;
