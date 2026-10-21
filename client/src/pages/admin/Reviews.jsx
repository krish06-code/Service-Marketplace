import React, { useState, useEffect, useCallback } from 'react';
import { Star, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Avatar from '../../components/ui/Avatar';
import RatingStars from '../../components/ui/RatingStars';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Button from '../../components/ui/Button';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { adminSidebarItems } from './Dashboard';

const AdminReviews = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminAPI.getReviews({ page, limit: 15 });
      setReviews(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteReview(deleteId);
      showToast('success', 'Review deleted');
      setDeleteId(null);
      load();
    } catch (e) {
      showToast('error', 'Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} title="All Reviews">
      <div className="space-y-5">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-4 h-20 animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState icon={Star} title="No reviews found" />
        ) : (
          <>
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r._id} className="card p-5 flex items-start gap-4">
                  <Avatar fallback={r.customer?.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="font-medium text-text-primary text-sm">{r.customer?.name}</span>
                        <span className="text-text-muted text-xs mx-2">→</span>
                        <span className="text-text-secondary text-sm">{r.provider?.user?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-text-muted text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                        <Button variant="danger" size="sm" onClick={() => setDeleteId(r._id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <RatingStars rating={r.rating} size="sm" />
                    {r.comment && (
                      <p className="text-text-muted text-sm mt-1 line-clamp-2">{r.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={Math.ceil(total / 15)} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Review?"
        message="This review will be permanently removed."
        confirmText="Delete"
        isDangerous
        isLoading={deleting}
      />
    </DashboardLayout>
  );
};

export default AdminReviews;
