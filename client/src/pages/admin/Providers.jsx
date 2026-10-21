import React, { useState, useEffect, useCallback } from 'react';
import { UserCheck, Search } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import RatingStars from '../../components/ui/RatingStars';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import { adminAPI } from '../../services/api';
import { adminSidebarItems } from './Dashboard';
import useDebounce from '../../hooks/useDebounce';

const AdminProviders = () => {
  const [providers, setProviders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const debounced = useDebounce(search, 400);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 15 };
      if (debounced) params.search = debounced;
      if (statusFilter) params.verificationStatus = statusFilter;
      const res = await adminAPI.getProviders(params);
      setProviders(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, debounced, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const statusColor = (s) => ({ approved: 'success', pending: 'warning', rejected: 'danger' }[s] || 'default');

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} title="All Providers">
      <div className="space-y-5">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input type="text" placeholder="Search providers..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-44">
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-surface-2 border-b border-border-color">
                <tr>
                  {['Provider', 'Categories', 'Rating', 'Jobs Done', 'Verification'].map(h => (
                    <th key={h} className="text-left text-text-muted font-medium p-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="p-4"><div className="h-5 bg-bg-surface-2 rounded animate-pulse" /></td></tr>
                  ))
                ) : providers.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState icon={UserCheck} title="No providers found" /></td></tr>
                ) : providers.map(p => {
                  const u = p.user || {};
                  return (
                    <tr key={p._id} className="hover:bg-bg-surface-2/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar fallback={u.name} size="sm" />
                          <div>
                            <p className="font-medium text-text-primary">{u.name}</p>
                            <p className="text-text-muted text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(p.categories || []).slice(0, 2).map(c => (
                            <Badge key={c._id || c} variant="info">{c.name || c}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <RatingStars rating={p.averageRating || 0} size="sm" />
                          <span className="text-text-primary text-xs">{(p.averageRating || 0).toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary">{p.completedJobs || 0}</td>
                      <td className="p-4">
                        <Badge variant={statusColor(p.verificationStatus)}>{p.verificationStatus}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination currentPage={page} totalPages={Math.ceil(total / 15)} onPageChange={setPage} />
      </div>
    </DashboardLayout>
  );
};

export default AdminProviders;
