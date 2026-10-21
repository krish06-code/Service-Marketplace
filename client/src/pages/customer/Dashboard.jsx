import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, CalendarCheck, MessageSquare, Heart, Star, User, Settings, TrendingUp, Clock, CheckCircle, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BookingCard from '../../components/ui/BookingCard';
import ProviderCard from '../../components/ui/ProviderCard';
import { SkeletonList } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { bookingAPI, providerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Search, label: 'Find Services', href: '/services' },
  { icon: CalendarCheck, label: 'My Bookings', href: '/dashboard/bookings' },
  { icon: MessageSquare, label: 'Messages', href: '/messages' },
  { icon: Heart, label: 'Favourites', href: '/dashboard/favourites' },
  { icon: Star, label: 'My Reviews', href: '/dashboard/reviews' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const StatCard = ({ icon: Icon, label, value, color = 'accent' }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`h-12 w-12 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center shrink-0`}>
      <Icon className={`h-6 w-6 text-${color}`} />
    </div>
    <div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-text-muted text-sm">{label}</p>
    </div>
  </div>
);

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [bRes, pRes] = await Promise.all([
          bookingAPI.getMy({ limit: 5 }),
          providerAPI.getAll({ limit: 6, verificationStatus: 'approved' }),
        ]);
        setBookings(bRes.data.data || []);
        setProviders(pRes.data.data || []);
      } catch (e) { /* ignore */ }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  const active = bookings.filter(b => ['pending', 'accepted', 'confirmed', 'in_progress'].includes(b.status)).length;
  const completed = bookings.filter(b => b.status === 'completed').length;
  const upcoming = bookings.find(b => ['accepted', 'confirmed'].includes(b.status));

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Customer Dashboard">
      <div className="space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{greeting}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-text-muted mt-1">Here's what's happening with your bookings.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={Clock} label="Active Bookings" value={active} color="accent" />
          <StatCard icon={CheckCircle} label="Completed" value={completed} color="success" />
          <StatCard icon={TrendingUp} label="Total Bookings" value={bookings.length} color="warning" />
        </div>

        {/* Upcoming booking */}
        {upcoming && (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-3">Upcoming Appointment</h2>
            <BookingCard booking={upcoming} showActions={false} />
          </div>
        )}

        {/* Recent bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text-primary">Recent Bookings</h2>
            <button onClick={() => navigate('/dashboard/bookings')} className="text-sm text-accent hover:underline">View All</button>
          </div>
          {isLoading ? <SkeletonList count={3} /> : bookings.length === 0 ? (
            <EmptyState icon={Calendar} title="No bookings yet" description="Find a service and book your first appointment." action={{ label: 'Browse Services', onClick: () => navigate('/services') }} />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {bookings.slice(0, 4).map(b => <BookingCard key={b._id} booking={b} showActions={false} />)}
            </div>
          )}
        </div>

        {/* Recommended providers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text-primary">Recommended Professionals</h2>
            <button onClick={() => navigate('/services')} className="text-sm text-accent hover:underline">See All</button>
          </div>
          {isLoading ? <SkeletonList count={3} /> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.slice(0, 3).map(p => <ProviderCard key={p._id} provider={p} />)}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
