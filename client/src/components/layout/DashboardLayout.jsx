import React, { useState } from 'react';
import { Menu, Bell, Zap, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Avatar from '../ui/Avatar';
import { getAssetURL } from '../../services/api';

const DashboardLayout = ({ children, sidebarItems = [], title = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bg-surface flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-0 left-0 h-full w-64 bg-white border-r border-border-color flex flex-col shadow-[2px_0_12px_rgba(0,0,0,0.04)]">
          {/* Logo */}
          <div className="p-5 border-b border-border-color">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 bg-accent rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(244,91,53,0.25)]">
                <Zap className="h-5 w-5 text-white fill-current" />
              </div>
              <span className="text-base font-bold text-text-primary">
                Servi<span className="text-accent">Connect</span>
              </span>
            </Link>
          </div>

          {/* Nav items */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <Sidebar items={sidebarItems} isOpen={true} onClose={() => {}} />
          </nav>

          {/* User info + logout at bottom */}
          <div className="p-4 border-t border-border-color bg-bg-surface">
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={getAssetURL(user?.avatar)} fallback={user?.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                <p className="text-xs text-text-muted capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/5 text-sm transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <div className="lg:hidden">
        <Sidebar items={sidebarItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-xl border-b border-border-color flex items-center px-4 sm:px-6 gap-4 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
          <button
            className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-text-primary flex-1 truncate">{title}</h1>
          <Link
            to="/notifications"
            className="relative p-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-danger rounded-full ring-2 ring-white" />
            )}
          </Link>
          <Avatar src={getAssetURL(user?.avatar)} fallback={user?.name} size="sm" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
