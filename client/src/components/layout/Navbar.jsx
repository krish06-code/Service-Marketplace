import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Zap, Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Professionals', href: '/providers' },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (!dropdownRef.current?.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const dashboardLink = user?.role === 'provider' ? '/provider/dashboard' : user?.role === 'admin' ? '/admin' : '/dashboard';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-primary/90 backdrop-blur-xl border-b border-border-color shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-lg font-bold text-text-primary tracking-tight">ServiConnect</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} className={`text-sm font-medium transition-colors hover:text-accent ${location.pathname === link.href ? 'text-accent' : 'text-text-secondary'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface-2 transition-colors">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-danger rounded-full" />
                  )}
                </button>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-bg-surface-2 transition-colors">
                    <Avatar src={user?.avatar ? `${import.meta.env.VITE_SOCKET_URL}${user.avatar}` : null} fallback={user?.name} size="sm" />
                    <span className="text-sm font-medium text-text-primary max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-bg-surface border border-border-color rounded-xl shadow-2xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-border-color">
                        <p className="font-medium text-text-primary text-sm truncate">{user?.name}</p>
                        <p className="text-text-muted text-xs truncate">{user?.email}</p>
                      </div>
                      <Link to={dashboardLink} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-surface-2 hover:text-text-primary transition-colors">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link to={user?.role === 'provider' ? '/provider/profile' : '/dashboard/profile'} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-surface-2 hover:text-text-primary transition-colors">
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <div className="border-t border-border-color" />
                      <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors w-full text-left">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Sign In</Link>
                <Link to="/register?role=provider">
                  <Button variant="ghost" size="sm" className="border border-border-color">Become a Provider</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-surface-2 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border-color bg-bg-primary/95 backdrop-blur-xl py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} className="px-4 py-2 text-text-secondary hover:text-accent hover:bg-bg-surface-2 rounded-lg transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border-color my-2" />
            {isAuthenticated ? (
              <>
                <Link to={dashboardLink} className="px-4 py-2 text-text-secondary hover:text-accent hover:bg-bg-surface-2 rounded-lg transition-colors">Dashboard</Link>
                <button onClick={handleLogout} className="px-4 py-2 text-danger text-left hover:bg-danger/10 rounded-lg transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-text-secondary hover:text-accent hover:bg-bg-surface-2 rounded-lg">Sign In</Link>
                <Link to="/register" className="mx-4"><Button variant="primary" className="w-full">Get Started</Button></Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
