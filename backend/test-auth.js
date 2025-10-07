// Test file for Rentflow360 Authentication API
// Run with: node backend/test-auth.js

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test user data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'TestPass123',
  phone: '+254712345678',
  role: 'user',
  termsAccepted: true,
  marketingConsent: false
};

// Function to test API endpoints
async function testAuth() {
  console.log('🧪 Testing Rentflow360 Authentication API\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.message);
    console.log('');

    // Test 2: Auth test endpoint
    console.log('2. Testing auth endpoint...');
    const authTestResponse = await axios.get(`${BASE_URL}/auth/test`);
    console.log('✅ Auth test:', authTestResponse.data.message);
    console.log('');

    // Test 3: User registration
    console.log('3. Testing user registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ Registration successful');
      console.log('User ID:', registerResponse.data.data.user._id);
      console.log('User Role:', registerResponse.data.data.user.role);
      console.log('Token received:', !!registerResponse.data.data.token);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.code === 'USER_EXISTS') {
        console.log('⚠️ User already exists, continuing with login test...');
      } else {
        throw error;
      }
    }
    console.log('');

    // Test 4: User login
    console.log('4. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful');
    console.log('User:', loginResponse.data.data.user.fullName);
    console.log('Role:', loginResponse.data.data.user.role);
    
    const token = loginResponse.data.data.token;
    console.log('Token received:', !!token);
    console.log('');

    // Test 5: Get profile (protected route)
    console.log('5. Testing protected route (get profile)...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Profile retrieved successfully');
    console.log('User:', profileResponse.data.data.user.fullName);
    console.log('Email verified:', profileResponse.data.data.user.emailVerified);
    console.log('');

    // Test 6: Update profile
    console.log('6. Testing profile update...');
    const updateResponse = await axios.put(`${BASE_URL}/auth/profile`, {
      bio: 'This is a test bio for John Doe',
      'profile.bio': 'Updated bio through API test'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Profile updated successfully');
    console.log('');

    // Test 7: Test unauthorized access
    console.log('7. Testing unauthorized access...');
    try {
      await axios.get(`${BASE_URL}/auth/profile`);
      console.log('❌ Should have failed - unauthorized access allowed');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Unauthorized access properly blocked');
      } else {
        throw error;
      }
    }
    console.log('');

    // Test 8: Logout
    console.log('8. Testing logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/auth/logout`);
    console.log('✅ Logout successful:', logoutResponse.data.message);
    console.log('');

    console.log('🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
    }
  }
}

// Check if axios is available
try {
  require.resolve('axios');
} catch (e) {
  console.log('Installing axios for testing...');
  require('child_process').execSync('npm install axios', { stdio: 'inherit' });
}

// Run tests
testAuth();