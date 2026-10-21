import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { serviceAPI, categoryAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { providerSidebarItems } from './Dashboard';

const PRICING_TYPES = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'starting_from', label: 'Starting From' },
];

const emptyForm = { title: '', description: '', price: '', pricingType: 'starting_from', duration: '60', category: '' };

const ServicesManager = () => {
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([serviceAPI.getMy(), categoryAPI.getAll()]);
      setServices(sRes.data.data || []);
      setCategories(cRes.data.data || []);
    } catch (e) { /* ignore */ }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (svc) => {
    setEditItem(svc);
    setForm({ title: svc.title, description: svc.description || '', price: String(svc.price), pricingType: svc.pricingType, duration: String(svc.duration), category: svc.category?._id || svc.category || '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.category) { showToast('error', 'Title, price and category are required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), duration: Number(form.duration) };
      if (editItem) await serviceAPI.update(editItem._id, payload);
      else await serviceAPI.create(payload);
      showToast('success', editItem ? 'Service updated!' : 'Service created!');
      setModalOpen(false);
      load();
    } catch (e) { showToast('error', e.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await serviceAPI.delete(deleteId);
      showToast('success', 'Service deleted');
      setDeleteId(null);
      load();
    } catch (e) { showToast('error', 'Delete failed'); }
    finally { setDeleting(false); }
  };

  const catOptions = [{ value: '', label: 'Select category' }, ...categories.map(c => ({ value: c._id, label: c.name }))];

  return (
    <DashboardLayout sidebarItems={providerSidebarItems} title="My Services">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-text-muted text-sm">{services.length} services listed</p>
          <Button variant="primary" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Service</Button>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-5 h-32 animate-pulse" />)}</div>
        ) : services.length === 0 ? (
          <EmptyState icon={Briefcase} title="No services yet" description="Add your first service to start receiving bookings." action={{ label: 'Add Service', onClick: openAdd }} />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {services.map(svc => (
              <div key={svc._id} className="card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{svc.title}</h3>
                    <p className="text-text-muted text-xs">{svc.category?.name} · {svc.duration} min · {svc.pricingType?.replace('_', ' ')}</p>
                    {svc.description && <p className="text-text-muted text-sm mt-1 line-clamp-2">{svc.description}</p>}
                  </div>
                  <p className="text-success font-bold shrink-0">₹{svc.price}</p>
                </div>
                <div className="flex gap-2 pt-2 border-t border-border-color">
                  <Button variant="ghost" size="sm" className="flex-1 border border-border-color" onClick={() => openEdit(svc)}><Pencil className="h-3.5 w-3.5 mr-1" />Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => setDeleteId(svc._id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Service' : 'Add New Service'} size="md">
        <div className="space-y-4">
          <Input label="Service Title *" placeholder="e.g. AC Deep Cleaning" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Textarea label="Description" placeholder="Describe what this service includes" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Select label="Category *" options={catOptions} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (₹) *" type="number" placeholder="499" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            <Input label="Duration (min)" type="number" placeholder="60" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
          </div>
          <Select label="Pricing Type" options={PRICING_TYPES} value={form.pricingType} onChange={e => setForm(f => ({ ...f, pricingType: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1 border border-border-color" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1" onClick={handleSave} isLoading={saving}>{editItem ? 'Update' : 'Create'} Service</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} title="Delete Service?" message="This service will be removed and cannot be recovered." confirmText="Delete" isDangerous isLoading={deleting} />
    </DashboardLayout>
  );
};

export default ServicesManager;
