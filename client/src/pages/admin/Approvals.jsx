import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardCheck, CheckCircle, XCircle, Eye } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import RatingStars from '../../components/ui/RatingStars';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { adminSidebarItems } from './Dashboard';

const AdminApprovals = () => {
  const { showToast } = useToast();
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [actioning, setActioning] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminAPI.getPendingProviders();
      setProviders(res.data.data || []);
    } catch (e) { setProviders([]); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (id, status, notes = '') => {
    setActioning(true);
    try {
      await adminAPI.approveProvider(id, { status, adminNotes: notes });
      showToast('success', `Provider ${status}!`);
      setSelectedProvider(null);
      load();
    } catch (e) { showToast('error', 'Action failed'); }
    finally { setActioning(false); }
  };

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} title="Provider Approvals">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-text-muted text-sm">{providers.length} pending application{providers.length !== 1 ? 's' : ''}</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="card h-20 animate-pulse"/>)}</div>
        ) : providers.length === 0 ? (
          <EmptyState icon={ClipboardCheck} title="No pending approvals" description="All provider applications have been reviewed." />
        ) : (
          <div className="space-y-3">
            {providers.map(p => {
              const u = p.user || {};
              return (
                <div key={p._id} className="card p-5 flex items-center gap-4">
                  <Avatar fallback={u.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary">{u.name}</p>
                    <p className="text-text-muted text-sm truncate">{u.email} · {p.experience || 0} yrs exp</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(p.categories || []).slice(0, 3).map(c => <Badge key={c._id || c} variant="info">{c.name || c}</Badge>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" className="border border-border-color" onClick={() => setSelectedProvider(p)}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleAction(p._id, 'approved')} isLoading={actioning}>
                      <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleAction(p._id, 'rejected')}>
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedProvider} onClose={() => setSelectedProvider(null)} title="Provider Application Details" size="md">
        {selectedProvider && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar fallback={selectedProvider.user?.name} size="lg" />
              <div>
                <h3 className="font-bold text-text-primary text-lg">{selectedProvider.user?.name}</h3>
                <p className="text-text-muted text-sm">{selectedProvider.user?.email}</p>
              </div>
            </div>
            {selectedProvider.bio && <div><p className="text-xs text-text-muted mb-1 font-semibold uppercase">Bio</p><p className="text-text-secondary text-sm">{selectedProvider.bio}</p></div>}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-text-muted text-xs mb-1">Experience</p><p className="text-text-primary font-medium">{selectedProvider.experience || 0} years</p></div>
              <div><p className="text-text-muted text-xs mb-1">Starting Price</p><p className="text-text-primary font-medium">₹{selectedProvider.startingPrice || '—'}</p></div>
              <div><p className="text-text-muted text-xs mb-1">Location</p><p className="text-text-primary font-medium">{selectedProvider.location?.city || '—'}</p></div>
              <div><p className="text-text-muted text-xs mb-1">Service Radius</p><p className="text-text-primary font-medium">{selectedProvider.serviceRadius || 10} km</p></div>
            </div>
            {selectedProvider.skills?.length > 0 && (
              <div><p className="text-text-muted text-xs mb-2 font-semibold uppercase">Skills</p>
                <div className="flex flex-wrap gap-2">{selectedProvider.skills.map((s,i)=><span key={i} className="px-2 py-1 rounded bg-bg-surface-2 border border-border-color text-text-muted text-xs">{s}</span>)}</div>
              </div>
            )}
            <div className="flex gap-3 pt-4 border-t border-border-color">
              <Button variant="danger" className="flex-1" onClick={() => handleAction(selectedProvider._id, 'rejected')} isLoading={actioning}>Reject</Button>
              <Button variant="primary" className="flex-1" onClick={() => handleAction(selectedProvider._id, 'approved')} isLoading={actioning}>Approve</Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default AdminApprovals;
