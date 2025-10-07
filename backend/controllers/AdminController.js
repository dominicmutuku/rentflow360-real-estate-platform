const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

// Get comprehensive admin statistics
exports.getAdminStats = async (req, res) => {
  try {
    const { timeframe = '30days' } = req.query;
    
    // Calculate date range based on timeframe
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Overview statistics
    const [
      totalUsers,
      totalAgents,
      totalProperties,
      totalInquiries,
      activeProperties,
      pendingProperties
    ] = await Promise.all([
      User.countDocuments({ role: { $in: ['user', 'agent'] } }),
      User.countDocuments({ role: 'agent' }),
      Property.countDocuments(),
      Inquiry.countDocuments(),
      Property.countDocuments({ status: 'active' }),
      Property.countDocuments({ status: 'pending' })
    ]);

    // Calculate monthly revenue (mock calculation - you'd implement actual payment tracking)
    const monthlyRevenue = totalProperties * 500; // Assuming 500 KES per property listing fee

    // System health calculation
    const healthScore = Math.min(100, (activeProperties / Math.max(totalProperties, 1)) * 100);
    let systemHealth;
    if (healthScore >= 90) systemHealth = 'excellent';
    else if (healthScore >= 75) systemHealth = 'good';
    else if (healthScore >= 50) systemHealth = 'warning';
    else systemHealth = 'critical';

    // User growth data (last 6 months)
    const userGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const [monthUsers, monthAgents, monthProperties] = await Promise.all([
        User.countDocuments({ 
          createdAt: { $gte: monthStart, $lte: monthEnd },
          role: 'user'
        }),
        User.countDocuments({ 
          createdAt: { $gte: monthStart, $lte: monthEnd },
          role: 'agent'
        }),
        Property.countDocuments({ 
          createdAt: { $gte: monthStart, $lte: monthEnd }
        })
      ]);

      userGrowth.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        users: monthUsers,
        agents: monthAgents,
        properties: monthProperties
      });
    }

    // Property status distribution
    const propertyStatuses = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const propertyStats = propertyStatuses.map(stat => ({
      status: stat._id,
      count: stat.count,
      percentage: Math.round((stat.count / totalProperties) * 100)
    }));

    // Location statistics
    const locationStats = await Property.aggregate([
      {
        $group: {
          _id: '$location.city',
          properties: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          totalViews: { $sum: '$views' }
        }
      },
      { $sort: { properties: -1 } },
      { $limit: 10 }
    ]);

    const locationStatsFormatted = await Promise.all(
      locationStats.map(async (location) => {
        const usersInCity = await User.countDocuments({
          'profile.city': location._id
        });

        return {
          city: location._id || 'Unknown',
          properties: location.properties,
          users: usersInCity,
          revenue: location.properties * 500 // Mock revenue calculation
        };
      })
    );

    // Recent activity (mock data - you'd implement actual activity logging)
    const recentActivity = [
      {
        id: '1',
        type: 'user_registration',
        description: 'New user registered: john.doe@example.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        severity: 'info'
      },
      {
        id: '2',
        type: 'property_added',
        description: 'New property listed in Nairobi by agent@example.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        severity: 'info'
      },
      {
        id: '3',
        type: 'report',
        description: 'Property reported by user for inappropriate content',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        severity: 'warning'
      },
      {
        id: '4',
        type: 'inquiry_sent',
        description: 'High volume of inquiries detected in Mombasa area',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        severity: 'info'
      },
      {
        id: '5',
        type: 'payment',
        description: 'Payment processing error for listing fee',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
        severity: 'error'
      }
    ];

    const adminStats = {
      overview: {
        totalUsers,
        totalAgents,
        totalProperties,
        totalInquiries,
        activeListings: activeProperties,
        pendingProperties,
        monthlyRevenue,
        systemHealth
      },
      userGrowth,
      propertyStats,
      locationStats: locationStatsFormatted,
      recentActivity
    };

    res.json(adminStats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch admin statistics' });
  }
};

// Get all users with additional statistics
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });

    // Add additional statistics for agents
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toObject();
        
        if (user.role === 'agent') {
          const [totalProperties, totalInquiries] = await Promise.all([
            Property.countDocuments({ agent: user._id }),
            Inquiry.countDocuments({ 
              property: { 
                $in: await Property.find({ agent: user._id }).distinct('_id') 
              }
            })
          ]);
          
          userObj.totalProperties = totalProperties;
          userObj.totalInquiries = totalInquiries;
        }
        
        return userObj;
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get all properties with agent information
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('agent', 'firstName lastName email')
      .sort({ createdAt: -1 });

    // Add performance metrics
    const propertiesWithMetrics = properties.map(property => {
      const propertyObj = property.toObject();
      
      // Mock reported status - you'd implement actual reporting system
      propertyObj.isReported = Math.random() < 0.1; // 10% chance of being reported
      
      return propertyObj;
    });

    res.json(propertiesWithMetrics);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
};

// User management actions
exports.userAction = async (req, res) => {
  try {
    const { userId, action } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    switch (action) {
      case 'activate':
        user.isActive = true;
        break;
      case 'deactivate':
        user.isActive = false;
        break;
      case 'promote':
        if (user.role === 'user') {
          user.role = 'agent';
        }
        break;
      case 'demote':
        if (user.role === 'agent') {
          user.role = 'user';
        }
        break;
      case 'delete':
        // Soft delete - deactivate instead of actual deletion for data integrity
        user.isActive = false;
        user.email = `deleted_${Date.now()}_${user.email}`;
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    await user.save();
    
    res.json({ message: `User ${action} successful`, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    console.error(`Error ${req.params.action} user:`, error);
    res.status(500).json({ message: `Failed to ${req.params.action} user` });
  }
};

// Property management actions
exports.propertyAction = async (req, res) => {
  try {
    const { propertyId, action } = req.params;
    
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    switch (action) {
      case 'approve':
        property.status = 'active';
        break;
      case 'reject':
        property.status = 'inactive';
        break;
      case 'flag':
        property.status = 'flagged';
        break;
      case 'unflag':
        property.status = 'active';
        break;
      case 'delete':
        await Property.findByIdAndDelete(propertyId);
        return res.json({ message: 'Property deleted successfully' });
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    await property.save();
    
    res.json({ message: `Property ${action} successful`, property });
  } catch (error) {
    console.error(`Error ${req.params.action} property:`, error);
    res.status(500).json({ message: `Failed to ${req.params.action} property` });
  }
};

// Get system reports
exports.getSystemReports = async (req, res) => {
  try {
    const { reportType } = req.params;
    
    let reportData;
    
    switch (reportType) {
      case 'user-activity':
        reportData = await generateUserActivityReport();
        break;
      case 'property-performance':
        reportData = await generatePropertyPerformanceReport();
        break;
      case 'revenue':
        reportData = await generateRevenueReport();
        break;
      case 'issues':
        reportData = await generateIssuesReport();
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }
    
    res.json(reportData);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
};

// Helper functions for reports
async function generateUserActivityReport() {
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });
  const recentLogins = await User.countDocuments({
    lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  });
  
  return {
    title: 'User Activity Report',
    data: {
      activeUsers,
      inactiveUsers,
      recentLogins,
      activityRate: Math.round((recentLogins / activeUsers) * 100)
    }
  };
}

async function generatePropertyPerformanceReport() {
  const properties = await Property.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        averageViews: { $avg: '$views' },
        totalInquiries: { $sum: '$inquiries' }
      }
    }
  ]);
  
  return {
    title: 'Property Performance Report',
    data: properties
  };
}

async function generateRevenueReport() {
  const totalProperties = await Property.countDocuments();
  const activeProperties = await Property.countDocuments({ status: 'active' });
  
  // Mock revenue calculation
  const totalRevenue = totalProperties * 500;
  const activeRevenue = activeProperties * 500;
  
  return {
    title: 'Revenue Report',
    data: {
      totalRevenue,
      activeRevenue,
      listingFee: 500,
      totalProperties,
      activeProperties
    }
  };
}

async function generateIssuesReport() {
  const pendingProperties = await Property.countDocuments({ status: 'pending' });
  const flaggedProperties = await Property.countDocuments({ status: 'flagged' });
  const inactiveUsers = await User.countDocuments({ isActive: false });
  
  return {
    title: 'Issues Report',
    data: {
      pendingProperties,
      flaggedProperties,
      inactiveUsers,
      totalIssues: pendingProperties + flaggedProperties + inactiveUsers
    }
  };
}

module.exports = exports;