// User model for Rentflow360
// Supports 4 user roles: guest, user, agent, admin
// Includes authentication, profile, and role-based features

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[0-9\-\(\)\s]+$/, 'Please enter a valid phone number']
  },
  
  // User Role and Status
  role: {
    type: String,
    enum: ['guest', 'user', 'agent', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Profile Information
  avatar: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },
  
  // Location Information
  address: {
    street: String,
    city: String,
    county: String,
    postalCode: String,
    country: {
      type: String,
      default: 'Kenya'
    }
  },
  
  // Agent/Business Information (for agents)
  businessInfo: {
    companyName: String,
    licenseNumber: String,
    yearsOfExperience: Number,
    specialization: [String], // e.g., ['residential', 'commercial', 'land']
    description: String,
    website: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String
    }
  },
  
  // User Preferences
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    currency: {
      type: String,
      default: 'KES'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  
  // Favorites and Saved Searches
  favoriteProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  savedSearches: [{
    id: String,
    name: String,
    query: String,
    filters: {
      type: String,
      location: String,
      minPrice: Number,
      maxPrice: Number,
      bedrooms: Number,
      bathrooms: Number,
      features: [String],
      sort: String
    },
    alertsEnabled: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // User Preferences for Recommendations
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    currency: {
      type: String,
      default: 'KES'
    },
    language: {
      type: String,
      default: 'en'
    },
    // Property recommendation preferences
    minPrice: Number,
    maxPrice: Number,
    preferredLocations: [String],
    propertyTypes: [String],
    maxBedrooms: Number,
    minBedrooms: Number
  },
  
  // Account Security
  security: {
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,
    lastFailedLogin: Date
  },
  activity: {
    lastLogin: {
      type: Date
    },
    loginCount: {
      type: Number,
      default: 0
    },
    lastIpAddress: String,
    lastUserAgent: String
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  
  // Account Statistics
  stats: {
    propertiesViewed: {
      type: Number,
      default: 0
    },
    searchesPerformed: {
      type: Number,
      default: 0
    },
    inquiriesSent: {
      type: Number,
      default: 0
    },
    reviewsGiven: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for user display name (for agents, show company name if available)
userSchema.virtual('displayName').get(function() {
  if (this.role === 'agent' && this.businessInfo?.companyName) {
    return this.businessInfo.companyName;
  }
  return this.fullName;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it was modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update last login
userSchema.methods.updateLastLogin = function() {
  this.activity.lastLogin = new Date();
  this.activity.loginCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Method to add property to favorites
userSchema.methods.addToFavorites = function(propertyId) {
  if (!this.favoriteProperties.includes(propertyId)) {
    this.favoriteProperties.push(propertyId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove property from favorites
userSchema.methods.removeFromFavorites = function(propertyId) {
  this.favoriteProperties = this.favoriteProperties.filter(
    id => id.toString() !== propertyId.toString()
  );
  return this.save();
};

// Account security methods
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.security.lockUntil && this.security.lockUntil < Date.now()) {
    return this.updateOne({
      $set: {
        'security.loginAttempts': 1,
        'security.lastFailedLogin': Date.now()
      },
      $unset: {
        'security.lockUntil': 1
      }
    });
  }
  
  const updates = { 
    $inc: {
      'security.loginAttempts': 1
    },
    $set: {
      'security.lastFailedLogin': Date.now()
    }
  };
  
  // If we have exceeded max attempts and it's not locked already
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.security.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set['security.lockUntil'] = Date.now() + lockTime;
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      'security.loginAttempts': 1,
      'security.lockUntil': 1,
      'security.lastFailedLogin': 1
    }
  });
};

userSchema.methods.updateActivity = function(ipAddress, userAgent) {
  this.activity.lastIpAddress = ipAddress;
  this.activity.lastUserAgent = userAgent;
  return this.save({ validateBeforeSave: false });
};

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
});

// Index for faster queries (email index handled by unique: true)
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);