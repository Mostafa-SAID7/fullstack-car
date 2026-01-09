// Test Dashboard Login Flow
const puppeteer = require('puppeteer');

async function testDashboardLogin() {
  console.log('🚀 Testing Dashboard Login Flow...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
    });
    
    // Navigate to dashboard (should redirect to login)
    console.log('📍 Navigating to dashboard...');
    await page.goto('http://localhost:3018/dashboard', { waitUntil: 'networkidle0' });
    
    // Check if we're on login page
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/login')) {
      console.log('✅ Correctly redirected to login page');
      
      // Fill in login form
      console.log('📝 Filling login form...');
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', 'admin@fully2car.com');
      await page.type('input[type="password"]', 'Admin123!');
      
      // Submit form
      console.log('🔐 Submitting login form...');
      await page.click('button[type="submit"]');
      
      // Wait for navigation or error
      await page.waitForTimeout(3000);
      
      const finalUrl = page.url();
      console.log(`📍 Final URL: ${finalUrl}`);
      
      if (finalUrl.includes('/dashboard')) {
        console.log('✅ Successfully redirected to dashboard!');
      } else if (finalUrl.includes('/login')) {
        console.log('❌ Still on login page - authentication failed');
        
        // Check for error messages
        const errorElement = await page.$('.text-destructive, .error, [class*="error"]');
        if (errorElement) {
          const errorText = await page.evaluate(el => el.textContent, errorElement);
          console.log(`❌ Error message: ${errorText}`);
        }
      } else {
        console.log(`❓ Unexpected URL: ${finalUrl}`);
      }
      
      // Check localStorage for auth data
      const authData = await page.evaluate(() => {
        return {
          token: localStorage.getItem('auth_token'),
          user: localStorage.getItem('auth_user')
        };
      });
      
      console.log('🔍 Auth data in localStorage:');
      console.log(`  Token: ${authData.token ? 'Present' : 'Missing'}`);
      console.log(`  User: ${authData.user ? 'Present' : 'Missing'}`);
      
    } else {
      console.log('❌ Not redirected to login page');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Keep browser open for manual inspection
    console.log('🔍 Browser left open for manual inspection. Close manually when done.');
    // await browser.close();
  }
}

// Check if puppeteer is available
try {
  testDashboardLogin();
} catch (error) {
  console.log('❌ Puppeteer not available. Please install with: npm install puppeteer');
  console.log('📝 Manual test steps:');
  console.log('1. Open http://localhost:3018/dashboard');
  console.log('2. Should redirect to http://localhost:3018/login');
  console.log('3. Login with: admin@fully2car.com / Admin123!');
  console.log('4. Should redirect to dashboard');
}