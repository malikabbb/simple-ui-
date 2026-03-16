import { useState, useEffect } from 'react';
import apiClient from '../services/api';

export default function TestIntegration() {
  const [testResults, setTestResults] = useState({
    apiConnection: null,
    authentication: null,
    passwordReset: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    // Test API Connection
    try {
      const healthResponse = await apiClient.healthCheck();
      results.apiConnection = healthResponse.success;
    } catch (error) {
      results.apiConnection = false;
    }

    // Test Authentication
    try {
      const loginResponse = await apiClient.login({
        email: 'test@example.com',
        password: 'password123'
      });
      results.authentication = loginResponse.success;
    } catch (error) {
      results.authentication = false;
    }

    // Test Password Reset
    try {
      const resetResponse = await apiClient.forgotPassword('test@example.com');
      results.passwordReset = resetResponse.success;
    } catch (error) {
      results.passwordReset = false;
    }

    setTestResults(results);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    if (status === null) return 'text-gray-500';
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status) => {
    if (status === null) return '⏳';
    return status ? '✅' : '❌';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Integration Test Results</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">API Connection Status</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Running integration tests...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getStatusIcon(testResults.apiConnection)}</span>
                  <span className="font-medium">API Connection</span>
                </div>
                <span className={`font-semibold ${getStatusColor(testResults.apiConnection)}`}>
                  {testResults.apiConnection === null ? 'Not Tested' : testResults.apiConnection ? 'Connected' : 'Failed'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getStatusIcon(testResults.authentication)}</span>
                  <span className="font-medium">Authentication</span>
                </div>
                <span className={`font-semibold ${getStatusColor(testResults.authentication)}`}>
                  {testResults.authentication === null ? 'Not Tested' : testResults.authentication ? 'Working' : 'Failed'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getStatusIcon(testResults.passwordReset)}</span>
                  <span className="font-medium">Password Reset</span>
                </div>
                <span className={`font-semibold ${getStatusColor(testResults.passwordReset)}`}>
                  {testResults.passwordReset === null ? 'Not Tested' : testResults.passwordReset ? 'Working' : 'Failed'}
                </span>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Test Summary</h3>
                <div className="space-y-2 text-sm">
                  <p>• Backend API: http://localhost:8000</p>
                  <p>• Frontend UI: http://localhost:5173</p>
                  <p>• Database: MySQL</p>
                  <p>• Email: Configured</p>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={runTests}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? 'Testing...' : 'Run Tests Again'}
                </button>
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Open App
                </a>
                <a
                  href="http://localhost:8000/api/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  API Health
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
