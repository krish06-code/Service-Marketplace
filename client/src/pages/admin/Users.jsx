import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, Ban, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { adminSidebarItems } from './Dashboard';
import useDebounce from '../../hooks/useDebounce';

const AdminUsers = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [confirmUser, setConfirmUser] = useState(null);
  const [actioning, setActioning] = useState(false);
  const debounced = useDebounce(search, 400);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 15 };
      if (debounced) params.search = debounced;
      if (roleFilter) params.role = roleFilter;
      const res = await adminAPI.getUsers(params);
      setUsers(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) { setUsers([]); }
    finally { setIsLoading(false); }
  }, [page, debounced, roleFilter]);

  useEffect(() => { load(); }, [load]);

  const toggleStatus = async () => {
    setActioning(true);
    try {
      await adminAPI.toggleUserStatus(confirmUser._id);
      showToast('success', `User ${confirmUser.isActive ? 'deactivated' : 'activated'}!`);
      setConfirmUser(null);
      load();
    } catch (e) { showToast('error', 'Action failed'); }
    finally { setActioning(false); }
  };

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} title="User Management">
      <div className="space-y-5">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field w-40">
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="provider">Provider</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-surface-2 border-b border-border-color">
                <tr>
                  <th className="text-left text-text-muted font-medium p-4">User</th>
                  <th className="text-left text-text-muted font-medium p-4">Role</th>
                  <th className="text-left text-text-muted font-medium p-4">Joined</th>
                  <th className="text-left text-text-muted font-medium p-4">Status</th>
                  <th className="text-right text-text-muted font-medium p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {isLoading ? (
                  Array.from({length:8}).map((_,i)=>(
                    <tr key={i}><td colSpan={5} className="p-4"><div className="h-6 bg-bg-surface-2 rounded animate-pulse"/></td></tr>
                  ))
                ) : users.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState icon={Users} title="No users found" /></td></tr>
                ) : users.map(u => (
                  <tr key={u._id} className="hover:bg-bg-surface-2/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar fallback={u.name} size="sm" />
                        <div>
                          <p className="font-medium text-text-primary">{u.name}</p>
                          <p className="text-text-muted text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant={u.role === 'admin' ? 'warning' : u.role === 'provider' ? 'info' : 'default'}>{u.role}</Badge></td>
                    <td className="p-4 text-text-muted">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="p-4"><Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="p-4 text-right">
                      <Button variant={u.isActive ? 'danger' : 'primary'} size="sm" onClick={() => setConfirmUser(u)}>
                        {u.isActive ? <><Ban className="h-3.5 w-3.5 mr-1" />Deactivate</> : <><CheckCircle className="h-3.5 w-3.5 mr-1" />Activate</>}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination currentPage={page} totalPages={Math.ceil(total / 15)} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        isOpen={!!confirmUser}
        onConfirm={toggleStatus}
        onCancel={() => setConfirmUser(null)}
        title={confirmUser?.isActive ? 'Deactivate User?' : 'Activate User?'}
        message={`This will ${confirmUser?.isActive ? 'prevent' : 'allow'} ${confirmUser?.name} from using the platform.`}
        confirmText={confirmUser?.isActive ? 'Deactivate' : 'Activate'}
        isDangerous={confirmUser?.isActive}
        isLoading={actioning}
      />
    </DashboardLayout>
  );
};

export default AdminUsers;
