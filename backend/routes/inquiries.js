const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const {
  createInquiry,
  getInquiries,
  getInquiryById,
  addInquiryMessage,
  updateInquiryStatus,
  markAsRead,
  getInquiryStats,
  deleteInquiry
} = require('../controllers/InquiryController');

// Inquiry validation
const inquiryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('propertyId')
    .isMongoId()
    .withMessage('Valid property ID is required')
];

const messageValidation = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters')
];

// POST /api/inquiries - Create new inquiry (public route)
router.post('/', inquiryValidation, createInquiry);

// GET /api/inquiries - Get inquiries (role-based access)
router.get('/', authenticate, roleAuth(['user', 'agent', 'admin']), getInquiries);

// GET /api/inquiries/stats - Get inquiry statistics
router.get('/stats', authenticate, roleAuth(['agent', 'admin']), getInquiryStats);

// GET /api/inquiries/:id - Get single inquiry
router.get('/:id', authenticate, roleAuth(['user', 'agent', 'admin']), getInquiryById);

// POST /api/inquiries/:id/messages - Add message to inquiry
router.post('/:id/messages', 
  authenticate, 
  roleAuth(['user', 'agent', 'admin']), 
  messageValidation, 
  addInquiryMessage
);

// PUT /api/inquiries/:id/status - Update inquiry status
router.put('/:id/status', 
  authenticate, 
  roleAuth(['agent', 'admin']),
  [
    body('status')
      .isIn(['pending', 'in-progress', 'resolved', 'closed'])
      .withMessage('Invalid status value')
  ],
  updateInquiryStatus
);

// PUT /api/inquiries/:id/read - Mark messages as read
router.put('/:id/read', authenticate, roleAuth(['user', 'agent', 'admin']), markAsRead);

// DELETE /api/inquiries/:id - Delete inquiry (admin only)
router.delete('/:id', authenticate, roleAuth(['admin']), deleteInquiry);

module.exports = router;