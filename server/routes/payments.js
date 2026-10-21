const express = require('express');
const router = express.Router();
const { getPaymentByBooking, confirmCodPayment, getMyPayments, getProviderEarnings } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/booking/:bookingId', protect, getPaymentByBooking);
router.get('/my', protect, authorize('customer'), getMyPayments);
router.get('/earnings', protect, authorize('provider'), getProviderEarnings);
router.put('/:id/confirm-cod', protect, confirmCodPayment);

module.exports = router;
