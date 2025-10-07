const User = require('../models/User');
const Property = require('../models/Property');
const { validationResult } = require('express-validator');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favoriteProperties', 'title price location.city location.area images type bedrooms bathrooms')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, phone, preferences } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: updatedUser 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Get user favorites
const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'favoriteProperties',
        populate: {
          path: 'agent',
          select: 'firstName lastName email phone'
        }
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.favoriteProperties || []);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

// Add property to favorites
const addToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.id;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already favorited
    if (user.favoriteProperties.includes(propertyId)) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }

    user.favoriteProperties.push(propertyId);
    await user.save();

    res.json({ 
      success: true, 
      message: 'Property added to favorites' 
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Error adding to favorites' });
  }
};

// Remove property from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from favorites
    user.favoriteProperties = user.favoriteProperties.filter(
      id => id.toString() !== propertyId
    );
    
    await user.save();

    res.json({ 
      success: true, 
      message: 'Property removed from favorites' 
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Error removing from favorites' });
  }
};

// Get user's property views/history
const getUserPropertyViews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    // This would require a separate PropertyView model or tracking in User model
    // For now, we'll return recently viewed properties from user's activity
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If you implement property view tracking, query it here
    const viewedProperties = user.viewHistory || [];
    
    const skip = (page - 1) * limit;
    const paginatedViews = viewedProperties.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: {
        views: paginatedViews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(viewedProperties.length / limit),
          totalViews: viewedProperties.length
        }
      }
    });
  } catch (error) {
    console.error('Get property views error:', error);
    res.status(500).json({ message: 'Error fetching property views' });
  }
};

// Update user preferences for recommendations
const updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      minPrice, 
      maxPrice, 
      preferredLocations, 
      propertyTypes,
      maxBedrooms,
      minBedrooms 
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update preferences
    user.preferences = {
      ...user.preferences,
      minPrice: minPrice || user.preferences.minPrice,
      maxPrice: maxPrice || user.preferences.maxPrice,
      preferredLocations: preferredLocations || user.preferences.preferredLocations,
      propertyTypes: propertyTypes || user.preferences.propertyTypes,
      maxBedrooms: maxBedrooms || user.preferences.maxBedrooms,
      minBedrooms: minBedrooms || user.preferences.minBedrooms
    };

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Error updating preferences' });
  }
};

// Get user notifications/alerts
const getUserAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get active saved searches with alerts enabled
    const activeAlerts = (user.savedSearches || []).filter(search => search.alertsEnabled);
    
    // For each alert, find new properties that match
    const alertsWithMatches = [];
    
    for (const alert of activeAlerts) {
      const searchQuery = {};
      
      if (alert.filters.location) {
        const locationRegex = new RegExp(alert.filters.location, 'i');
        searchQuery.$or = [
          { 'location.city': locationRegex },
          { 'location.area': locationRegex }
        ];
      }
      
      if (alert.filters.type && alert.filters.type !== 'all') {
        searchQuery.type = alert.filters.type;
      }
      
      if (alert.filters.minPrice || alert.filters.maxPrice) {
        searchQuery.price = {};
        if (alert.filters.minPrice) searchQuery.price.$gte = alert.filters.minPrice;
        if (alert.filters.maxPrice) searchQuery.price.$lte = alert.filters.maxPrice;
      }

      // Find new properties (created after alert was created)
      const newProperties = await Property.find({
        ...searchQuery,
        status: 'active',
        createdAt: { $gte: alert.createdAt }
      })
      .limit(5)
      .select('title price location.city location.area images type bedrooms bathrooms createdAt')
      .lean();

      if (newProperties.length > 0) {
        alertsWithMatches.push({
          alert,
          matches: newProperties,
          count: newProperties.length
        });
      }
    }

    res.json({
      success: true,
      data: alertsWithMatches
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Error fetching alerts' });
  }
};

// Mark user as online/update last activity
const updateUserActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
      isOnline: true
    });

    res.json({ success: true, message: 'Activity updated' });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ message: 'Error updating activity' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  getUserPropertyViews,
  updateUserPreferences,
  getUserAlerts,
  updateUserActivity
};