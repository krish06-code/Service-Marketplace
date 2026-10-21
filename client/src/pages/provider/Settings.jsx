import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { providerSidebarItems } from './Dashboard';

const ProviderSettings = () => {
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
    } catch (e) { showToast('error', e.response?.data?.message || 'Failed'); }
    finally { setSavingPw(false); }
  };

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <DashboardLayout sidebarItems={providerSidebarItems} title="Settings">
      <div className="max-w-2xl space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Change Password</h2>
          <form onSubmit={handlePw} className="space-y-4">
            <Input label="Current Password" type="password" value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} required />
            <Input label="New Password" type="password" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required />
            <Button type="submit" variant="primary" isLoading={savingPw}>Update Password</Button>
          </form>
        </div>

        <div className="card p-6 border-danger/20">
          <h2 className="text-lg font-semibold text-text-primary mb-2">Danger Zone</h2>
          <p className="text-text-muted text-sm mb-4">These actions are irreversible. Please proceed with caution.</p>
          <Button variant="danger" onClick={handleLogout}>Sign Out of Account</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderSettings;
