import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { PageLoader } from './components/ui/LoadingSpinner';

// ── Public Pages ─────────────────────────────────────────────
const LandingPage        = lazy(() => import('./pages/public/LandingPage'));
const ServicesPage       = lazy(() => import('./pages/ServicesPage'));
const ProviderProfilePage= lazy(() => import('./pages/ProviderProfilePage'));

// ── Auth Pages ───────────────────────────────────────────────
const Login              = lazy(() => import('./pages/auth/Login'));
const Register           = lazy(() => import('./pages/auth/Register'));
const ForgotPassword     = lazy(() => import('./pages/auth/ForgotPassword'));

// ── Booking ──────────────────────────────────────────────────
const BookingFlowPage    = lazy(() => import('./pages/BookingFlowPage'));

// ── Messages & Notifications ─────────────────────────────────
const MessagesPage       = lazy(() => import('./pages/MessagesPage'));
const NotificationsPage  = lazy(() => import('./pages/NotificationsPage'));

// ── Customer Dashboard ────────────────────────────────────────
const CustomerDashboard  = lazy(() => import('./pages/customer/Dashboard'));
const MyBookings         = lazy(() => import('./pages/customer/MyBookings'));
const Favourites         = lazy(() => import('./pages/customer/Favourites'));
const CustomerReviews    = lazy(() => import('./pages/customer/CustomerReviews'));
const CustomerProfile    = lazy(() => import('./pages/customer/CustomerProfile'));
const CustomerSettings   = lazy(() => import('./pages/customer/CustomerSettings'));

// ── Provider Dashboard ────────────────────────────────────────
const ProviderOnboarding = lazy(() => import('./pages/provider/Onboarding'));
const ProviderDashboard  = lazy(() => import('./pages/provider/Dashboard'));
const ProviderRequests   = lazy(() => import('./pages/provider/Requests'));
const ProviderBookings   = lazy(() => import('./pages/provider/Bookings'));
const ProviderCalendar   = lazy(() => import('./pages/provider/Calendar'));
const ServicesManager    = lazy(() => import('./pages/provider/ServicesManager'));
const Availability       = lazy(() => import('./pages/provider/Availability'));
const Earnings           = lazy(() => import('./pages/provider/Earnings'));
const ProviderReviews    = lazy(() => import('./pages/provider/Reviews'));
const ProviderProfile    = lazy(() => import('./pages/provider/Profile'));
const ProviderSettings   = lazy(() => import('./pages/provider/Settings'));

// ── Admin Dashboard ───────────────────────────────────────────
const AdminDashboard     = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers         = lazy(() => import('./pages/admin/Users'));
const AdminProviders     = lazy(() => import('./pages/admin/Providers'));
const AdminApprovals     = lazy(() => import('./pages/admin/Approvals'));
const AdminCategories    = lazy(() => import('./pages/admin/Categories'));
const AdminBookings      = lazy(() => import('./pages/admin/Bookings'));
const AdminReviews       = lazy(() => import('./pages/admin/Reviews'));

// ── 404 ──────────────────────────────────────────────────────
const NotFound = () => (
  <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-6 px-4 text-center">
    <div className="text-8xl font-black gradient-text">404</div>
    <h1 className="text-2xl font-bold text-text-primary">Page Not Found</h1>
    <p className="text-text-muted max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
    <a href="/" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold">Go Home</a>
  </div>
);

const App = () => (
  <div className="min-h-screen bg-bg-primary text-text-primary">
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/providers" element={<ServicesPage />} />
        <Route path="/providers/:id" element={<ProviderProfilePage />} />

        {/* ── Auth ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ── Booking (customer only) ── */}
        <Route path="/book/:providerId" element={
          <ProtectedRoute roles={['customer']}>
            <BookingFlowPage />
          </ProtectedRoute>
        } />

        {/* ── Shared (any authenticated) ── */}
        <Route path="/messages" element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />

        {/* ── Customer Dashboard ── */}
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/bookings" element={
          <ProtectedRoute roles={['customer']}>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/favourites" element={
          <ProtectedRoute roles={['customer']}>
            <Favourites />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/reviews" element={
          <ProtectedRoute roles={['customer']}>
            <CustomerReviews />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/profile" element={
          <ProtectedRoute roles={['customer']}>
            <CustomerProfile />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/settings" element={
          <ProtectedRoute roles={['customer']}>
            <CustomerSettings />
          </ProtectedRoute>
        } />

        {/* ── Provider Onboarding ── */}
        <Route path="/provider/onboarding" element={
          <ProtectedRoute roles={['provider']}>
            <ProviderOnboarding />
          </ProtectedRoute>
        } />

        {/* ── Provider Dashboard ── */}
        <Route path="/provider/dashboard" element={
          <ProtectedRoute roles={['provider']}>
            <ProviderDashboard />
          </ProtectedRoute>
        } />
        <Route path="/provider/requests" element={
          <ProtectedRoute roles={['provider']}>
            <ProviderRequests />
          </ProtectedRoute>
        } />
        <Route path="/provider/bookings" element={
          <ProtectedRoute roles={['provider']}>
            <ProviderBookings />
          </ProtectedRoute>
        } />
        <Route path="/provider/calendar" element={
          <ProtectedRoute roles={['provider']}>
            <ProviderCalendar />
          </ProtectedRoute>
        } />
        <Route path="/provider/services" element={
          <ProtectedRoute roles={['provider']}>
            <ServicesManager />
          </ProtectedRoute>
        } />
        <Route path="/provider/availability" element={
          <ProtectedRoute roles={['provider']}>
            <Availability />
          </ProtectedRoute>
        } />
        <Route path="/provider/earnings" element={
          <ProtectedRoute roles={['provider']}>
            <Earnings />
          </ProtectedRoute>
        } />
        <Route path="/provider/reviews" element={
          <ProtectedRoute roles={['provider']}>
            <ProviderReviews />
          </ProtectedRoute>
        } />
        <Route path="/provider/profile" element={
          <ProtectedRoute roles={['provider']}>
            <ProviderProfile />
          </ProtectedRoute>
        } />
        <Route path="/provider/settings" element={
          <ProtectedRoute roles={['provider']}>
            <ProviderSettings />
          </ProtectedRoute>
        } />

        {/* ── Admin Dashboard ── */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/providers" element={
          <ProtectedRoute roles={['admin']}>
            <AdminProviders />
          </ProtectedRoute>
        } />
        <Route path="/admin/approvals" element={
          <ProtectedRoute roles={['admin']}>
            <AdminApprovals />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute roles={['admin']}>
            <AdminCategories />
          </ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute roles={['admin']}>
            <AdminBookings />
          </ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute roles={['admin']}>
            <AdminReviews />
          </ProtectedRoute>
        } />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </div>
);

export default App;
