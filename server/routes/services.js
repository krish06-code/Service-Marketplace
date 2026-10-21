const express = require('express');
const router = express.Router();
const { createService, getMyServices, updateService, deleteService, getAllServices, getServicesByProvider } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/', getAllServices);
router.get('/provider/:providerId', getServicesByProvider);
router.post('/', protect, authorize('provider'), createService);
router.get('/my', protect, authorize('provider'), getMyServices);
router.put('/:id', protect, authorize('provider'), updateService);
router.delete('/:id', protect, authorize('provider'), deleteService);

module.exports = router;
