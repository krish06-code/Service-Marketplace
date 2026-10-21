import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { bookingAPI } from '../../services/api';
import { providerSidebarItems } from './Dashboard';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const ProviderCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    setIsLoading(true);
    const start = new Date(year, month, 1).toISOString();
    const end = new Date(year, month + 1, 0).toISOString();
    bookingAPI.getProviderBookings({ startDate: start, endDate: end, limit: 100 })
      .then(res => setBookings(res.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [year, month]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const bookingsByDay = {};
  bookings.forEach(b => {
    const d = new Date(b.scheduledDate).getDate();
    if (!bookingsByDay[d]) bookingsByDay[d] = [];
    bookingsByDay[d].push(b);
  });

  const todayStr = new Date().toDateString();
  const selectedBookings = selectedDay ? (bookingsByDay[selectedDay] || []) : [];

  return (
    <DashboardLayout sidebarItems={providerSidebarItems} title="Calendar">
      <div className="space-y-6">
        <div className="card p-6">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 rounded-lg border border-border-color hover:border-accent text-text-muted hover:text-text-primary transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-semibold text-text-primary">{MONTHS[month]} {year}</h2>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 rounded-lg border border-border-color hover:border-accent text-text-muted hover:text-text-primary transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_SHORT.map(d => <div key={d} className="text-center text-text-muted text-xs font-medium py-2">{d}</div>)}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayDate = new Date(year, month, day);
              const isToday = dayDate.toDateString() === todayStr;
              const hasBookings = bookingsByDay[day]?.length > 0;
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                    isSelected ? 'bg-accent text-white' :
                    isToday ? 'bg-accent/10 border border-accent text-accent' :
                    'hover:bg-bg-surface-2 text-text-secondary'
                  }`}
                >
                  {day}
                  {hasBookings && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-warning" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day bookings */}
        {selectedDay && (
          <div className="card p-6">
            <h3 className="font-semibold text-text-primary mb-4">Bookings on {selectedDay} {MONTHS[month]}</h3>
            {selectedBookings.length === 0 ? (
              <p className="text-text-muted text-sm">No bookings on this day.</p>
            ) : (
              <div className="space-y-3">
                {selectedBookings.map(b => (
                  <div key={b._id} className="flex items-center justify-between p-3 bg-bg-surface-2 rounded-xl border border-border-color">
                    <div>
                      <p className="font-medium text-text-primary text-sm">{b.service?.title}</p>
                      <p className="text-text-muted text-xs">{b.customer?.name} · {b.startTime}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedDay && (
          <div className="text-center text-text-muted text-sm">Click on a day to view bookings</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProviderCalendar;
