const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Create new inquiry
const createInquiry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      propertyId,
      agentId,
      name,
      email,
      phone,
      message,
      inquiryType = 'general'
    } = req.body;

    // Verify property exists
    const property = await Property.findById(propertyId).populate('agent');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Create inquiry data
    const inquiryData = {
      property: propertyId,
      agent: property.agent._id,
      inquirer: req.user?.id || null, // null for guest users
      type: inquiryType,
      subject: `Inquiry about ${property.title}`,
      message,
      inquirerName: name,
      inquirerEmail: email,
      inquirerPhone: phone,
      status: 'pending'
    };

    // Add IP and user agent for tracking
    inquiryData.metadata = {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    const inquiry = new Inquiry(inquiryData);
    await inquiry.save();

    // Populate the inquiry for response
    const populatedInquiry = await Inquiry.findById(inquiry._id)
      .populate('property', 'title price location.city location.area')
      .populate('agent', 'firstName lastName email phone')
      .populate('inquirer', 'firstName lastName email');

    // TODO: Send email notification to agent
    // await sendEmailNotification(property.agent.email, inquiry);

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully',
      data: populatedInquiry
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ message: 'Error sending inquiry' });
  }
};

// Get inquiries (for agents and admins)
const getInquiries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      propertyId,
      agentId
    } = req.query;

    // Build query based on user role and filters
    let query = {};

    // Role-based filtering
    if (req.user.role === 'agent') {
      query.agent = req.user.id;
    } else if (req.user.role === 'user') {
      query.inquirer = req.user.id;
    }
    // Admins can see all inquiries

    // Apply additional filters
    if (status) query.status = status;
    if (type) query.type = type;
    if (propertyId) query.property = propertyId;
    if (agentId && req.user.role === 'admin') query.agent = agentId;

    const skip = (page - 1) * limit;
    const totalInquiries = await Inquiry.countDocuments(query);

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title price location images type')
      .populate('agent', 'firstName lastName email phone')
      .populate('inquirer', 'firstName lastName email')
      .populate('conversations.sender', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalInquiries / limit),
          totalInquiries,
          hasNextPage: page < Math.ceil(totalInquiries / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
};

// Get single inquiry
const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id)
      .populate('property', 'title price location images type agent')
      .populate('agent', 'firstName lastName email phone profileImage')
      .populate('inquirer', 'firstName lastName email phone')
      .populate('conversations.sender', 'firstName lastName');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Check permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      inquiry.agent._id.toString() === req.user.id ||
      (inquiry.inquirer && inquiry.inquirer._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({ message: 'Error fetching inquiry' });
  }
};

// Add message to inquiry conversation
const addInquiryMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { message } = req.body;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Check permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      inquiry.agent.toString() === req.user.id ||
      (inquiry.inquirer && inquiry.inquirer.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add message to conversation
    const newMessage = {
      sender: req.user.id,
      message,
      timestamp: new Date(),
      isRead: false
    };

    inquiry.conversations.push(newMessage);

    // Update inquiry status if it's the first response from agent
    if (req.user.id === inquiry.agent.toString() && inquiry.status === 'pending') {
      inquiry.status = 'in-progress';
      inquiry.firstResponseAt = new Date();
    }

    await inquiry.save();

    // Populate the updated inquiry
    const updatedInquiry = await Inquiry.findById(inquiry._id)
      .populate('conversations.sender', 'firstName lastName');

    res.json({
      success: true,
      message: 'Message added successfully',
      data: updatedInquiry.conversations[updatedInquiry.conversations.length - 1]
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Error adding message' });
  }
};

// Update inquiry status
const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Check permissions (only agent or admin can update status)
    const hasPermission = 
      req.user.role === 'admin' ||
      inquiry.agent.toString() === req.user.id;

    if (!hasPermission) {
      return res.status(403).json({ message: 'Access denied' });
    }

    inquiry.status = status;
    if (resolutionNotes) {
      inquiry.resolutionNotes = resolutionNotes;
    }
    if (status === 'resolved' || status === 'closed') {
      inquiry.resolvedAt = new Date();
      inquiry.resolvedBy = req.user.id;
    }

    await inquiry.save();

    res.json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: { status: inquiry.status }
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Error updating inquiry status' });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Check permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      inquiry.agent.toString() === req.user.id ||
      (inquiry.inquirer && inquiry.inquirer.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mark all messages as read for the current user
    inquiry.conversations.forEach(message => {
      if (message.sender.toString() !== req.user.id) {
        message.isRead = true;
      }
    });

    await inquiry.save();

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
};

// Get inquiry statistics (for agents and admins)
const getInquiryStats = async (req, res) => {
  try {
    let matchQuery = {};

    // Role-based filtering
    if (req.user.role === 'agent') {
      matchQuery.agent = req.user.id;
    }
    // Admins get all stats

    const stats = await Inquiry.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
        }
      }
    ]);

    // Get recent inquiries
    const recentInquiries = await Inquiry.find(matchQuery)
      .populate('property', 'title location.city')
      .populate('inquirer', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        statistics: stats[0] || { total: 0, pending: 0, inProgress: 0, resolved: 0, closed: 0 },
        recentInquiries
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching inquiry statistics' });
  }
};

// Delete inquiry (admin only)
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ message: 'Error deleting inquiry' });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  addInquiryMessage,
  updateInquiryStatus,
  markAsRead,
  getInquiryStats,
  deleteInquiry
};