// Authentication routes for Rentflow360
// Handles user registration, login, logout, and profile management

const express = require('express');
const router = express.Router();

// Import controllers and middleware
const authController = require('../controllers/authController');
const { authenticate, loginRateLimit } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateProfileUpdate
} = require('../middleware/validation');

// Public routes (no authentication required)

// POST /api/auth/register - User registration
router.post('/register', validateRegistration, authController.register);

// POST /api/auth/login - User login with rate limiting
router.post('/login', loginRateLimit, validateLogin, authController.login);

// POST /api/auth/logout - User logout (can be called without auth)
router.post('/logout', authController.logout);

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', validatePasswordResetRequest, authController.requestPasswordReset);

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', validatePasswordReset, authController.resetPassword);

// GET /api/auth/verify-email/:token - Verify email address
router.get('/verify-email/:token', authController.verifyEmail);

// Protected routes (authentication required)

// GET /api/auth/profile - Get current user profile
router.get('/profile', authenticate, authController.getProfile);

// PUT /api/auth/profile - Update user profile
router.put('/profile', authenticate, validateProfileUpdate, authController.updateProfile);

// POST /api/auth/change-password - Change password
router.post('/change-password', authenticate, [
  require('express-validator').body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  require('express-validator').body('newPassword')
    .isLength({ min: 6, max: 128 })
    .withMessage('New password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  require('../middleware/validation').handleValidationErrors
], authController.changePassword);

// DELETE /api/auth/account - Delete user account
router.delete('/account', authenticate, [
  require('express-validator').body('password')
    .notEmpty()
    .withMessage('Password is required for account deletion'),
  require('../middleware/validation').handleValidationErrors
], authController.deleteAccount);

// GET /api/auth/test - Test route (remove in production)
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Rentflow360 Auth API is working',
    timestamp: new Date().toISOString(),
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      logout: 'POST /api/auth/logout',
      profile: 'GET /api/auth/profile',
      updateProfile: 'PUT /api/auth/profile',
      changePassword: 'POST /api/auth/change-password',
      forgotPassword: 'POST /api/auth/forgot-password',
      resetPassword: 'POST /api/auth/reset-password',
      verifyEmail: 'GET /api/auth/verify-email/:token',
      deleteAccount: 'DELETE /api/auth/account'
    }
  });
});

module.exports = router;