const express = require('express');
const router = express.Router();
const { createReview, getProviderReviews, getMyReviews, getMyProviderReviews, adminDeleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.post('/',                        protect, authorize('customer'),       createReview);
router.get('/my',                       protect, authorize('customer'),       getMyReviews);
router.get('/provider/me',              protect, authorize('provider'),       getMyProviderReviews);
router.get('/provider/:providerId',                                           getProviderReviews);
router.delete('/:id',                   protect, authorize('admin'),          adminDeleteReview);

module.exports = router;
