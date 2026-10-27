import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// Google "G" SVG icon — inline so no extra dependency is needed
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { login, googleSignIn } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const redirectByRole = (user) => {
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'provider') navigate('/provider/dashboard');
    else navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(form);
      showToast('success', `Welcome back, ${user.name.split(' ')[0]}!`);
      redirectByRole(user);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      showToast('error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading || isLoading) return;
    setError('');
    setIsGoogleLoading(true);
    try {
      const user = await googleSignIn();
      showToast('success', `Welcome, ${user.name.split(' ')[0]}!`);
      redirectByRole(user);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Google Sign-In failed. Please try again.';
      setError(msg);
      showToast('error', msg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white fill-current" />
            </div>
            <span className="text-xl font-bold text-text-primary">ServiConnect</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-text-muted text-sm mt-1">Sign in to your account to continue</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>
          )}

          {/* ── Google Sign-In ─────────────────────────────────── */}
          <button
            type="button"
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-border-color bg-bg-surface-2 hover:bg-bg-surface text-text-primary text-sm font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:border-accent/40 hover:shadow-[0_0_0_1px_rgba(79,124,255,0.2)]"
          >
            {isGoogleLoading ? (
              <span className="h-4 w-4 rounded-full border-2 border-text-muted border-t-accent animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {isGoogleLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          {/* ── Divider ────────────────────────────────────────── */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border-color" />
            <span className="text-xs text-text-muted">or sign in with email</span>
            <div className="flex-1 h-px bg-border-color" />
          </div>

          {/* ── Email / Password form (unchanged) ──────────────── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              icon={Mail}
              value={form.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                icon={Lock}
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-2.5 text-text-muted hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-accent hover:underline">Forgot password?</Link>
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl bg-bg-surface-2 border border-border-color">
            <p className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">Demo Accounts</p>
            <div className="space-y-1 text-xs text-text-muted">
              <p><span className="text-accent">Admin:</span> admin@serviconnect.in / Admin@123</p>
              <p><span className="text-success">Customer:</span> priya@example.com / Customer@123</p>
              <p><span className="text-warning">Provider:</span> rahul@acrepairs.in / Provider@123</p>
            </div>
          </div>

          <p className="text-center text-text-muted text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};


export default Login;

