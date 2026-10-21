const express = require('express');
const router = express.Router();
const { getAllProviders, getProviderById, getMyProfile, updateMyProfile, updateAvailability, getAvailableSlots, uploadProviderImage, getProviderStats } = require('../controllers/providerController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { uploadProvider } = require('../middleware/upload');

const { getProviderEarnings } = require('../controllers/paymentController');

router.get('/', getAllProviders);
router.get('/me', protect, authorize('provider'), getMyProfile);
router.get('/profile/me', protect, authorize('provider'), getMyProfile);
router.get('/me/stats', protect, authorize('provider'), getProviderStats);
router.get('/dashboard/stats', protect, authorize('provider'), getProviderStats);
router.get('/earnings', protect, authorize('provider'), getProviderEarnings);
router.put('/me', protect, authorize('provider'), updateMyProfile);
router.put('/me/availability', protect, authorize('provider'), updateAvailability);
router.put('/me/image', protect, authorize('provider'), uploadProvider, uploadProviderImage);
router.get('/:id', getProviderById);
router.get('/:id/slots', getAvailableSlots);

const { getServicesByProvider } = require('../controllers/serviceController');
router.get('/:id/services', getServicesByProvider);

module.exports = router;
