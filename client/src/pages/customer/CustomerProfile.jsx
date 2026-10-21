import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Search, CalendarCheck, MessageSquare, Heart, Star, User, Settings, Upload } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { userAPI, authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
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

const CustomerProfile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = React.useRef(null);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userAPI.updateProfile(form);
      updateUser(res.data.data?.user || res.data.data);
      showToast('success', 'Profile updated!');
    } catch (e) { showToast('error', 'Update failed'); }
    finally { setSaving(false); }
  };

  const handlePw = async (e) => {
    e.preventDefault();
    setSavingPw(true);
    try {
      await authAPI.updatePassword(pwForm);
      showToast('success', 'Password updated!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (e) { showToast('error', e.response?.data?.message || 'Password update failed'); }
    finally { setSavingPw(false); }
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

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Profile">
      <div className="max-w-2xl space-y-6">
        {/* Avatar */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Profile Photo</h2>
          <div className="flex items-center gap-4">
            <Avatar src={user?.avatar ? `${import.meta.env.VITE_SOCKET_URL}${user.avatar}` : null} fallback={user?.name} size="xl" />
            <div>
              <Button variant="secondary" size="sm" isLoading={uploading} onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1" /> Upload Photo
              </Button>
              <p className="text-text-muted text-xs mt-1">JPG, PNG, WEBP · Max 5MB</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Personal Information</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <Input label="Email Address" value={user?.email || ''} disabled hint="Email cannot be changed" />
            <Input label="Phone Number" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <Button type="submit" variant="primary" isLoading={saving}>Save Changes</Button>
          </form>
        </div>

        {/* Change password */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Change Password</h2>
          <form onSubmit={handlePw} className="space-y-4">
            <Input label="Current Password" type="password" value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} required />
            <Input label="New Password" type="password" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required />
            <Button type="submit" variant="primary" isLoading={savingPw}>Update Password</Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerProfile;
