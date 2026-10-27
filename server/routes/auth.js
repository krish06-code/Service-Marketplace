const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, updatePassword, forgotPassword, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);          // ← Firebase Google Sign-In
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);

module.exports = router;

