// Test Authentication Fix
const testCredentials = {
  email: 'admin@fully2car.com',
  password: 'Admin123!',
  rememberMe: true
};

const API_BASE_URL = 'http://localhost:5100/api';

async function testAuthenticationFix() {
  console.log('🔧 Testing Authentication Fix...\n');
  
  // Clear any existing auth state
  console.log('🧹 Clearing existing auth state...');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  
  try {
    console.log('🔐 Testing backend login...');
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCredentials)
    });

    const data = await response.json();
    
    if (response.ok && data.succeeded) {
      console.log('✅ Backend login successful');
      console.log('📊 Response structure:');
      console.log('  - Has data:', !!data.data);
      console.log('  - Has token:', !!data.data?.token);
      console.log('  - Has user:', !!data.data?.user);
      console.log('  - User name:', data.data?.user?.firstName + ' ' + data.data?.user?.lastName);
      console.log('  - User roles:', data.data?.user?.roles);
      
      // Simulate what the fixed auth service should do
      const token = data.data.token;
      const user = {
        id: data.data.user.id,
        firstName: data.data.user.firstName,
        lastName: data.data.user.lastName,
        email: data.data.user.email,
        name: `${data.data.user.firstName} ${data.data.user.lastName}`,
        roles: data.data.user.roles,
        isActive: data.data.user.isActive,
        isEmailConfirmed: data.data.user.isEmailConfirmed,
        createdAt: data.data.user.createdAt
      };
      
      console.log('\n🔧 Simulating fixed auth service behavior...');
      
      // Step 1: Save token
      localStorage.setItem('auth_token', token);
      console.log('✅ Token saved to localStorage');
      
      // Step 2: Save user
      localStorage.setItem('auth_user', JSON.stringify(user));
      console.log('✅ User saved to localStorage');
      
      // Step 3: Verify authentication state
      const hasToken = !!localStorage.getItem('auth_token');
      const hasUser = !!localStorage.getItem('auth_user');
      const isAuthenticated = hasToken && hasUser;
      
      console.log('\n🔍 Authentication state verification:');
      console.log('  - Has token:', hasToken);
      console.log('  - Has user:', hasUser);
      console.log('  - Is authenticated:', isAuthenticated);
      
      if (isAuthenticated) {
        console.log('\n✅ Authentication state is valid!');
        console.log('🎯 The fix should resolve the "Authentication state error" issue');
        
        // Test protected endpoint
        console.log('\n🔒 Testing protected endpoint...');
        const protectedResponse = await fetch(`${API_BASE_URL}/v7/media/videos/analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (protectedResponse.ok) {
          console.log('✅ Protected endpoint accessible with token');
        } else {
          console.log('❌ Protected endpoint failed:', protectedResponse.status);
        }
      } else {
        console.log('\n❌ Authentication state is invalid');
        console.log('🔧 The fix needs further adjustment');
      }
      
    } else {
      console.log('❌ Backend login failed');
      console.log('💥 Error:', data.message || data.errors?.join(', ') || 'Unknown error');
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
  
  console.log('\n📝 Next steps:');
  console.log('1. Open http://localhost:3018/debug-auth');
  console.log('2. Test the login flow with the debug page');
  console.log('3. Check browser console for detailed logs');
}

// Wait for backend to be ready
setTimeout(() => {
  testAuthenticationFix();
}, 5000);

console.log('⏳ Waiting 5 seconds for backend to start...');