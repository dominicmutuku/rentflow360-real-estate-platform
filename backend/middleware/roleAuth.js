// Role-based authentication middleware for Rentflow360
// Provides convenient role checking functions

// Main role authentication function - returns middleware
const roleAuth = (roles = []) => {
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

// Middleware for agent-only access
const agentOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
      code: 'AUTH_REQUIRED'
    });
  }
  
  if (req.user.role !== 'agent' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Agent privileges required.',
      code: 'AGENT_ACCESS_REQUIRED'
    });
  }
  
  next();
};

// Middleware for admin-only access
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

// Middleware for user-only access (excludes guests)
const userOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
      code: 'AUTH_REQUIRED'
    });
  }
  
  next();
};

// Middleware to check if user owns the resource or has admin/agent privileges
const ownerOrPrivileged = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }
    
    // Admin and agents have full access
    if (req.user.role === 'admin' || req.user.role === 'agent') {
      return next();
    }
    
    // Check if user owns the resource
    const resource = req.body || req.params;
    if (resource[resourceField] && resource[resourceField].toString() === req.user._id.toString()) {
      return next();
    }
    
    // For cases where the resource is the user themselves
    if (req.params.id && req.params.id.toString() === req.user._id.toString()) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.',
      code: 'OWNERSHIP_REQUIRED'
    });
  };
};

// Export the main roleAuth function as default
module.exports = roleAuth;

// Also export individual functions for convenience
module.exports.agentOnly = agentOnly;
module.exports.adminOnly = adminOnly;
module.exports.userOnly = userOnly;
module.exports.ownerOrPrivileged = ownerOrPrivileged;