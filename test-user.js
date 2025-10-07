require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./backend/models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const user = await User.findOne({ email: 'sarah.johnson@rentflow360.com' });
  console.log('User found:', user ? 'YES' : 'NO');
  if (user) {
    console.log('Role:', user.role);
    console.log('Active:', user.isActive);
  }
  process.exit();
});
