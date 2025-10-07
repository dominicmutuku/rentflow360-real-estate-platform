require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');

async function updateTrendingProperties() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const trendingTitles = [
      'Modern Luxury Apartment in Downtown',
      'Charming Family House in Karen', 
      'Penthouse with Rooftop in Westlands'
    ];
    
    const result = await Property.updateMany(
      { title: { $in: trendingTitles } },
      { $set: { trending: true } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} properties to trending`);
    
    const trendingCount = await Property.countDocuments({ trending: true });
    console.log(`📊 Total trending properties: ${trendingCount}`);
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateTrendingProperties();