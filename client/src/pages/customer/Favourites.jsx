import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Search, CalendarCheck, MessageSquare, Heart, Star, User, Settings } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProviderCard from '../../components/ui/ProviderCard';
import EmptyState from '../../components/ui/EmptyState';
import { userAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

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

const Favourites = () => {
  const { showToast } = useToast();
  const [favourites, setFavourites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try { const res = await userAPI.getFavourites(); setFavourites(res.data.data || []); }
    catch (e) { /* ignore */ }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleUnfavourite = async (providerId) => {
    try {
      await userAPI.toggleFavourite(providerId);
      setFavourites(prev => prev.filter(p => p._id !== providerId));
      showToast('success', 'Removed from favourites');
    } catch (e) { showToast('error', 'Failed'); }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Favourites">
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="card p-5 h-48 animate-pulse" />)}</div>
      ) : favourites.length === 0 ? (
        <EmptyState icon={Heart} title="No favourites yet" description="Save providers you love to quickly book them later." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favourites.map(p => (
            <div key={p._id} className="relative">
              <ProviderCard provider={p} />
              <button
                onClick={() => handleUnfavourite(p._id)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-danger/10 border border-danger/20 text-danger hover:bg-danger/20 transition-colors text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Favourites;
