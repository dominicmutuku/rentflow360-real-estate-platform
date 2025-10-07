// Authentication middleware for Rentflow360
// Handles JWT verification, role-based access control, and security

const { verifyToken, extractToken } = require('../utils/jwt');
const User = require('../models/User');

// Middleware to authenticate users via JWT token
const authenticate = async (req, res, next) => {
  try {
    // Get token from header or cookies
    let token = extractToken(req.headers.authorization);
    
    if (!token && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }
    
    // Update user activity
    await user.updateActivity(req.ip, req.get('User-Agent'));
    
    // Attach user to request object
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
      code: 'INVALID_TOKEN'
    });
  }
};

// Middleware for optional authentication (user might or might not be logged in)
const optionalAuth = async (req, res, next) => {
  try {
    let token = extractToken(req.headers.authorization);
    
    if (!token && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    
    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
        await user.updateActivity(req.ip, req.get('User-Agent'));
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Middleware to check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}, your role: ${req.user.role}`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    next();
  };
};

// Middleware to check if user owns the resource or has admin privileges
const authorizeOwnerOrAdmin = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }
    
    const resourceId = req.params.id || req.params[resourceField] || req.body[resourceField];
    
    // Allow if user is admin or owns the resource
    if (req.user.role === 'admin' || req.user._id.toString() === resourceId) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.',
      code: 'RESOURCE_ACCESS_DENIED'
    });
  };
};

// Middleware for rate limiting login attempts
const loginRateLimit = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return next();
    }
    
    const user = await User.findOne({ email }).select('+security.loginAttempts +security.lockUntil');
    
    if (user && user.isLocked) {
      const lockTimeRemaining = Math.ceil((user.security.lockUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked due to too many failed login attempts. Try again in ${lockTimeRemaining} minutes.`,
        code: 'ACCOUNT_LOCKED',
        lockTimeRemaining
      });
    }
    
    next();
  } catch (error) {
    console.error('Rate limit check error:', error);
    next();
  }
};

// Middleware to validate API key for certain endpoints
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required.',
      code: 'API_KEY_REQUIRED'
    });
  }
  
  // In production, validate against stored API keys
  if (process.env.NODE_ENV === 'production' && apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key.',
      code: 'INVALID_API_KEY'
    });
  }
  
  next();
};

// Middleware specifically for admin-only access
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
      code: 'AUTH_REQUIRED'
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
      code: 'ADMIN_ACCESS_REQUIRED'
    });
  }
  
  next();
};

// Alias for authenticate for backward compatibility
const protect = authenticate;

module.exports = {
  authenticate,
  protect,
  optionalAuth,
  authorize,
  authorizeOwnerOrAdmin,
  adminOnly,
  loginRateLimit,
  validateApiKey
};