import React from 'react';
import { LayoutDashboard, Search, CalendarCheck, MessageSquare, Heart, Star, User, Settings } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

const CustomerSettings = () => {
  const { showToast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingPw, setSavingPw] = useState(false);

  const handlePw = async (e) => {
    e.preventDefault();
    setSavingPw(true);
    try {
      await authAPI.updatePassword(pwForm);
      showToast('success', 'Password updated!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Password update failed');
    } finally {
      setSavingPw(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Settings">
      <div className="max-w-2xl space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Change Password</h2>
          <form onSubmit={handlePw} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={pwForm.currentPassword}
              onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={pwForm.newPassword}
              onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
              hint="Minimum 6 characters"
              required
            />
            <Button type="submit" variant="primary" isLoading={savingPw}>Update Password</Button>
          </form>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-2">Notifications</h2>
          <p className="text-text-muted text-sm mb-4">Manage how you receive updates from ServiConnect.</p>
          <div className="space-y-3">
            {['Booking confirmations', 'Booking reminders', 'New messages', 'Promotional offers'].map((label) => (
              <label key={label} className="flex items-center justify-between cursor-pointer">
                <span className="text-text-secondary text-sm">{label}</span>
                <div className="relative h-5 w-9 rounded-full bg-accent cursor-pointer">
                  <div className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-white shadow" />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="card p-6 border border-danger/20">
          <h2 className="text-lg font-semibold text-text-primary mb-2">Account</h2>
          <p className="text-text-muted text-sm mb-4">Sign out from your account on this device.</p>
          <Button variant="danger" onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerSettings;
