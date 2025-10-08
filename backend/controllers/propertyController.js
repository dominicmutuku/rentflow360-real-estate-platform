const Property = require('../models/Property');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all properties with search, filters, pagination
const getProperties = async (req, res) => {
  try {
  const { 
    page = 1, 
    limit = 12, 
    search, 
    propertyType, 
    location, 
    minPrice, 
    maxPrice, 
    bedrooms, 
    bathrooms,
    sort = '-createdAt',
    features
  } = req.query;    // Build search query
    let query = { status: 'active' };

    // Advanced fuzzy search with intelligent matching
    if (search) {
      const searchTerms = search.toLowerCase().trim().split(/\s+/);
      const fuzzyQueries = [];
      
      // Common property term variations for fuzzy matching
      const termVariations = {
        'bedroom': ['bed', 'br', 'room', 'bedrooms'],
        'bathroom': ['bath', 'ba', 'bathrooms'],
        'apartment': ['apt', 'flat', 'apartments'],
        'house': ['home', 'houses'],
        'studio': ['bedsitter', 'single', 'studios'],
        'furnished': ['furn', 'furnished'],
        'unfurnished': ['unfurn', 'unfurnished'],
        'parking': ['garage', 'carport', 'parking'],
        'garden': ['yard', 'compound', 'gardens'],
        'swimming': ['pool', 'swimming'],
        'security': ['guard', 'gated', 'secure']
      };
      
      searchTerms.forEach(term => {
        const searchVariations = [term];
        
        // Add variations for this term
        Object.entries(termVariations).forEach(([key, variations]) => {
          if (variations.includes(term) || key.includes(term) || term.includes(key)) {
            searchVariations.push(key, ...variations);
          }
        });
        
        // Create regex patterns for all variations
        const termRegexes = searchVariations.map(variation => 
          new RegExp(variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        );
        
        // Search across multiple fields
        const fieldQueries = [];
        termRegexes.forEach(regex => {
          fieldQueries.push(
            { title: regex },
            { description: regex },
            { propertyType: regex },
            { 'location.city': regex },
            { 'location.neighborhood': regex },
            { 'location.address': regex },
            { amenities: { $in: [regex] } }
          );
        });
        
        fuzzyQueries.push({ $or: fieldQueries });
      });
      
      if (fuzzyQueries.length > 0) {
        query.$and = query.$and || [];
        query.$and.push({ $or: fuzzyQueries });
      }
    }

    // Property type filter
    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    // Location filter
    if (location) {
      const locationRegex = new RegExp(location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = query.$or || [];
      query.$or.push(
        { 'location.city': locationRegex },
        { 'location.neighborhood': locationRegex }
      );
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = parseInt(minPrice);
      if (maxPrice) query['price.amount'].$lte = parseInt(maxPrice);
    }

    // Bedrooms filter
    if (bedrooms) {
      query['specifications.bedrooms'] = { $gte: parseInt(bedrooms) };
    }

    // Bathrooms filter
    if (bathrooms) {
      query['specifications.bathrooms'] = { $gte: parseInt(bathrooms) };
    }

    // Features filter
    if (features) {
      const featuresArray = Array.isArray(features) ? features : [features];
      query.features = { $in: featuresArray };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalProperties = await Property.countDocuments(query);
    const totalPages = Math.ceil(totalProperties / limit);

    // Execute query
    const properties = await Property.find(query)
      .populate('agent', 'firstName lastName email phone profileImage')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProperties,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

// Get single property by ID
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id)
      .populate('agent', 'firstName lastName email phone profileImage')
      .lean();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment view count
    await Property.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: { property }
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
};

// Create new property (Agent/Admin only)
const createProperty = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Transform flat validation data to match Property model structure
    const {
      title,
      description,
      type,
      price,
      location,
      bedrooms,
      bathrooms,
      size,
      amenities = [],
      images = [],
      status = 'active',
      furnished = false,
      parking = false,
      petFriendly = false,
      listingType = 'rent'
    } = req.body;

    // Get user details for contact information
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const propertyData = {
      title,
      description,
      propertyType: type, // Map 'type' to 'propertyType'
      listingType,
      price: {
        amount: price,
        currency: 'KES',
        period: listingType === 'sale' ? 'one-time' : 'monthly'
      },
      location,
      specifications: {
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        size: {
          value: size || 0,
          unit: 'sqft'
        }
      },
      amenities,
      images,
      status,
      owner: req.user.id, // Required field
      agent: req.user.id,
      contact: {
        phone: user.phone || '+254700000000', // Required field - use user's phone or default
        email: user.email,
        whatsapp: user.phone,
        preferredContactMethod: 'phone'
      }
    };

    const property = new Property(propertyData);
    await property.save();

    const populatedProperty = await Property.findById(property._id)
      .populate('agent', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      data: { property: populatedProperty },
      message: 'Property created successfully'
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
};

// Update property (Agent owner or Admin only)
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find property
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership (Agent can only update their own properties)
    if (req.user.role === 'agent' && property.agent.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('agent', 'firstName lastName email phone');

    res.json({
      success: true,
      data: { property: updatedProperty },
      message: 'Property updated successfully'
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
};

// Delete property (Agent owner or Admin only)
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Find property
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership (Agent can only delete their own properties)
    if (req.user.role === 'agent' && property.agent.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    await Property.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
};

// Get agent's properties
const getAgentProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const agentId = req.user.id;

    let query = { agent: agentId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const totalProperties = await Property.countDocuments(query);
    const totalPages = Math.ceil(totalProperties / limit);

    const properties = await Property.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProperties,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching agent properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching agent properties',
      error: error.message
    });
  }
};

// Get property analytics (Agent owner or Admin only)
const getPropertyAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (req.user.role === 'agent' && property.agent.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics for this property'
      });
    }

    const analytics = {
      views: property.views || 0,
      inquiries: property.inquiries || 0,
      favorites: property.favorites || 0,
      createdAt: property.createdAt,
      lastUpdated: property.updatedAt,
      status: property.status,
      daysListed: Math.floor((new Date() - property.createdAt) / (1000 * 60 * 60 * 24))
    };

    res.json({
      success: true,
      data: { analytics }
    });
  } catch (error) {
    console.error('Error fetching property analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property analytics',
      error: error.message
    });
  }
};

