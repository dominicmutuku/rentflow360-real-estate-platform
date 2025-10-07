// Password utility functions for Rentflow360
// Handles password hashing, validation, and security

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Hash password with salt
const hashPassword = async (password) => {
  try {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

// Compare password with hash
const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Error comparing password');
  }
};

// Generate random password
const generateRandomPassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each type
  password += charset.charAt(Math.floor(Math.random() * 26)); // lowercase
  password += charset.charAt(Math.floor(Math.random() * 26) + 26); // uppercase
  password += charset.charAt(Math.floor(Math.random() * 10) + 52); // number
  password += charset.charAt(Math.floor(Math.random() * 8) + 62); // special char
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Validate password strength
const validatePasswordStrength = (password) => {
  const minLength = 6;
  const maxLength = 128;
  
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (password.length > maxLength) {
    errors.push(`Password must not exceed ${maxLength} characters`);
  }
  
  if (!hasLowercase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!hasUppercase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  
  // Calculate strength score
  let score = 0;
  if (hasLowercase) score++;
  if (hasUppercase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChar) score++;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  let strength = 'weak';
  if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'medium';
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score
  };
};

// Generate secure token
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash token for database storage
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Check if password is commonly used (basic check)
const isCommonPassword = (password) => {
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', '123123',
    'password1', '1234567890', 'iloveyou', 'admin123'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
};

module.exports = {
  hashPassword,
  comparePassword,
  generateRandomPassword,
  validatePasswordStrength,
  generateSecureToken,
  hashToken,
  isCommonPassword
};