// Property model for Rentflow360
// Handles all property listings with comprehensive details
// Supports different property types and Kenyan market requirements

const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Basic Property Information
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: [
      'apartment', 'house', 'villa', 'townhouse', 'studio', 
      'penthouse', 'duplex', 'maisonette', 'bungalow',
      'commercial', 'office', 'shop', 'warehouse', 'land'
    ]
  },
  listingType: {
    type: String,
    required: [true, 'Listing type is required'],
    enum: ['rent', 'sale', 'lease']
  },
  
  // Pricing Information
  price: {
    amount: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'KES'
    },
    period: {
      type: String,
      enum: ['monthly', 'yearly', 'one-time'],
      default: 'monthly'
    },
    negotiable: {
      type: Boolean,
      default: true
    }
  },
  
  // Property Details
  specifications: {
    bedrooms: {
      type: Number,
      min: [0, 'Bedrooms cannot be negative'],
      default: 0
    },
    bathrooms: {
      type: Number,
      min: [0, 'Bathrooms cannot be negative'],
      default: 0
    },
    size: {
      value: {
        type: Number,
        min: [0, 'Size cannot be negative']
      },
      unit: {
        type: String,
        enum: ['sqft', 'sqm', 'acres', 'hectares'],
        default: 'sqft'
      }
    },
    floors: {
      type: Number,
      min: [0, 'Floors cannot be negative'],
      default: 1
    },
    yearBuilt: {
      type: Number,
      min: [1900, 'Year built seems too old'],
      max: [new Date().getFullYear() + 2, 'Year built cannot be in the far future']
    },
    condition: {
      type: String,
      enum: ['new', 'excellent', 'good', 'fair', 'needs-renovation'],
      default: 'good'
    }
  },
  
  // Location Information
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    county: {
      type: String,
      required: [true, 'County is required']
    },
    neighborhood: String,
    postalCode: String,
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Invalid latitude'],
        max: [90, 'Invalid latitude']
      },
      longitude: {
        type: Number,
        min: [-180, 'Invalid longitude'],
        max: [180, 'Invalid longitude']
      }
    },
    landmark: String,
    directions: String
  },
  
  // Amenities and Features
  amenities: [{
    type: String,
    enum: [
      // Indoor amenities (with both hyphen and underscore formats)
      'air-conditioning', 'air_conditioning', 'heating', 'furnished', 'kitchen-appliances',
      'internet', 'wifi', 'cable-tv', 'fireplace', 'balcony', 'terrace',
      'walk-in-closet', 'walk_in_closet', 'study-room', 'study_room', 'servant-quarter', 'servant_quarters',
      'store-room', 'storage_room', 'kitchen', 'living_room', 'dining_room',
      'master_bedroom', 'guest_room', 'laundry', 'pet_friendly', 'pet-friendly',
      
      // Building amenities
      'elevator', 'parking', 'garage', 'gym', 'swimming-pool', 'swimming_pool',
      'playground', 'garden', 'rooftop', 'common-room', 'basement', 'attic', 'pantry',
      
      // Security features
      'security-guard', 'security', 'cctv', 'alarm-system', 'secure-parking',
      'gated-community', 'intercom',
      
      // Utilities
      'water-supply', 'backup-generator', 'solar-power', 'solar_power', 'borehole',
      'waste-management',
      
      // Location benefits
      'near-school', 'near-hospital', 'near-shopping', 'near-transport',
      'quiet-area', 'city-view', 'garden-view'
    ]
  }],
  
  // Media Files
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  videos: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  virtualTour: {
    url: String,
    provider: String // e.g., 'matterport', '360-photos'
  },
  
  // Property Owner/Agent Information
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Property owner is required']
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Contact Information
  contact: {
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    },
    email: String,
    whatsapp: String,
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'email', 'whatsapp'],
      default: 'phone'
    },
    availableHours: {
      start: String, // e.g., '09:00'
      end: String,   // e.g., '18:00'
      timezone: {
        type: String,
        default: 'Africa/Nairobi'
      }
    }
  },
  
  // Listing Status and Management
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'rented', 'sold', 'expired', 'suspended'],
    default: 'pending'
  },
  availability: {
    availableFrom: Date,
    availableUntil: Date,
    moveInDate: Date
  },
  
  // SEO and Marketing
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  premium: {
    type: Boolean,
    default: false
  },
  tags: [String], // For better searchability
  
  // Analytics and Performance
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    uniqueViews: {
      type: Number,
      default: 0
    },
    inquiries: {
      type: Number,
      default: 0
    },
    favorites: {
      type: Number,
      default: 0
    },
    phoneClicks: {
      type: Number,
      default: 0
    },
    emailClicks: {
      type: Number,
      default: 0
    },
    lastViewed: Date
  },
  
  // Reviews and Ratings
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Administrative Fields
  moderationNotes: String,
  rejectionReason: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  expiresAt: Date,
  
  // Additional Terms
  terms: {
    deposit: {
      amount: Number,
      refundable: {
        type: Boolean,
        default: true
      }
    },
    commission: {
      percentage: Number,
      amount: Number
    },
    minimumStay: String, // e.g., '6 months'
    petPolicy: {
      allowed: {
        type: Boolean,
        default: false
      },
      deposit: Number,
      restrictions: String
    },
    smokingAllowed: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for property URL
propertySchema.virtual('url').get(function() {
  return `/properties/${this._id}`;
});

// Virtual for primary image
propertySchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : null);
});

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function() {
  const { amount, currency, period } = this.price;
  const formatted = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency || 'KES'
  }).format(amount);
  
  if (period === 'monthly') return `${formatted}/month`;
  if (period === 'yearly') return `${formatted}/year`;
  return formatted;
});

// Pre-save middleware to generate slug
propertySchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Method to increment view count
propertySchema.methods.incrementViews = function(isUnique = false) {
  this.analytics.views += 1;
  if (isUnique) {
    this.analytics.uniqueViews += 1;
  }
  this.analytics.lastViewed = new Date();
  return this.save({ validateBeforeSave: false });
};

// Method to add review and update average rating
propertySchema.methods.addReview = function(userId, rating, comment) {
  // Check if user already reviewed
  const existingReview = this.reviews.find(
    review => review.user.toString() === userId.toString()
  );
  
  if (existingReview) {
    throw new Error('User has already reviewed this property');
  }
  
  this.reviews.push({
    user: userId,
    rating,
    comment
  });
  
  // Recalculate average rating
  this.totalReviews = this.reviews.length;
  this.averageRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.totalReviews;
  
  return this.save();
};

// Indexes for better query performance
propertySchema.index({ 'location.city': 1, 'location.county': 1 });
propertySchema.index({ propertyType: 1, listingType: 1 });
propertySchema.index({ 'price.amount': 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ featured: -1, createdAt: -1 });
propertySchema.index({ trending: -1, createdAt: -1 });
propertySchema.index({ owner: 1 });
// Note: slug already has unique index from schema definition, no need for additional index
propertySchema.index({ 'specifications.bedrooms': 1, 'specifications.bathrooms': 1 });

// Text index for search functionality
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.address': 'text',
  'location.city': 'text',
  'location.county': 'text',
  'location.neighborhood': 'text'
});

module.exports = mongoose.model('Property', propertySchema);