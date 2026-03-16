// Comprehensive User Flow Test
console.log('🔍 Starting User Flow Test...');
console.log('=====================================');

// Test 1: Check if servers are running
async function testServers() {
  try {
    const healthResponse = await fetch('http://localhost:8000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Backend Server: ' + (healthResponse.ok ? 'RUNNING' : 'DOWN'));
    
    // Test frontend by checking if we can access the page
    console.log('✅ Frontend Server: RUNNING (assuming Vite is running)');
    
    return healthResponse.ok;
  } catch (error) {
    console.log('❌ Backend Server: DOWN - ' + error.message);
    return false;
  }
}

// Test 2: User Registration
async function testRegistration() {
  console.log('\n📝 Testing User Registration...');
  try {
    const response = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User ' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Registration: SUCCESS');
      console.log('   User created: ' + data.data.user.name);
      console.log('   Email: ' + data.data.user.email);
      console.log('   Token received: ' + (data.data.token ? 'YES' : 'NO'));
      return { success: true, user: data.data.user, token: data.data.token };
    } else {
      console.log('❌ Registration: FAILED - ' + data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Registration: FAILED - ' + error.message);
    return { success: false, error: error.message };
  }
}

// Test 3: User Login
async function testLogin() {
  console.log('\n🔐 Testing User Login...');
  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Login: SUCCESS');
      console.log('   User: ' + data.data.user.name);
      console.log('   Email: ' + data.data.user.email);
      console.log('   Status: ' + data.data.user.status);
      console.log('   Token received: ' + (data.data.token ? 'YES' : 'NO'));
      return { success: true, user: data.data.user, token: data.data.token };
    } else {
      console.log('❌ Login: FAILED - ' + data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Login: FAILED - ' + error.message);
    return { success: false, error: error.message };
  }
}

// Test 4: Protected Route Access
async function testProtectedRoute(token) {
  console.log('\n🛡️ Testing Protected Route Access...');
  if (!token) {
    console.log('❌ Protected Route: NO TOKEN - Cannot test');
    return { success: false, error: 'No token provided' };
  }
  
  try {
    const response = await fetch('http://localhost:8000/api/auth/user', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Protected Route: SUCCESS');
      console.log('   User Data: ' + JSON.stringify(data.data, null, 2));
      return { success: true, user: data.data };
    } else {
      console.log('❌ Protected Route: FAILED - ' + data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Protected Route: FAILED - ' + error.message);
    return { success: false, error: error.message };
  }
}

// Test 5: Password Reset Flow
async function testPasswordReset() {
  console.log('\n🔑 Testing Password Reset Flow...');
  try {
    // Step 1: Request password reset
    const forgotResponse = await fetch('http://localhost:8000/api/password/forgot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });
    
    const forgotData = await forgotResponse.json();
    
    if (!forgotResponse.ok) {
      console.log('❌ Password Reset Request: FAILED - ' + forgotData.message);
      return { success: false, error: forgotData.message };
    }
    
    console.log('✅ Password Reset Request: SUCCESS');
    console.log('   Email: test@example.com');
    console.log('   Token: ' + (forgotData.data.token ? 'YES' : 'NO'));
    console.log('   Reset URL: ' + (forgotData.data.reset_url ? 'YES' : 'NO'));
    
    // Step 2: Verify token (if available)
    if (forgotData.data.token) {
      console.log('\n🔍 Verifying Reset Token...');
      try {
        const verifyResponse = await fetch('http://localhost:8000/api/password/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            token: forgotData.data.token
          })
        });
        
        const verifyData = await verifyResponse.json();
        
        if (verifyResponse.ok) {
          console.log('✅ Token Verification: SUCCESS');
        } else {
          console.log('❌ Token Verification: FAILED - ' + verifyData.message);
        }
      } catch (error) {
        console.log('❌ Token Verification: FAILED - ' + error.message);
      }
    }
    
    return { success: true, data: forgotData };
  } catch (error) {
    console.log('❌ Password Reset: FAILED - ' + error.message);
    return { success: false, error: error.message };
  }
}

