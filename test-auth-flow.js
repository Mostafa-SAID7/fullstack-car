// Authentication Flow Test Script
// This script tests the end-to-end authentication flow

const testCredentials = {
  email: 'admin@fully2car.com',
  password: 'Admin123!',
  rememberMe: true
};

const API_BASE_URL = 'http://localhost:5100/api';

async function testBackendAuth() {
  console.log('🔍 Testing Backend Authentication...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCredentials)
    });

    console.log('📡 Response Status:', response.status);
    console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('📡 Response Data:', JSON.stringify(data, null, 2));

    if (response.ok && data.succeeded) {
      console.log('✅ Backend Authentication: SUCCESS');
      console.log('🔑 Token received:', data.data?.token ? 'Yes' : 'No');
      console.log('👤 User data received:', data.data?.user ? 'Yes' : 'No');
      return data.data;
    } else {
      console.log('❌ Backend Authentication: FAILED');
      console.log('💥 Error:', data.message || data.errors?.join(', ') || 'Unknown error');
      return null;
    }
  } catch (error) {
    console.log('❌ Backend Authentication: ERROR');
    console.log('💥 Network Error:', error.message);
    return null;
  }
}

async function testFrontendDashboard() {
  console.log('\n🔍 Testing Dashboard Frontend...');
  
  try {
    const response = await fetch('http://localhost:3018/login');
    console.log('📡 Dashboard Status:', response.status);
    
    if (response.ok) {
      console.log('✅ Dashboard Frontend: ACCESSIBLE');
    } else {
      console.log('❌ Dashboard Frontend: NOT ACCESSIBLE');
    }
  } catch (error) {
    console.log('❌ Dashboard Frontend: ERROR');
    console.log('💥 Error:', error.message);
  }
}

async function testFrontendMain() {
  console.log('\n🔍 Testing Main Frontend...');
  
  try {
    const response = await fetch('http://localhost:4200/login');
    console.log('📡 Main App Status:', response.status);
    
    if (response.ok) {
      console.log('✅ Main Frontend: ACCESSIBLE');
    } else {
      console.log('❌ Main Frontend: NOT ACCESSIBLE');
    }
  } catch (error) {
    console.log('❌ Main Frontend: ERROR');
    console.log('💥 Error:', error.message);
  }
}

async function testProtectedEndpoint(authData) {
  if (!authData?.token) {
    console.log('\n⏭️  Skipping protected endpoint test (no token)');
    return;
  }

  console.log('\n🔍 Testing Protected Endpoint...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/v7/media/videos/analytics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('📡 Protected Endpoint Status:', response.status);

    if (response.ok) {
      console.log('✅ Protected Endpoint: SUCCESS');
    } else if (response.status === 401) {
      console.log('❌ Protected Endpoint: UNAUTHORIZED (Token may be invalid)');
    } else {
      console.log('❌ Protected Endpoint: FAILED');
    }
  } catch (error) {
    console.log('❌ Protected Endpoint: ERROR');
    console.log('💥 Error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Authentication Flow Tests...\n');
  
  // Test backend authentication
  const authData = await testBackendAuth();
  
  // Test frontend accessibility
  await testFrontendDashboard();
  await testFrontendMain();
  
  // Test protected endpoint with token
  await testProtectedEndpoint(authData);
  
  console.log('\n🏁 Authentication Flow Tests Complete!');
  
  // Summary
  console.log('\n📋 Test Summary:');
  console.log('- Backend Auth API: Test completed');
  console.log('- Dashboard Frontend: Test completed');
  console.log('- Main Frontend: Test completed');
  console.log('- Protected Endpoint: Test completed');
  
  if (authData) {
    console.log('\n✅ Authentication flow appears to be working!');
    console.log('📝 Next steps:');
    console.log('  1. Open http://localhost:3018/login (Dashboard)');
    console.log('  2. Open http://localhost:4200/login (Main App)');
    console.log('  3. Login with: admin@fully2car.com / Admin123!');
  } else {
    console.log('\n❌ Authentication flow has issues that need to be resolved.');
  }
}

// Run the tests
runTests().catch(console.error);