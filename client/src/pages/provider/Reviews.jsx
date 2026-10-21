import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Avatar from '../../components/ui/Avatar';
import RatingStars from '../../components/ui/RatingStars';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import { reviewAPI, providerAPI } from '../../services/api';
import { providerSidebarItems } from './Dashboard';

const ProviderReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [myRes, statsRes] = await Promise.all([
          reviewAPI.getMyProviderReviews({ page, limit: 10 }),
          providerAPI.getMyStats(),
        ]);
        setReviews(myRes.data.data || []);
        setTotal(myRes.data.total || 0);
        setStats(statsRes.data.data);
      } catch (e) { /* ignore */ }
      finally { setIsLoading(false); }
    };
    load();
  }, [page]);

  return (
    <DashboardLayout sidebarItems={providerSidebarItems} title="My Reviews">
      <div className="space-y-6">
        {stats && (
          <div className="card p-6 flex items-center gap-8">
            <div className="text-center">
              <p className="text-5xl font-extrabold gradient-text">{(stats.averageRating || 0).toFixed(1)}</p>
              <RatingStars rating={stats.averageRating || 0} size="sm" />
              <p className="text-text-muted text-xs mt-1">{stats.totalReviews || 0} reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map(star => {
                const cnt = stats.ratingBreakdown?.[star] || 0;
                const pct = (stats.totalReviews || 0) > 0 ? Math.round((cnt / stats.totalReviews) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="text-text-muted w-4">{star}</span>
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <div className="flex-1 bg-bg-surface-2 rounded-full h-1.5">
                      <div className="bg-warning h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-text-muted w-8 text-right">{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="card p-4 h-24 animate-pulse"/>)}</div>
        ) : reviews.length === 0 ? (
          <EmptyState icon={Star} title="No reviews yet" description="Complete bookings to receive customer reviews." />
        ) : (
          <>
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r._id} className="card p-5">
                  <div className="flex items-start gap-3">
                    <Avatar fallback={r.customer?.name} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-text-primary text-sm">{r.customer?.name}</p>
                        <span className="text-text-muted text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      <RatingStars rating={r.rating} size="sm" />
                      {r.comment && <p className="text-text-muted text-sm mt-1">{r.comment}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={Math.ceil(total / 10)} onPageChange={setPage} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProviderReviews;