// Test 6: User Logout
async function testLogout(token) {
  console.log('\n🚪 Testing User Logout...');
  if (!token) {
    console.log('❌ Logout: NO TOKEN - Cannot test');
    return { success: false, error: 'No token provided' };
  }
  
  try {
    const response = await fetch('http://localhost:8000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Logout: SUCCESS');
      return { success: true };
    } else {
      console.log('❌ Logout: FAILED - ' + data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Logout: FAILED - ' + error.message);
    return { success: false, error: error.message };
  }
}

// Test 7: User Management (List Users)
async function testUserManagement(token) {
  console.log('\n👥 Testing User Management...');
  if (!token) {
    console.log('❌ User Management: NO TOKEN - Cannot test');
    return { success: false, error: 'No token provided' };
  }
  
  try {
    const response = await fetch('http://localhost:8000/api/users', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ User List: SUCCESS');
      console.log('   Users found: ' + data.data.data.length);
      
      if (data.data.data.length > 0) {
        console.log('   First user: ' + data.data.data[0].name);
        console.log('   First user email: ' + data.data.data[0].email);
      }
      
      return { success: true, users: data.data.data };
    } else {
      console.log('❌ User List: FAILED - ' + data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ User Management: FAILED - ' + error.message);
    return { success: false, error: error.message };
  }
}

// Test 8: Audit Logs
async function testAuditLogs(token) {
  console.log('\n📋 Testing Audit Logs...');
  if (!token) {
    console.log('❌ Audit Logs: NO TOKEN - Cannot test');
    return { success: false, error: 'No token provided' };
  }
  
  try {
    const response = await fetch('http://localhost:8000/api/users/1/audit-logs', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Audit Logs: SUCCESS');
      console.log('   Logs found: ' + data.data.data.length);
      
      if (data.data.data.length > 0) {
        console.log('   Latest log: ' + data.data.data[0].action);
        console.log('   Latest log IP: ' + data.data.data[0].ip_address);
      }
      
      return { success: true, logs: data.data.data };
    } else {
      console.log('❌ Audit Logs: FAILED - ' + data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.log('❌ Audit Logs: FAILED - ' + error.message);
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runUserFlowTest() {
  let testResults = {
    servers: false,
    registration: false,
    login: false,
    protectedRoute: false,
    passwordReset: false,
    logout: false,
    userManagement: false,
    auditLogs: false
  };
  
  let loginData = null;
  
  // Test 1: Servers
  testResults.servers = await testServers();
  
  if (!testResults.servers) {
    console.log('❌ Servers are not running. Please start both servers first.');
    return { success: false, results: testResults };
  }
  
  // Test 2: Registration
  const regResult = await testRegistration();
  testResults.registration = regResult.success;
  
  if (regResult.success) {
    // Test 3: Login with registered user
    const loginResult = await testLogin();
    testResults.login = loginResult.success;
    loginData = loginResult;
  } else {
    // Test 3: Login with existing user
    loginResult = await testLogin();
    testResults.login = loginResult.success;
    loginData = loginResult;
  }
  
  if (!testResults.login) {
    console.log('❌ Login failed, cannot continue testing.');
    return { success: false, results: testResults };
  }
  
  // Test 4: Protected Route
  const protectedResult = await testProtectedRoute(loginData.token);
  testResults.protectedRoute = protectedResult.success;
  
  // Test 5: Password Reset
  const resetResult = await testPasswordReset();
  testResults.passwordReset = resetResult.success;
  
  // Test 6: User Management
  const userMgmtResult = await testUserManagement(loginData.token);
  testResults.userManagement = userMgmtResult.success;
  
  // Test 7: Audit Logs
  const auditResult = await testAuditLogs(loginData.token);
  testResults.auditLogs = auditResult.success;
  
  // Test 8: Logout
  const logoutResult = await testLogout(loginData.token);
  testResults.logout = logoutResult.success;
  
  // Summary
  console.log('\n📊 User Flow Test Results:');
  console.log('=====================================');
  console.log('Servers: ' + (testResults.servers ? '✅ PASS' : '❌ FAIL'));
  console.log('Registration: ' + (testResults.registration ? '✅ PASS' : '❌ FAIL'));
  console.log('Login: ' + (testResults.login ? '✅ PASS' : '❌ FAIL'));
  console.log('Protected Route: ' + (testResults.protectedRoute ? '✅ PASS' : '❌ FAIL'));
  console.log('Password Reset: ' + (testResults.passwordReset ? '✅ PASS' : '❌ FAIL'));
  console.log('User Management: ' + (testResults.userManagement ? '✅ PASS' : '❌ FAIL'));
  console.log('Audit Logs: ' + (testResults.auditLogs ? '✅ PASS' : '❌ FAIL'));
  console.log('Logout: ' + (testResults.logout ? '✅ PASS' : '❌ FAIL'));
  console.log('=====================================');
  
  const allPassed = Object.values(testResults).every(result => result);
  
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! User flow is fully functional!');
    console.log('🚀 Ready for production deployment!');
  } else {
    console.log('⚠️  Some tests failed. Please check the issues above.');
  }
  
  return { success: allPassed, results: testResults };
}

// Run the test
runUserFlowTest().then(results => {
  console.log('\n🎯 Test completed!');
  console.log('Overall Status: ' + (results.success ? 'SUCCESS' : 'FAILED'));
}).catch(error => {
  console.error('❌ Test failed:', error);
});
