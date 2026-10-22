import React, { useState, useEffect } from 'react';
import { Upload, MapPin, Save } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { providerAPI, categoryAPI, userAPI, getAssetURL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { providerSidebarItems } from './Dashboard';

const ProviderProfile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    bio: '', experience: '', skills: '', serviceRadius: '10',
    location: { address: '', city: '', state: '', pincode: '' },
    startingPrice: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCats, setSelectedCats] = useState([]);
  const fileRef = React.useRef(null);

  useEffect(() => {
    Promise.all([providerAPI.getMyProfile(), categoryAPI.getAll()]).then(([pRes, cRes]) => {
      const p = pRes.data.data;
      setProfile(p);
      setCategories(cRes.data.data || []);
      setForm({
        bio: p.bio || '',
        experience: String(p.experience || ''),
        skills: (p.skills || []).join(', '),
        serviceRadius: String(p.serviceRadius || 10),
        location: p.location || { address: '', city: '', state: '', pincode: '' },
        startingPrice: String(p.startingPrice || ''),
      });
      setSelectedCats((p.categories || []).map(c => c._id || c));
    }).catch(() => {});
  }, []);

  const toggleCat = (id) => setSelectedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        experience: Number(form.experience),
        serviceRadius: Number(form.serviceRadius),
        startingPrice: Number(form.startingPrice),
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        categories: selectedCats,
      };
      await providerAPI.updateMyProfile(payload);
      showToast('success', 'Profile updated!');
    } catch (e) { showToast('error', 'Update failed'); }
    finally { setSaving(false); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const res = await userAPI.updateAvatar(fd);
      const avatarUrl = res.data.data?.user?.avatar || res.data.data?.avatar;
      updateUser({ avatar: avatarUrl });
      showToast('success', 'Avatar updated!');
    } catch (e) { showToast('error', 'Upload failed'); }
    finally { setUploading(false); }
  };

  if (!profile) return <DashboardLayout sidebarItems={providerSidebarItems} title="My Profile"><div className="animate-pulse space-y-4">{Array.from({length:5}).map((_,i)=><div key={i} className="card h-20"/>)}</div></DashboardLayout>;

  return (
    <DashboardLayout sidebarItems={providerSidebarItems} title="My Profile">
      <div className="max-w-2xl space-y-6">
        {/* Avatar */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Profile Photo</h2>
          <div className="flex items-center gap-4">
            <Avatar src={getAssetURL(user?.avatar)} fallback={user?.name} size="xl" />
            <div>
              <Button variant="secondary" size="sm" isLoading={uploading} onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1" /> Upload Photo
              </Button>
              <p className="text-text-muted text-xs mt-1">JPG, PNG · Max 5MB</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* About */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">About You</h2>
            <Textarea label="Professional Bio" placeholder="Describe your experience and expertise..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Years of Experience" type="number" placeholder="5" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
              <Input label="Starting Price (₹)" type="number" placeholder="299" value={form.startingPrice} onChange={e => setForm(f => ({ ...f, startingPrice: e.target.value }))} />
            </div>
            <Input label="Skills (comma separated)" placeholder="AC Repair, Gas Refill, Installation" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
          </div>

          {/* Categories */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Service Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => toggleCat(cat._id)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${selectedCats.includes(cat._id) ? 'bg-accent border-accent text-white' : 'border-border-color text-text-muted hover:border-accent/50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2"><MapPin className="h-5 w-5 text-accent" />Location</h2>
            <Input label="Street Address" value={form.location.address} onChange={e => setForm(f => ({ ...f, location: { ...f.location, address: e.target.value } }))} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="City" value={form.location.city} onChange={e => setForm(f => ({ ...f, location: { ...f.location, city: e.target.value } }))} />
              <Input label="State" value={form.location.state} onChange={e => setForm(f => ({ ...f, location: { ...f.location, state: e.target.value } }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Pincode" value={form.location.pincode} onChange={e => setForm(f => ({ ...f, location: { ...f.location, pincode: e.target.value } }))} />
              <Input label="Service Radius (km)" type="number" value={form.serviceRadius} onChange={e => setForm(f => ({ ...f, serviceRadius: e.target.value }))} />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={saving}>
            <Save className="h-4 w-4 mr-2" /> Save Profile
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProviderProfile;
