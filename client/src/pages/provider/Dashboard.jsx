import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bell, CalendarCheck, Calendar, Briefcase, Clock, MessageSquare, IndianRupee, Star, User, Settings, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BookingCard from '../../components/ui/BookingCard';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonList } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import { bookingAPI, providerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const providerSidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/provider/dashboard' },
  { icon: Bell, label: 'Requests', href: '/provider/requests' },
  { icon: CalendarCheck, label: 'Bookings', href: '/provider/bookings' },
  { icon: Calendar, label: 'Calendar', href: '/provider/calendar' },
  { icon: Briefcase, label: 'My Services', href: '/provider/services' },
  { icon: Clock, label: 'Availability', href: '/provider/availability' },
  { icon: MessageSquare, label: 'Messages', href: '/messages' },
  { icon: IndianRupee, label: 'Earnings', href: '/provider/earnings' },
  { icon: Star, label: 'Reviews', href: '/provider/reviews' },
  { icon: User, label: 'Profile', href: '/provider/profile' },
  { icon: Settings, label: 'Settings', href: '/provider/settings' },
];

const StatCard = ({ icon: Icon, label, value, color = 'text-accent', bg = 'bg-accent/10 border-accent/20' }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`h-12 w-12 rounded-xl ${bg} border flex items-center justify-center shrink-0`}><Icon className={`h-6 w-6 ${color}`} /></div>
    <div><p className="text-2xl font-bold text-text-primary">{value}</p><p className="text-text-muted text-sm">{label}</p></div>
  </div>
);

const ProviderDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const load = async () => {
    setIsLoading(true);
    try {
      const [statsRes, pendRes, upcomingRes] = await Promise.all([
        providerAPI.getMyStats(),
        bookingAPI.getProviderBookings({ status: 'pending', limit: 3 }),
        bookingAPI.getProviderBookings({ status: 'accepted', limit: 3 }),
      ]);
      setStats(statsRes.data.data);
      setPending(pendRes.data.data || []);
      setUpcoming(upcomingRes.data.data || []);
    } catch (e) { /* ignore */ }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, { status });
      showToast('success', `Booking ${status}!`);
      load();
    } catch (e) { showToast('error', e.response?.data?.message || 'Action failed'); }
  };

  return (
    <DashboardLayout sidebarItems={providerSidebarItems} title="Provider Dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{greeting}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-text-muted mt-1">Manage your bookings and grow your business.</p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={CalendarCheck} label="Total Bookings" value={stats.totalBookings || 0} />
            <StatCard icon={CheckCircle} label="Completed Jobs" value={stats.completedJobs || 0} color="text-success" bg="bg-success/10 border-success/20" />
            <StatCard icon={IndianRupee} label="Total Earnings" value={`₹${(stats.totalEarnings || 0).toLocaleString('en-IN')}`} color="text-warning" bg="bg-warning/10 border-warning/20" />
            <StatCard icon={Star} label="Avg. Rating" value={(stats.averageRating || 0).toFixed(1)} color="text-purple-400" bg="bg-purple-500/10 border-purple-500/20" />
          </div>
        )}

        {/* Pending requests */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text-primary">Pending Requests <span className="text-warning ml-1">({pending.length})</span></h2>
            <button onClick={() => navigate('/provider/requests')} className="text-sm text-accent hover:underline">View All</button>
          </div>
          {isLoading ? <SkeletonList count={2} /> : pending.length === 0 ? (
            <p className="text-text-muted text-sm">No pending requests.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {pending.map(b => (
                <div key={b._id} className="card p-4 space-y-3">
                  <BookingCard booking={b} showActions={false} />
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1" onClick={() => handleStatus(b._id, 'accepted')}><CheckCircle className="h-3.5 w-3.5 mr-1" />Accept</Button>
                    <Button variant="danger" size="sm" className="flex-1" onClick={() => handleStatus(b._id, 'rejected')}><XCircle className="h-3.5 w-3.5 mr-1" />Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text-primary">Upcoming Appointments</h2>
            <button onClick={() => navigate('/provider/bookings')} className="text-sm text-accent hover:underline">View All</button>
          </div>
          {isLoading ? <SkeletonList count={2} /> : upcoming.length === 0 ? (
            <EmptyState icon={Calendar} title="No upcoming appointments" description="Accept booking requests to see them here." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {upcoming.map(b => <BookingCard key={b._id} booking={b} showActions={false} />)}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
