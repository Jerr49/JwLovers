const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  refreshToken, 
  logout
  // REMOVE THESE: verifyEmail, forgotPassword, resetPassword, updateProfile, changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
// REMOVE THESE ROUTES FOR NOW:
// router.get('/verify-email/:token', verifyEmail);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
// REMOVE THESE ROUTES FOR NOW:
// router.put('/update-profile', protect, updateProfile);
// router.put('/change-password', protect, changePassword);

module.exports = router;