// Location autocomplete functionality
const getLocationSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json([]);
    }
    
    // Search in existing property locations
    const locationRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    
    const locations = await Property.aggregate([
      {
        $match: {
          status: 'active',
          $or: [
            { 'location.city': locationRegex },
            { 'location.area': locationRegex },
            { 'location.neighborhood': locationRegex },
            { 'location.address': locationRegex }
          ]
        }
      },
      {
        $group: {
          _id: null,
          cities: { $addToSet: '$location.city' },
          areas: { $addToSet: '$location.area' },
          neighborhoods: { $addToSet: '$location.neighborhood' },
          addresses: { $addToSet: '$location.address' }
        }
      }
    ]);
    
    const suggestions = [];
    if (locations.length > 0) {
      const { cities, areas, neighborhoods, addresses } = locations[0];
      
      // Filter and format suggestions
      cities.filter(city => city && city.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 3)
            .forEach(city => suggestions.push({ type: 'city', value: city, label: `${city} (City)` }));
      
      areas.filter(area => area && area.toLowerCase().includes(query.toLowerCase()))
           .slice(0, 3)
           .forEach(area => suggestions.push({ type: 'area', value: area, label: `${area} (Area)` }));
      
      neighborhoods.filter(neighborhood => neighborhood && neighborhood.toLowerCase().includes(query.toLowerCase()))
                   .slice(0, 3)
                   .forEach(neighborhood => suggestions.push({ type: 'neighborhood', value: neighborhood, label: `${neighborhood} (Neighborhood)` }));
      
      addresses.filter(addr => addr && addr.toLowerCase().includes(query.toLowerCase()))
               .slice(0, 2)
               .forEach(addr => suggestions.push({ type: 'address', value: addr, label: addr }));
    }
    
    // Remove duplicates and limit results
    const uniqueSuggestions = [];
    const seen = new Set();
    
    suggestions.forEach(suggestion => {
      if (!seen.has(suggestion.value.toLowerCase())) {
        seen.add(suggestion.value.toLowerCase());
        uniqueSuggestions.push(suggestion);
      }
    });
    
    res.json(uniqueSuggestions.slice(0, 8));
  } catch (error) {
    console.error('Location suggestions error:', error);
    res.status(500).json({ message: 'Error fetching location suggestions' });
  }
};

// Saved searches functionality
const saveSearch = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { searchQuery, filters, name } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const savedSearch = {
      id: Date.now().toString(),
      name: name || `Search ${(user.savedSearches?.length || 0) + 1}`,
      query: searchQuery,
      filters,
      createdAt: new Date()
    };
    
    user.savedSearches = user.savedSearches || [];
    
    // Limit to 10 saved searches per user
    if (user.savedSearches.length >= 10) {
      user.savedSearches = user.savedSearches.slice(-9);
    }
    
    user.savedSearches.push(savedSearch);
    await user.save();
    
    res.json({ message: 'Search saved successfully', savedSearch });
  } catch (error) {
    console.error('Save search error:', error);
    res.status(500).json({ message: 'Error saving search' });
  }
};

const getSavedSearches = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.savedSearches || []);
  } catch (error) {
    console.error('Get saved searches error:', error);
    res.status(500).json({ message: 'Error fetching saved searches' });
  }
};

const deleteSavedSearch = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { searchId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.savedSearches = (user.savedSearches || []).filter(search => search.id !== searchId);
    await user.save();
    
    res.json({ message: 'Saved search deleted successfully' });
  } catch (error) {
    console.error('Delete saved search error:', error);
    res.status(500).json({ message: 'Error deleting saved search' });
  }
};

// Property recommendations based on user preferences
const getRecommendedProperties = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { limit = 6 } = req.query;
    
    let recommendationQuery = { status: 'active' };
    
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.preferences) {
        const { minPrice, maxPrice, preferredLocations, propertyTypes } = user.preferences;
        
        if (minPrice || maxPrice) {
          recommendationQuery.price = {};
          if (minPrice) recommendationQuery.price.$gte = minPrice;
          if (maxPrice) recommendationQuery.price.$lte = maxPrice;
        }
        
        if (preferredLocations && preferredLocations.length > 0) {
          recommendationQuery.$or = preferredLocations.map(location => ({
            $or: [
              { 'location.city': new RegExp(location, 'i') },
              { 'location.area': new RegExp(location, 'i') }
            ]
          }));
        }
        
        if (propertyTypes && propertyTypes.length > 0) {
          recommendationQuery.type = { $in: propertyTypes };
        }
      }
    }
    
    const properties = await Property.find(recommendationQuery)
      .populate('agent', 'firstName lastName email phone profileImage')
      .sort({ featured: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();
    
    res.json({ success: true, data: properties });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};

module.exports = {
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
};