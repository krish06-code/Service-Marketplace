import React, { useState } from 'react';
import { Menu, Bell, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Avatar from '../ui/Avatar';
import { getAssetURL } from '../../services/api';

const DashboardLayout = ({ children, sidebarItems = [], title = 'Dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-0 left-0 h-full w-64 bg-bg-surface border-r border-border-color flex flex-col">
          {/* Logo */}
          <div className="p-5 border-b border-border-color">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white fill-current" />
              </div>
              <span className="text-base font-bold text-text-primary">ServiConnect</span>
            </Link>
          </div>
          {/* Nav items */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <Sidebar items={sidebarItems} isOpen={true} onClose={() => {}} />
          </nav>
          {/* User info at bottom */}
          <div className="p-4 border-t border-border-color">
            <div className="flex items-center gap-3">
              <Avatar src={getAssetURL(user?.avatar)} fallback={user?.name} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                <p className="text-xs text-text-muted capitalize">{user?.role}</p>
              </div>
            </div>
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
        <header className="sticky top-0 z-20 h-16 bg-bg-primary/90 backdrop-blur-xl border-b border-border-color flex items-center px-4 sm:px-6 gap-4">
          <button className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface-2 transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold text-text-primary flex-1 truncate">{title}</h1>
          <Link to="/notifications" className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface-2 transition-colors">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-danger rounded-full" />
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
