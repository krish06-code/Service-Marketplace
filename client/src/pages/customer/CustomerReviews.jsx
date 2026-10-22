import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Search, CalendarCheck, MessageSquare, Heart, Star, User, Settings } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Avatar from '../../components/ui/Avatar';
import RatingStars from '../../components/ui/RatingStars';
import EmptyState from '../../components/ui/EmptyState';
import { reviewAPI, getAssetURL } from '../../services/api';

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

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reviewAPI.getMy()
      .then(res => setReviews(res.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="My Reviews">
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Complete a booking and share your experience with the professional."
        />
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r._id} className="card p-5 flex gap-4">
              <Avatar
                src={getAssetURL(r.provider?.user?.avatar)}
                fallback={r.provider?.user?.name}
                size="md"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">{r.provider?.user?.name}</p>
                    <p className="text-text-muted text-xs">{r.booking?.service?.title}</p>
                  </div>
                  <span className="text-text-muted text-xs">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <RatingStars rating={r.rating} size="sm" />
                {r.comment && (
                  <p className="text-text-muted text-sm mt-2">{r.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default CustomerReviews;
