const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingById, cancelBooking, getProviderBookings, updateBookingStatus, adminGetAllBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.post('/', protect, authorize('customer'), createBooking);
router.get('/', protect, authorize('customer'), getMyBookings);
router.get('/my-bookings', protect, authorize('customer'), getMyBookings);
router.get('/provider', protect, authorize('provider'), getProviderBookings);
router.get('/provider-bookings', protect, authorize('provider'), getProviderBookings);
router.get('/admin', protect, authorize('admin'), adminGetAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, authorize('customer'), cancelBooking);
router.put('/:id/status', protect, authorize('provider'), updateBookingStatus);

module.exports = router;
