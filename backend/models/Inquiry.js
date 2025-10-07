// Inquiry model for Rentflow360
// Handles property inquiries and communication between users and agents
// Tracks inquiry status and conversation history

const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  // Inquiry Information
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  inquirer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Inquirer is required']
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Agent is required']
  },
  
  // Inquiry Details
  type: {
    type: String,
    enum: ['viewing-request', 'price-inquiry', 'general-info', 'availability', 'negotiation'],
    required: [true, 'Inquiry type is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  
  // Contact Preferences
  preferredContact: {
    method: {
      type: String,
      enum: ['email', 'phone', 'whatsapp', 'in-app'],
      default: 'email'
    },
    value: String // email address or phone number
  },
  
  // Viewing Request Details (if applicable)
  viewingRequest: {
    preferredDate: Date,
    preferredTime: String,
    alternativeDate: Date,
    alternativeTime: String,
    numberOfPeople: {
      type: Number,
      min: 1,
      default: 1
    },
    specialRequirements: String
  },
  
  // Status and Priority
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'scheduled', 'completed', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Response Tracking
  responses: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [2000, 'Response message cannot exceed 2000 characters']
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    readAt: Date,
    attachments: [{
      filename: String,
      url: String,
      size: Number
    }]
  }],
  
  // Scheduling Information
  scheduledViewing: {
    date: Date,
    time: String,
    duration: {
      type: Number,
      default: 60 // minutes
    },
    location: String,
    meetingPoint: String,
    agentNotes: String,
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    },
    feedback: {
      inquirerFeedback: String,
      agentFeedback: String,
      inquirerRating: {
        type: Number,
        min: 1,
        max: 5
      },
      agentRating: {
        type: Number,
        min: 1,
        max: 5
      }
    }
  },
  
  // Follow-up and Outcomes
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  outcome: {
    type: String,
    enum: ['no-action', 'viewing-scheduled', 'offer-made', 'rented', 'not-interested', 'lost-to-competitor'],
    default: 'no-action'
  },
  
  // Analytics
  analytics: {
    responseTime: Number, // in minutes
    totalMessages: {
      type: Number,
      default: 1
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  
  // Additional Information
  source: {
    type: String,
    enum: ['website', 'mobile-app', 'phone', 'email', 'walk-in'],
    default: 'website'
  },
  urgency: {
    moveInDate: Date,
    budget: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'KES'
      }
    },
    additionalRequirements: String
  },
  
  // Privacy and Consent
  consentToContact: {
    type: Boolean,
    default: true
  },
  consentToMarketing: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for inquiry age in hours
inquirySchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60));
});

// Virtual for response time in hours
inquirySchema.virtual('responseTimeInHours').get(function() {
  if (this.responses.length > 0) {
    const firstResponse = this.responses[0];
    return Math.floor((firstResponse.sentAt - this.createdAt) / (1000 * 60 * 60));
  }
  return null;
});

// Pre-save middleware to update analytics
inquirySchema.pre('save', function(next) {
  if (this.responses && this.responses.length > 0) {
    this.analytics.totalMessages = this.responses.length + 1; // +1 for original inquiry
    this.analytics.lastActivity = new Date();
    
    // Calculate response time if not set
    if (!this.analytics.responseTime && this.responses.length > 0) {
      const firstResponse = this.responses[0];
      this.analytics.responseTime = Math.floor(
        (firstResponse.sentAt - this.createdAt) / (1000 * 60)
      );
    }
  }
  next();
});

// Method to add response
inquirySchema.methods.addResponse = function(senderId, message, attachments = []) {
  this.responses.push({
    sender: senderId,
    message,
    attachments,
    sentAt: new Date()
  });
  
  // Update status
  if (this.status === 'new') {
    this.status = 'responded';
  }
  
  return this.save();
};

// Method to mark as read
inquirySchema.methods.markAsRead = function(userId) {
  // Mark inquiry as read
  if (this.status === 'new') {
    this.status = 'read';
  }
  
  // Mark unread responses as read
  this.responses.forEach(response => {
    if (!response.readAt && response.sender.toString() !== userId.toString()) {
      response.readAt = new Date();
    }
  });
  
  return this.save();
};

// Method to schedule viewing
inquirySchema.methods.scheduleViewing = function(date, time, location, agentNotes = '') {
  this.scheduledViewing = {
    date,
    time,
    location,
    agentNotes,
    status: 'scheduled'
  };
  this.status = 'scheduled';
  
  return this.save();
};

// Indexes for better query performance
inquirySchema.index({ property: 1, status: 1 });
inquirySchema.index({ inquirer: 1, createdAt: -1 });
inquirySchema.index({ agent: 1, status: 1, createdAt: -1 });
inquirySchema.index({ status: 1, priority: -1 });
inquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Inquiry', inquirySchema);