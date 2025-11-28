import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testAPI = async (endpoint, requiresAuth = false) => {
    try {
      setLoading(true);
      const headers = {};
      if (requiresAuth) {
        const token = localStorage.getItem('token');
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get(`${API_URL}${endpoint}`, { headers });
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          success: true,
          data: response.data,
          count: Array.isArray(response.data) ? response.data.length : 'N/A'
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [endpoint]: {
          success: false,
          error: error.message,
          status: error.response?.status
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    await testAPI('/cars');
    await testAPI('/bookings/all', true);
    await testAPI('/admin/dashboard', true);
    await testAPI('/admin/users', true);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Admin API Test</h2>
      <button onClick={runAllTests} disabled={loading}>
        {loading ? 'Testing...' : 'Run All Tests'}
      </button>
      
      <div style={{ marginTop: '20px' }}>
        {Object.entries(testResults).map(([endpoint, result]) => (
          <div key={endpoint} style={{ 
            marginBottom: '20px', 
            padding: '15px', 
            border: '1px solid #ddd', 
            borderRadius: '5px',
            backgroundColor: result.success ? '#d4edda' : '#f8d7da'
          }}>
            <h4>{endpoint}</h4>
            {result.success ? (
              <div>
                <p>✅ Success - Count: {result.count}</p>
                <details>
                  <summary>View Data</summary>
                  <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <div>
                <p>❌ Error: {result.error}</p>
                <p>Status: {result.status}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTest;