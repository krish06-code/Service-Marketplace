import React from 'react';
import { Calendar, Clock, IndianRupee, X } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Button from './Button';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const BookingCard = ({ booking, showActions = false, onCancel, onViewDetails }) => {
  const service = booking.service || {};
  const provider = booking.provider || {};
  const providerUser = provider.user || {};
  const customer = booking.customer || {};

  const canCancel = ['pending', 'accepted'].includes(booking.status);

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate">{service.title || 'Service'}</h3>
          <p className="text-text-muted text-sm truncate">
            {providerUser.name || customer.name || 'Unknown'}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-text-muted">
          <Calendar className="h-4 w-4 text-accent shrink-0" />
          <span>{formatDate(booking.scheduledDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <Clock className="h-4 w-4 text-accent shrink-0" />
          <span>{booking.startTime} – {booking.endTime}</span>
        </div>
        <div className="flex items-center gap-2 text-text-muted col-span-2">
          <IndianRupee className="h-4 w-4 text-success shrink-0" />
          <span className="text-success font-semibold">₹{booking.price}</span>
          <span className="text-text-muted">· Cash on Delivery</span>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-2 border-t border-border-color">
          {onViewDetails && (
            <Button variant="ghost" size="sm" className="flex-1 border border-border-color" onClick={() => onViewDetails(booking)}>
              View Details
            </Button>
          )}
          {canCancel && onCancel && (
            <Button variant="danger" size="sm" className="flex-1" onClick={() => onCancel(booking._id)}>
              <X className="h-3.5 w-3.5 mr-1" /> Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCard;
