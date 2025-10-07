// MongoDB Connection Test for Rentflow360
// Test different connection string formats

require('dotenv').config();
const mongoose = require('mongoose');

const testConnections = async () => {
  console.log('🧪 Testing MongoDB Atlas Connections\n');

  // Test current connection string
  const currentUri = process.env.MONGODB_URI;
  console.log('Current URI:', currentUri ? 'Configured' : 'Not found');
  
  if (currentUri) {
    console.log('URI preview:', currentUri.substring(0, 50) + '...');
  }

  // Test current environment URI first, then alternatives
  const alternatives = [
    // Current environment URI
    currentUri,
    
    // New cluster with database name
    'mongodb+srv://jobsal388_db_user:LX9kLfge4BGNOCG6@dominicrentflow360.nhh9kgx.mongodb.net/Rentflow360?retryWrites=true&w=majority&appName=DominicRentflow360',
    
    // New cluster without database name
    'mongodb+srv://jobsal388_db_user:LX9kLfge4BGNOCG6@dominicrentflow360.nhh9kgx.mongodb.net/?retryWrites=true&w=majority&appName=DominicRentflow360',
  ];

  for (let i = 0; i < alternatives.length; i++) {
    console.log(`\n🔄 Testing connection ${i + 1}...`);
    
    try {
      const options = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
      };

      await mongoose.connect(alternatives[i], options);
      console.log(`✅ Connection ${i + 1} successful!`);
      
      const db = mongoose.connection.db;
      console.log(`📍 Database: ${db.databaseName}`);
      console.log(`🌐 Host: ${mongoose.connection.host}`);
      
      // Test basic operation
      const collections = await db.listCollections().toArray();
      console.log(`📚 Collections found: ${collections.length}`);
      
      await mongoose.disconnect();
      console.log('✅ Test complete - Connection working!');
      break;
      
    } catch (error) {
      console.log(`❌ Connection ${i + 1} failed:`, error.message);
      
      try {
        await mongoose.disconnect();
      } catch (disconnectError) {
        // Ignore disconnect errors
      }
    }
  }
  
  console.log('\n🏁 Connection testing complete');
  process.exit(0);
};

testConnections();