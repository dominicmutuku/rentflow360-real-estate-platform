const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const { authenticate } = require('../middleware/auth');

// Get agent analytics
router.get('/agent', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({ message: 'Access denied. Agents only.' });
    }

    const { timeframe = '6months' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '1month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '6months':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    }

    // Get agent's properties
    const agentProperties = await Property.find({ agent: req.user._id });
    const propertyIds = agentProperties.map(p => p._id);

    // Overview statistics
    const totalProperties = agentProperties.length;
    const activeProperties = agentProperties.filter(p => p.status === 'active').length;
    const totalViews = agentProperties.reduce((sum, p) => sum + (p.views || 0), 0);
    const averagePrice = agentProperties.length > 0 
      ? agentProperties.reduce((sum, p) => sum + p.price, 0) / agentProperties.length 
      : 0;

    // Get inquiries for agent's properties
    const totalInquiries = await Inquiry.countDocuments({
      property: { $in: propertyIds }
    });

    const conversionRate = totalViews > 0 ? (totalInquiries / totalViews) * 100 : 0;

    // Monthly data for the last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthProperties = await Property.find({
        agent: req.user._id,
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });

      const monthInquiries = await Inquiry.countDocuments({
        property: { $in: propertyIds },
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });

      // Calculate views for this month (mock data since we don't track historical views)
      const monthViews = monthProperties.reduce((sum, p) => sum + Math.floor((p.views || 0) / 6), 0);

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        views: monthViews,
        inquiries: monthInquiries,
        newProperties: monthProperties.length
      });
    }

    // Property performance
    const propertyPerformance = await Promise.all(
      agentProperties.map(async (property) => {
        const inquiries = await Inquiry.countDocuments({ property: property._id });
        
        return {
          id: property._id,
          title: property.title,
          views: property.views || 0,
          inquiries,
          price: property.price,
          status: property.status
        };
      })
    );

    // Sort by performance (views + inquiries)
    propertyPerformance.sort((a, b) => (b.views + b.inquiries) - (a.views + a.inquiries));

    // Location analytics
    const locationStats = {};
    agentProperties.forEach(property => {
      const city = property.location.city;
      if (!locationStats[city]) {
        locationStats[city] = { properties: 0, totalViews: 0 };
      }
      locationStats[city].properties++;
      locationStats[city].totalViews += property.views || 0;
    });

    const locationAnalytics = Object.entries(locationStats).map(([location, stats]) => ({
      location,
      properties: stats.properties,
      averagePrice: agentProperties
        .filter(p => p.location.city === location)
        .reduce((sum, p) => sum + p.price, 0) / stats.properties,
      totalViews: stats.totalViews
    }));

    // Type analytics
    const typeStats = {};
    agentProperties.forEach(property => {
      const type = property.type;
      if (!typeStats[type]) {
        typeStats[type] = { count: 0, totalPrice: 0 };
      }
      typeStats[type].count++;
      typeStats[type].totalPrice += property.price;
    });

    const typeAnalytics = Object.entries(typeStats).map(([type, stats]) => ({
      type,
      count: stats.count,
      averagePrice: stats.totalPrice / stats.count
    }));

    // Inquiry trends (mock data for the last 30 days)
    const inquiryTrends = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const dayInquiries = await Inquiry.countDocuments({
        property: { $in: propertyIds },
        createdAt: { $gte: dayStart, $lt: dayEnd }
      });

      // Mock responses (assuming 80% response rate)
      const responses = Math.floor(dayInquiries * 0.8);

      inquiryTrends.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        inquiries: dayInquiries,
        responses
      });
    }

    const analytics = {
      overview: {
        totalProperties,
        activeProperties,
        totalViews,
        totalInquiries,
        averagePrice,
        conversionRate
      },
      monthlyData,
      propertyPerformance,
      locationAnalytics,
      typeAnalytics,
      inquiryTrends
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching agent analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

module.exports = router;