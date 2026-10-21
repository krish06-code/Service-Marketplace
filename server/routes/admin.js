const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllProviders,
  getPendingProviders,
  approveProvider,
  rejectProvider,
  getAllBookingsAdmin,
  getAllReviewsAdmin,
  deleteReview,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

const adminOnly = [protect, authorize('admin')];

router.get('/stats',                   ...adminOnly, getDashboardStats);

// Users
router.get('/users',                   ...adminOnly, getAllUsers);
router.put('/users/:id/toggle-status', ...adminOnly, toggleUserStatus);

// Providers
router.get('/providers',               ...adminOnly, getAllProviders);
router.get('/providers/pending',       ...adminOnly, getPendingProviders);
router.put('/providers/:id/approve',   ...adminOnly, approveProvider);
router.put('/providers/:id/reject',    ...adminOnly, rejectProvider);

// Bookings
router.get('/bookings',                ...adminOnly, getAllBookingsAdmin);

// Categories
const { getAllCategories } = require('../controllers/categoryController');
router.get('/categories',              ...adminOnly, getAllCategories);

// Reviews
router.get('/reviews',                 ...adminOnly, getAllReviewsAdmin);
router.delete('/reviews/:id',          ...adminOnly, deleteReview);

module.exports = router;
