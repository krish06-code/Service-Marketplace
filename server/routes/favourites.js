const express = require('express');
const router = express.Router();
const { toggleFavourite, getFavourites } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/', protect, authorize('customer'), getFavourites);
router.post('/toggle', protect, authorize('customer'), (req, res, next) => {
  req.params.providerId = req.body.providerId || req.params.providerId;
  return toggleFavourite(req, res, next);
});
router.post('/:providerId', protect, authorize('customer'), toggleFavourite);
router.post('/', protect, authorize('customer'), (req, res, next) => {
  req.params.providerId = req.body.providerId;
  return toggleFavourite(req, res, next);
});

module.exports = router;
