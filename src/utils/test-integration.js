// Test integration between frontend and backend
import apiClient from '../services/api.js';

// Test the API connection
export const testAPIConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test health endpoint
    const healthResponse = await apiClient.healthCheck();
    console.log('Health check response:', healthResponse);
    
    if (healthResponse.success) {
      console.log('✅ API connection successful!');
      return true;
    } else {
      console.log('❌ API connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ API connection error:', error);
    return false;
  }
};

// Test authentication flow
export const testAuthFlow = async () => {
  try {
    console.log('Testing authentication flow...');
    
    // Test login
    const loginResponse = await apiClient.login({
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Login response:', loginResponse);
    
    if (loginResponse.success) {
      console.log('✅ Login successful!');
      
      // Test protected route with token
      const token = loginResponse.data.token;
      const userResponse = await apiClient.getUserProfile(token);
      
      console.log('User profile response:', userResponse);
      
      if (userResponse.success) {
        console.log('✅ Protected route access successful!');
        return true;
      } else {
        console.log('❌ Protected route access failed');
        return false;
      }
    } else {
      console.log('❌ Login failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Authentication test error:', error);
    return false;
  }
};

// Test password reset flow
export const testPasswordResetFlow = async () => {
  try {
    console.log('Testing password reset flow...');
    
    // Test forgot password
    const forgotResponse = await apiClient.forgotPassword('test@example.com');
    console.log('Forgot password response:', forgotResponse);
    
    if (forgotResponse.success) {
      console.log('✅ Password reset request successful!');
      return true;
    } else {
      console.log('❌ Password reset request failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Password reset test error:', error);
    return false;
  }
};

// Run all tests
export const runIntegrationTests = async () => {
  console.log('🚀 Starting Integration Tests...');
  console.log('=====================================');
  
  const apiTest = await testAPIConnection();
  console.log('=====================================');
  
  const authTest = await testAuthFlow();
  console.log('=====================================');
  
  const passwordTest = await testPasswordResetFlow();
  console.log('=====================================');
  
  console.log('📊 Test Results:');
  console.log(`API Connection: ${apiTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Authentication: ${authTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Password Reset: ${passwordTest ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = apiTest && authTest && passwordTest;
  console.log(`Overall: ${allPassed ? '🎉 ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  return allPassed;
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testIntegration = runIntegrationTests;
  window.testAPIConnection = testAPIConnection;
  window.testAuthFlow = testAuthFlow;
  window.testPasswordResetFlow = testPasswordResetFlow;
}
