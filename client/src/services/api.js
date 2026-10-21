import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response?.data && typeof response.data === 'object') {
      const body = response.data;
      if (body.data && typeof body.data === 'object' && !Array.isArray(body.data)) {
        if (body.data.total !== undefined && body.total === undefined) body.total = body.data.total;
        if (body.data.page !== undefined && body.page === undefined) body.page = body.data.page;
        if (body.data.pages !== undefined && body.pages === undefined) body.pages = body.data.pages;
        if (body.data.count !== undefined && body.count === undefined) body.count = body.data.count;
        if (body.data.token !== undefined && body.token === undefined) body.token = body.data.token;
        if (body.data.user !== undefined && body.user === undefined) body.user = body.data.user;

        const listKey = [
          'categories', 'providers', 'bookings', 'services', 'reviews',
          'notifications', 'users', 'conversations', 'messages', 'favourites',
          'payments', 'slots'
        ].find(k => Array.isArray(body.data[k]));

        if (listKey) {
          const list = body.data[listKey];
          Object.keys(body.data).forEach(k => {
            list[k] = body.data[k];
          });
          body.data = list;
        } else if (body.data.provider && Object.keys(body.data).length === 1) {
          body.data = body.data.provider;
        } else if (body.data.booking && Object.keys(body.data).length === 1) {
          body.data = body.data.booking;
        } else if (body.data.service && Object.keys(body.data).length === 1) {
          body.data = body.data.service;
        } else if (body.data.category && Object.keys(body.data).length === 1) {
          body.data = body.data.category;
        } else if (body.data.profile && Object.keys(body.data).length === 1) {
          body.data = body.data.profile;
        } else if (body.data.user && !body.data.token) {
          if (body.data.providerProfile) {
            body.data.user.providerProfile = body.data.providerProfile;
          }
          body.data = body.data.user;
        }
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/update-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
};

export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  updateAvatar: (formData) => api.put('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggleFavourite: (providerId) => api.post(`/users/favourites/${providerId}`),
  getFavourites: () => api.get('/users/favourites'),
};

export const providerAPI = {
  getAll: (params) => api.get('/providers', { params }),
  getById: (id) => api.get(`/providers/${id}`),
  getMyProfile: () => api.get('/providers/me'),
  getMyStats: () => api.get('/providers/me/stats'),
  updateMyProfile: (data) => api.put('/providers/me', data),
  updateAvailability: (data) => api.put('/providers/me/availability', data),
  uploadImage: (formData) => api.put('/providers/me/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getSlots: (id, date) => api.get(`/providers/${id}/slots`, { params: { date } }),
  getServices: (id) => api.get(`/providers/${id}/services`),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const serviceAPI = {
  getAll: (params) => api.get('/services', { params }),
  create: (data) => api.post('/services', data),
  getMy: () => api.get('/services/my'),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMy: (params) => api.get('/bookings', { params }),
  getProviderBookings: (params) => api.get('/bookings/provider', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, data) => api.put(`/bookings/${id}/cancel`, data),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
};

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getProviderReviews: (providerId, params) => api.get(`/reviews/provider/${providerId}`, { params }),
  getMy: () => api.get('/reviews/my'),
  getMyProviderReviews: (params) => api.get('/reviews/provider/me', { params }),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export const messageAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getOrCreate: (data) => api.post('/messages/conversations', data),
  getMessages: (conversationId) => api.get(`/messages/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, data) => api.post(`/messages/conversations/${conversationId}/messages`, data),
  markRead: (conversationId) => api.put(`/messages/conversations/${conversationId}/read`),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const paymentAPI = {
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  getMy: () => api.get('/payments/my'),
  getEarnings: () => api.get('/payments/earnings'),
};

export const searchAPI = {
  search: (q) => api.get('/search', { params: { q } }),
  suggest: (q) => api.get('/search/suggest', { params: { q } }),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  getProviders: (params) => api.get('/admin/providers', { params }),
  getPendingProviders: () => api.get('/admin/providers/pending'),
  approveProvider: (id, data) => api.put(`/admin/providers/${id}/approve`, data),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  getReviews: (params) => api.get('/admin/reviews', { params }),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
  getCategories: (params) => api.get('/admin/categories', { params }),
};

export default api;
