import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, CalendarCheck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import EmptyState from '../../components/ui/EmptyState';
import { paymentAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { providerSidebarItems } from './Dashboard';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const Earnings = () => {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    paymentAPI.getEarnings()
      .then(res => setData(res.data.data))
      .catch(() => showToast('error', 'Failed to load earnings'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <DashboardLayout sidebarItems={providerSidebarItems} title="Earnings"><div className="space-y-4">{Array.from({length:4}).map((_,i)=><div key={i} className="card h-20 animate-pulse"/>)}</div></DashboardLayout>;

  const payments = data?.payments || [];
  const total = data?.totalEarnings || 0;
  const monthly = data?.monthlyBreakdown || [];

  return (
    <DashboardLayout sidebarItems={providerSidebarItems} title="Earnings">
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center shrink-0">
              <IndianRupee className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">₹{total.toLocaleString('en-IN')}</p>
              <p className="text-text-muted text-sm">Total Earnings</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <CalendarCheck className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{payments.length}</p>
              <p className="text-text-muted text-sm">Total Payments</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">₹{payments.length > 0 ? Math.round(total / payments.length).toLocaleString('en-IN') : 0}</p>
              <p className="text-text-muted text-sm">Avg. per Job</p>
            </div>
          </div>
        </div>

        {/* Monthly breakdown */}
        {monthly.length > 0 && (
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Monthly Breakdown</h2>
            <div className="space-y-3">
              {monthly.map((m, i) => {
                const pct = total > 0 ? Math.round((m.amount / total) * 100) : 0;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-text-muted text-sm w-20 shrink-0">{m.month}</span>
                    <div className="flex-1 bg-bg-surface-2 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-text-primary text-sm font-medium w-24 text-right">₹{m.amount.toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Payment history */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Payment History</h2>
          {payments.length === 0 ? (
            <EmptyState icon={IndianRupee} title="No payments yet" description="Complete bookings to see payment history here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="text-left text-text-muted font-medium pb-3 pr-4">Date</th>
                    <th className="text-left text-text-muted font-medium pb-3 pr-4">Customer</th>
                    <th className="text-left text-text-muted font-medium pb-3 pr-4">Service</th>
                    <th className="text-right text-text-muted font-medium pb-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {payments.map(p => (
                    <tr key={p._id}>
                      <td className="py-3 pr-4 text-text-muted">{formatDate(p.createdAt)}</td>
                      <td className="py-3 pr-4 text-text-primary">{p.customer?.name || '—'}</td>
                      <td className="py-3 pr-4 text-text-secondary">{p.booking?.service?.title || '—'}</td>
                      <td className="py-3 text-right text-success font-semibold">₹{p.providerAmount || p.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Earnings;
