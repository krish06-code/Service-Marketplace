import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Zap, ArrowLeft, CheckCircle } from 'lucide-react';
import { authAPI } from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white fill-current" />
            </div>
            <span className="text-xl font-bold text-text-primary">ServiConnect</span>
          </Link>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">Email Sent!</h2>
              <p className="text-text-muted text-sm mb-6">
                If an account with <strong className="text-text-primary">{email}</strong> exists, you'll receive a password reset link shortly.
              </p>
              <p className="text-xs text-text-muted bg-bg-surface-2 border border-border-color rounded-lg p-3">
                <strong className="text-warning">Demo mode:</strong> Password reset emails are not actually sent. Use demo credentials on the login page.
              </p>
              <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-accent hover:underline text-sm">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-text-primary mb-1">Reset your password</h2>
              <p className="text-text-muted text-sm mb-6">Enter your email address and we'll send you a reset link.</p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
                  Send Reset Link
                </Button>
              </form>

              <Link to="/login" className="mt-4 flex items-center justify-center gap-2 text-text-muted hover:text-text-primary text-sm transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
