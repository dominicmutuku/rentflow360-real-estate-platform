const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getAgentProperties,
  getPropertyAnalytics,
  getLocationSuggestions,
  saveSearch,
  getSavedSearches,
  deleteSavedSearch,
  getRecommendedProperties
} = require('../controllers/propertyController');

// Property validation rules
const propertyValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Property title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Property description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  
  body('type')
    .isIn(['apartment', 'house', 'villa', 'townhouse', 'studio', 'penthouse', 'duplex', 'office', 'shop', 'warehouse', 'commercial'])
    .withMessage('Invalid property type'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 1000 })
    .withMessage('Price must be at least KSH 1,000'),
  
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('location.county')
    .trim()
    .notEmpty()
    .withMessage('County is required'),
  
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  
  body('bedrooms')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Bedrooms must be between 0 and 20'),
  
  body('bathrooms')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Bathrooms must be between 0 and 20'),
  
  body('size')
    .optional()
    .isNumeric()
    .withMessage('Size must be a number'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array')
    .custom((images) => {
      if (images.length > 20) {
        throw new Error('Maximum 20 images allowed');
      }
      return true;
    }),
  
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  
  body('listingType')
    .isIn(['rent', 'sale', 'both'])
    .withMessage('Invalid listing type')
];

// GET /api/properties - Get all properties with search and filters
router.get('/', getProperties);

// GET /api/properties/agent/my-properties - Get agent's properties (must be before /:id)
router.get('/agent/my-properties', 
  authenticate, 
  roleAuth(['agent']), 
  getAgentProperties
);

// GET /api/properties/:id - Get single property by ID
router.get('/:id', getPropertyById);

// GET /api/properties/:id/analytics - Get property analytics
router.get('/:id/analytics',
  authenticate, 
  roleAuth(['agent', 'admin']), 
  getPropertyAnalytics
);// POST /api/properties - Create new property (Agent/Admin only)
router.post('/',
  authenticate, 
  roleAuth(['agent', 'admin']), 
  propertyValidation,
  createProperty
);// PUT /api/properties/:id - Update property (Agent owner or Admin)
router.put('/:id', 
  authenticate, 
  roleAuth(['agent', 'admin']), 
  propertyValidation, 
  updateProperty
);

// DELETE /api/properties/:id - Delete property (Agent owner or Admin)
router.delete('/:id',
  authenticate, 
  roleAuth(['agent', 'admin']), 
  deleteProperty
);// Advanced Search Features
// GET /api/properties/locations/suggestions - Get location autocomplete suggestions
router.get('/locations/suggestions', getLocationSuggestions);

// GET /api/properties/recommendations - Get personalized property recommendations
router.get('/recommendations', getRecommendedProperties);

// Saved Searches (Authenticated users only)
// POST /api/properties/searches/save - Save a search query
router.post('/searches/save', 
  authenticate,
  [
    body('searchQuery').optional().isString().withMessage('Search query must be a string'),
    body('filters').optional().isObject().withMessage('Filters must be an object'),
    body('name').optional().isString().isLength({ max: 100 }).withMessage('Name must be less than 100 characters')
  ],
  saveSearch
);

// GET /api/properties/searches/saved - Get user's saved searches
router.get('/searches/saved', authenticate, getSavedSearches);

// DELETE /api/properties/searches/:searchId - Delete a saved search
router.delete('/searches/:searchId', authenticate, deleteSavedSearch);

module.exports = router;