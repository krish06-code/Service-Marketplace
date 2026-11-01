import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Zap } from 'lucide-react';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { getAssetURL } from '../../services/api';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Professionals', href: '/professionals' },
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

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    if (href === '/professionals') return location.pathname === '/professionals' || location.pathname === '/providers';
    return location.pathname === href;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl border-b border-border-color shadow-[0_1px_20px_rgba(0,0,0,0.08)]'
        : 'bg-white/90 backdrop-blur-sm border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="h-9 w-9 bg-accent rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(244,91,53,0.30)] group-hover:shadow-[0_4px_16px_rgba(244,91,53,0.45)] transition-shadow">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="text-lg font-bold text-text-primary tracking-tight">
              Servi<span className="text-accent">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive(link.href)
                    ? 'text-accent bg-accent/5'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/notifications')}
                  className="relative p-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-danger rounded-full ring-2 ring-white" />
                  )}
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-bg-surface transition-colors border border-transparent hover:border-border-color"
                  >
                    <Avatar src={getAssetURL(user?.avatar)} fallback={user?.name} size="sm" />
                    <span className="text-sm font-semibold text-text-primary max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-border-color rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
                      <div className="px-4 py-3 border-b border-border-color bg-bg-surface">
                        <p className="font-semibold text-text-primary text-sm truncate">{user?.name}</p>
                        <p className="text-text-muted text-xs truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to={dashboardLink}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </Link>
                        <Link
                          to={user?.role === 'provider' ? '/provider/profile' : '/dashboard/profile'}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-colors"
                        >
                          <User className="h-4 w-4" /> Profile
                        </Link>
                      </div>
                      <div className="border-t border-border-color py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-bg-surface">
                  Sign In
                </Link>
                <Link to="/register?role=provider">
                  <Button variant="outline" size="sm">Become a Provider</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border-color bg-white py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border-color my-2" />
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 flex items-center gap-3 bg-bg-surface rounded-xl mx-0">
                  <Avatar src={getAssetURL(user?.avatar)} fallback={user?.name} size="sm" />
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{user?.name}</p>
                    <p className="text-text-muted text-xs">{user?.role}</p>
                  </div>
                </div>
                <Link to={dashboardLink} className="px-4 py-2.5 text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-xl text-sm transition-colors flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="px-4 py-2.5 text-danger text-left hover:bg-danger/5 rounded-xl text-sm transition-colors flex items-center gap-2 w-full">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2.5 text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-xl text-sm transition-colors">Sign In</Link>
                <div className="px-0 py-1">
                  <Link to="/register"><Button variant="primary" className="w-full">Get Started</Button></Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
