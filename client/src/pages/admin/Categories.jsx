import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { categoryAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { adminSidebarItems } from './Dashboard';

const ICON_OPTIONS = ['Zap','Droplets','Wind','Sparkles','Wrench','Paintbrush','Hammer','GraduationCap','Dumbbell','Camera','Scissors','Truck','Home','Briefcase'];
const emptyForm = { name: '', slug: '', description: '', icon: 'Wrench' };

const AdminCategories = () => {
  const { showToast } = useToast();
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
    try { const res = await categoryAPI.getAll(); setCategories(res.data.data || []); }
    catch (e) { /* ignore */ }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (cat) => { setEditItem(cat); setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', icon: cat.icon || 'Wrench' }); setModalOpen(true); };

  const autoSlug = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleSave = async () => {
    if (!form.name) { showToast('error', 'Name is required'); return; }
    const payload = { ...form, slug: form.slug || autoSlug(form.name) };
    setSaving(true);
    try {
      if (editItem) await categoryAPI.update(editItem._id, payload);
      else await categoryAPI.create(payload);
      showToast('success', editItem ? 'Category updated!' : 'Category created!');
      setModalOpen(false);
      load();
    } catch (e) { showToast('error', e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await categoryAPI.delete(deleteId); showToast('success', 'Category deleted'); setDeleteId(null); load(); }
    catch (e) { showToast('error', 'Delete failed'); }
    finally { setDeleting(false); }
  };

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} title="Categories">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-text-muted text-sm">{categories.length} categories</p>
          <Button variant="primary" onClick={openAdd}><Plus className="h-4 w-4 mr-1" />Add Category</Button>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({length:6}).map((_,i)=><div key={i} className="card h-24 animate-pulse"/>)}</div>
        ) : categories.length === 0 ? (
          <EmptyState icon={Tag} title="No categories" action={{ label: 'Add Category', onClick: openAdd }} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat._id} className="card p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Tag className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary truncate">{cat.name}</p>
                  <p className="text-text-muted text-xs">{cat.slug}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(cat)} className="p-1.5 text-text-muted hover:text-accent transition-colors rounded-lg hover:bg-bg-surface-2"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteId(cat._id)} className="p-1.5 text-text-muted hover:text-danger transition-colors rounded-lg hover:bg-bg-surface-2"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Category' : 'New Category'} size="sm">
        <div className="space-y-4">
          <Input label="Category Name *" placeholder="e.g. Electrician" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) }))} />
          <Input label="Slug" placeholder="auto-generated" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} hint="URL-friendly identifier" />
          <Input label="Description" placeholder="Short description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div>
            <label className="text-sm font-medium text-text-secondary block mb-1.5">Icon Name (Lucide)</label>
            <select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="input-field">
              {ICON_OPTIONS.map(i => <option key={i} value={i} className="bg-bg-surface">{i}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1 border border-border-color" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1" onClick={handleSave} isLoading={saving}>{editItem ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} title="Delete Category?" message="This cannot be undone." confirmText="Delete" isDangerous isLoading={deleting} />
    </DashboardLayout>
  );
};

export default AdminCategories;
