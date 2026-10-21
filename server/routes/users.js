const express = require('express');
const router = express.Router();
const { updateProfile, updateAvatar, getUser, getAllUsers, toggleUserStatus, toggleFavourite, getFavourites } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { uploadAvatar } = require('../middleware/upload');

router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, uploadAvatar, updateAvatar);
router.post('/favourites/:providerId', protect, authorize('customer'), toggleFavourite);
router.get('/favourites', protect, authorize('customer'), getFavourites);

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.put('/:id/toggle-status', protect, authorize('admin'), toggleUserStatus);

// Note: GET /profile mentioned in prompt maps to getMe from auth or we can just make it getMe
const { getMe } = require('../controllers/authController');
router.get('/profile', protect, getMe);

module.exports = router;
