import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ArrowLeft } from 'lucide-react';
import { notificationAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

const typeIcon = {
  booking_confirmed: '✅',
  booking_cancelled: '❌',
  booking_completed: '🎉',
  new_booking: '📅',
  booking_accepted: '👍',
  new_message: '💬',
  review_received: '⭐',
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { markAllRead } = useNotifications();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    notificationAPI.getAll({ limit: 50 })
      .then(res => setNotifications(res.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) { /* ignore */ }
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      showToast('success', 'All notifications marked as read');
    } catch (e) { /* ignore */ }
    finally { setMarkingAll(false); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg border border-border-color text-text-muted hover:text-text-primary hover:border-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-2xl font-bold text-text-primary flex-1">Notifications</h1>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="border border-border-color" onClick={handleMarkAll} isLoading={markingAll}>
              <CheckCheck className="h-4 w-4 mr-1.5" /> Mark All Read
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-4 h-16 animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up! We'll notify you when something happens." />
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <div
                key={n._id}
                onClick={() => !n.isRead && handleMarkRead(n._id)}
                className={`card p-4 flex items-start gap-4 cursor-pointer transition-all hover:border-accent/30 ${!n.isRead ? 'border-accent/20 bg-accent/3' : ''}`}
              >
                <span className="text-2xl shrink-0">{typeIcon[n.type] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.isRead ? 'text-text-secondary' : 'text-text-primary font-medium'}`}>
                    {n.message}
                  </p>
                  <p className="text-text-muted text-xs mt-1">
                    {new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.isRead && (
                  <span className="h-2.5 w-2.5 rounded-full bg-accent shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
