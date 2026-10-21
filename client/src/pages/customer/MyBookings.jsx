import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, CalendarCheck, MessageSquare, Heart, Star, User, Settings, Calendar, X } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BookingCard from '../../components/ui/BookingCard';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import RatingStars from '../../components/ui/RatingStars';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { bookingAPI, reviewAPI } from '../../services/api';
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

const TABS = ['All', 'Pending', 'Active', 'Completed', 'Cancelled'];
const statusMap = { Pending: 'pending', Active: 'accepted,confirmed,in_progress', Completed: 'completed', Cancelled: 'cancelled,rejected' };

const MyBookings = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 8 };
      if (tab !== 'All') params.status = statusMap[tab];
      const res = await bookingAPI.getMy(params);
      setBookings(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) { setBookings([]); }
    finally { setIsLoading(false); }
  }, [tab, page]);

  useEffect(() => { load(); }, [load]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await bookingAPI.cancel(cancelId);
      showToast('success', 'Booking cancelled.');
      setCancelId(null);
      load();
    } catch (e) { showToast('error', e.response?.data?.message || 'Cancellation failed'); }
    finally { setCancelling(false); }
  };

  const handleReview = async () => {
    if (!reviewForm.rating) { showToast('error', 'Please select a rating'); return; }
    setSubmittingReview(true);
    try {
      await reviewAPI.create({ booking: reviewBooking._id, provider: reviewBooking.provider?._id, rating: reviewForm.rating, comment: reviewForm.comment });
      showToast('success', 'Review submitted!');
      setReviewBooking(null);
      setReviewForm({ rating: 0, comment: '' });
      load();
    } catch (e) { showToast('error', e.response?.data?.message || 'Failed to submit review'); }
    finally { setSubmittingReview(false); }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="My Bookings">
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
          <div className="grid sm:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-5 space-y-3 animate-pulse h-32" />)}</div>
        ) : bookings.length === 0 ? (
          <EmptyState icon={Calendar} title="No bookings found" description="Book a service to see it here." action={{ label: 'Browse Services', onClick: () => navigate('/services') }} />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              {bookings.map(b => (
                <div key={b._id} className="space-y-2">
                  <BookingCard booking={b} showActions onCancel={setCancelId} onViewDetails={() => {}} />
                  {b.status === 'completed' && (
                    <Button variant="secondary" size="sm" className="w-full" onClick={() => setReviewBooking(b)}>
                      <Star className="h-3.5 w-3.5 mr-1" /> Write a Review
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={Math.ceil(total / 8)} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!cancelId}
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
        title="Cancel Booking?"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        isDangerous
        isLoading={cancelling}
      />

      <Modal isOpen={!!reviewBooking} onClose={() => setReviewBooking(null)} title="Write a Review" size="sm">
        {reviewBooking && (
          <div className="space-y-4">
            <p className="text-text-muted text-sm">Rate your experience with <strong className="text-text-primary">{reviewBooking.provider?.user?.name}</strong></p>
            <div className="flex justify-center">
              <RatingStars rating={reviewForm.rating} interactive onChange={r => setReviewForm(f => ({ ...f, rating: r }))} size="lg" />
            </div>
            <Textarea label="Your review (optional)" placeholder="Tell others about your experience..." value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
            <Button variant="primary" className="w-full" onClick={handleReview} isLoading={submittingReview}>Submit Review</Button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default MyBookings;
