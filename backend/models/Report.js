// Report model for Rentflow360
// Handles user reports for properties and users
// Supports moderation and admin review

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // Report Information
  type: {
    type: String,
    required: [true, 'Report type is required'],
    enum: ['property', 'user', 'review', 'other']
  },
  reason: {
    type: String,
    required: [true, 'Report reason is required'],
    enum: [
      'inappropriate-content',
      'fake-listing',
      'incorrect-information',
      'spam',
      'fraud',
      'harassment',
      'discrimination',
      'copyright-violation',
      'safety-concern',
      'other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Report description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Reporter Information
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter is required']
  },
  
  // Reported Content
  reportedProperty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reportedReview: {
    type: mongoose.Schema.Types.ObjectId
  },
  
  // Evidence/Screenshots
  evidence: [{
    type: String, // URL to uploaded evidence files
    description: String
  }],
  
  // Report Status
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Admin Review
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  resolution: {
    type: String,
    maxlength: [1000, 'Resolution cannot exceed 1000 characters']
  },
  actionTaken: {
    type: String,
    enum: [
      'no-action',
      'content-removed',
      'user-warned',
      'user-suspended',
      'user-banned',
      'property-suspended',
      'property-removed',
      'other'
    ]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reportSchema.index({ status: 1, priority: -1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ reportedProperty: 1 });
reportSchema.index({ reportedUser: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);