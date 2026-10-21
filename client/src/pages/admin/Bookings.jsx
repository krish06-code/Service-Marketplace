import React, { useState, useEffect, useCallback } from 'react';
import { CalendarCheck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import { adminAPI } from '../../services/api';
import { adminSidebarItems } from './Dashboard';
import useDebounce from '../../hooks/useDebounce';

const STATUS_OPTIONS = ['','pending','accepted','in_progress','completed','cancelled','rejected'];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const debounced = useDebounce(search, 400);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 15 };
      if (status) params.status = status;
      if (debounced) params.search = debounced;
      const res = await adminAPI.getBookings(params);
      setBookings(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) { setBookings([]); }
    finally { setIsLoading(false); }
  }, [page, status, debounced]);

  useEffect(() => { load(); }, [load]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} title="All Bookings">
      <div className="space-y-5">
        <div className="flex gap-3 flex-wrap">
          <input type="text" placeholder="Search by customer or service..." value={search} onChange={e => setSearch(e.target.value)} className="input-field flex-1 min-w-52" />
          <select value={status} onChange={e => setStatus(e.target.value)} className="input-field w-44">
            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-bg-surface">{s ? s.replace('_', ' ') : 'All Statuses'}</option>)}
          </select>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-surface-2 border-b border-border-color">
                <tr>
                  {['Customer','Provider','Service','Date','Price','Status'].map(h => (
                    <th key={h} className="text-left text-text-muted font-medium p-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {isLoading ? Array.from({length:8}).map((_,i)=>(
                  <tr key={i}><td colSpan={6} className="p-4"><div className="h-5 bg-bg-surface-2 rounded animate-pulse"/></td></tr>
                )) : bookings.length === 0 ? (
                  <tr><td colSpan={6}><EmptyState icon={CalendarCheck} title="No bookings found" /></td></tr>
                ) : bookings.map(b => (
                  <tr key={b._id} className="hover:bg-bg-surface-2/50 transition-colors">
                    <td className="p-4 text-text-primary">{b.customer?.name || '—'}</td>
                    <td className="p-4 text-text-secondary">{b.provider?.user?.name || '—'}</td>
                    <td className="p-4 text-text-secondary truncate max-w-[150px]">{b.service?.title || '—'}</td>
                    <td className="p-4 text-text-muted">{formatDate(b.scheduledDate)}</td>
                    <td className="p-4 text-success font-medium">₹{b.price}</td>
                    <td className="p-4"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination currentPage={page} totalPages={Math.ceil(total / 15)} onPageChange={setPage} />
      </div>
    </DashboardLayout>
  );
};

export default AdminBookings;
