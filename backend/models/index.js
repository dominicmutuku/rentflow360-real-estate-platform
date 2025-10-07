// Main models index file for Rentflow360
// Exports all database models for easy importing

const User = require('./User');
const Property = require('./Property');
const Report = require('./Report');
const Inquiry = require('./Inquiry');

module.exports = {
  User,
  Property,
  Report,
  Inquiry
};