const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  getAllProperties,
  userAction,
  propertyAction,
  getSystemReports
} = require('../controllers/AdminController');
const { protect, adminOnly } = require('../middleware/auth');

// Apply admin protection to all routes
router.use(protect);
router.use(adminOnly);

// Admin statistics and overview
router.get('/stats', getAdminStats);

// User management
router.get('/users', getAllUsers);
router.post('/users/:userId/:action', userAction);

// Property management
router.get('/properties', getAllProperties);
router.post('/properties/:propertyId/:action', propertyAction);

// System reports
router.get('/reports/:reportType', getSystemReports);

module.exports = router;