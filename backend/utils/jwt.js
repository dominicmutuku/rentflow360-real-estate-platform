// JWT utility functions for Rentflow360
// Handles token generation, verification, and security

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT token for authentication
const generateToken = (userId, role = 'user', email = null) => {
  const payload = {
    id: userId,
    role: role
  };
  
  if (email) {
    payload.email = email;
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Generate refresh token
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Extract token from Authorization header
const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

// Create token cookie options
const getCookieOptions = () => {
  return {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'strict' // CSRF protection
  };
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  extractToken,
  getCookieOptions
};