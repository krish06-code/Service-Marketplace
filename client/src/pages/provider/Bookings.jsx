import React, { useState, useEffect, useCallback } from 'react';
import { CalendarCheck, PlayCircle, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BookingCard from '../../components/ui/BookingCard';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { bookingAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { providerSidebarItems } from './Dashboard';

const TABS = ['All', 'Accepted', 'In Progress', 'Completed', 'Rejected'];
const statusMap = { 'Accepted': 'accepted', 'In Progress': 'in_progress', 'Completed': 'completed', 'Rejected': 'rejected' };

const ProviderBookings = () => {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 8 };
      if (tab !== 'All') params.status = statusMap[tab];
      const res = await bookingAPI.getProviderBookings(params);
      setBookings(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) { setBookings([]); }
    finally { setIsLoading(false); }
  }, [tab, page]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, { status });
      showToast('success', 'Status updated!');
      load();
    } catch (e) { showToast('error', e.response?.data?.message || 'Failed'); }
  };

  return (
    <DashboardLayout sidebarItems={providerSidebarItems} title="All Bookings">
      <div className="space-y-6">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setPage(1); }}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary hover:bg-bg-surface-2'}`}>
              {t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-5 h-40 animate-pulse" />)}</div>
        ) : bookings.length === 0 ? (
          <EmptyState icon={CalendarCheck} title="No bookings found" />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              {bookings.map(b => (
                <div key={b._id} className="space-y-2">
                  <BookingCard booking={b} showActions={false} />
                  <div className="flex gap-2">
                    {b.status === 'accepted' && (
                      <Button variant="primary" size="sm" className="flex-1" onClick={() => handleStatus(b._id, 'in_progress')}>
                        <PlayCircle className="h-3.5 w-3.5 mr-1" /> Start Job
                      </Button>
                    )}
                    {b.status === 'in_progress' && (
                      <Button variant="primary" size="sm" className="flex-1" onClick={() => handleStatus(b._id, 'completed')}>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={Math.ceil(total / 8)} onPageChange={setPage} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProviderBookings;
