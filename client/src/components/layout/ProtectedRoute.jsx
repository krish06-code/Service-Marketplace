import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../ui/LoadingSpinner';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles.length > 0 && !roles.includes(user?.role)) {
    const redirects = { admin: '/admin', provider: '/provider/dashboard', customer: '/dashboard' };
    return <Navigate to={redirects[user?.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
