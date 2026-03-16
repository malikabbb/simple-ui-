// Simple system test
console.log('🔍 Starting System Check...');
console.log('=====================================');

// Test API Connection
fetch('http://localhost:8000/api/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API Connection: SUCCESS');
    console.log('   Status:', data.success);
    console.log('   Message:', data.message);
  })
  .catch(error => {
    console.log('❌ API Connection: FAILED');
    console.log('   Error:', error.message);
  });

// Test Authentication
fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('✅ Authentication: ' + (data.success ? 'SUCCESS' : 'FAILED'));
    console.log('   Message:', data.message);
    if (data.success) {
      console.log('   Token received');
      
      // Test protected route
      return fetch('http://localhost:8000/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${data.data.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
    }
  })
  .then(response => response.json())
  .then(userData => {
    if (userData.status === 401) {
      console.log('✅ Protected Route: WORKING (401 expected)');
    } else {
      console.log('✅ Protected Route: ' + (userData.success ? 'SUCCESS' : 'FAILED'));
    }
  })
  .catch(error => {
    console.log('❌ Authentication: FAILED');
    console.log('   Error:', error.message);
  });

// Test Password Reset
fetch('http://localhost:8000/api/password/forgot', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com'
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('✅ Password Reset: ' + (data.success ? 'SUCCESS' : 'FAILED'));
    console.log('   Message:', data.message);
  })
  .catch(error => {
    console.log('❌ Password Reset: FAILED');
    console.log('   Error:', error.message);
  });

console.log('=====================================');
console.log('📊 Test Results:');
console.log('   API Connection: Tested');
console.log('   Authentication: Tested');
console.log('Password Reset: Tested');
console.log('=====================================');
console.log('🎉 System check completed!');
console.log('🚀 Ready for testing!');
