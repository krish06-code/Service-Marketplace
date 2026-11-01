import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, ClipboardCheck, Tag, CalendarCheck, Star, TrendingUp, ShieldAlert, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminAPI } from '../../services/api';

export const adminSidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: UserCheck, label: 'Providers', href: '/admin/providers' },
  { icon: ClipboardCheck, label: 'Approvals', href: '/admin/approvals' },
  { icon: Tag, label: 'Categories', href: '/admin/categories' },
  { icon: CalendarCheck, label: 'Bookings', href: '/admin/bookings' },
  { icon: Star, label: 'Reviews', href: '/admin/reviews' },
];

const colorMap = {
  accent: { bg: 'bg-accent/10 border-accent/20', text: 'text-accent' },
  success: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600' },
  warning: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600' },
  danger: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-600' },
  'purple-400': { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-600' },
};

const StatCard = ({ icon: Icon, label, value, color = 'accent' }) => {
  const style = colorMap[color] || colorMap.accent;
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl ${style.bg} border flex items-center justify-center shrink-0`}>
        <Icon className={`h-6 w-6 ${style.text}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary">{value ?? '—'}</p>
        <p className="text-text-muted text-sm">{label}</p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(res => setStats(res.data.data)).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} title="Admin Dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Overview</h1>
          <p className="text-text-muted mt-1">Platform-wide statistics and management.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({length:8}).map((_,i)=><div key={i} className="card h-24 animate-pulse"/>)}</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} color="accent" />
            <StatCard icon={UserCheck} label="Providers" value={stats?.totalProviders} color="success" />
            <StatCard icon={CalendarCheck} label="Bookings" value={stats?.totalBookings} color="warning" />
            <StatCard icon={Star} label="Reviews" value={stats?.totalReviews} color="purple-400" />
            <StatCard icon={ShieldAlert} label="Pending Approvals" value={stats?.pendingApprovals} color="warning" />
            <StatCard icon={AlertTriangle} label="Reported Issues" value={stats?.reportedReviews || 0} color="danger" />
            <StatCard icon={TrendingUp} label="Completed Bookings" value={stats?.completedBookings} color="success" />
            <StatCard icon={Tag} label="Categories" value={stats?.totalCategories} color="accent" />
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <button onClick={() => navigate('/admin/approvals')} className="card p-5 text-left hover:border-accent/40 transition-all group">
            <ClipboardCheck className="h-8 w-8 text-warning mb-3" />
            <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">Pending Approvals</h3>
            <p className="text-text-muted text-sm mt-1">Review and approve new provider applications.</p>
          </button>
          <button onClick={() => navigate('/admin/users')} className="card p-5 text-left hover:border-accent/40 transition-all group">
            <Users className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">User Management</h3>
            <p className="text-text-muted text-sm mt-1">View, activate, or deactivate user accounts.</p>
          </button>
          <button onClick={() => navigate('/admin/categories')} className="card p-5 text-left hover:border-accent/40 transition-all group">
            <Tag className="h-8 w-8 text-success mb-3" />
            <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">Categories</h3>
            <p className="text-text-muted text-sm mt-1">Add and manage service categories.</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
