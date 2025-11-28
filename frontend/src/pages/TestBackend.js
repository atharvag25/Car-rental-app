import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TestBackend = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testHealth = async () => {
    setLoading(true);
    setResult('Testing backend health...');
    
    try {
      const response = await axios.get(`${API_URL}/health`, {
        timeout: 60000 // 60 seconds for cold start
      });
      setResult(`✅ Backend is running!\n${JSON.stringify(response.data, null, 2)}`);
    } catch (err) {
      setResult(`❌ Backend test failed:\n${err.message}\n\nAPI URL: ${API_URL}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Backend Connection Test</h2>
      <p>API URL: <code>{API_URL}</code></p>
      <button 
        onClick={testHealth} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Backend Connection'}
      </button>
      <pre style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f5f5f5',
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word'
      }}>
        {result || 'Click the button to test backend connection'}
      </pre>
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Note:</strong> If this is the first request after inactivity, it may take 30-60 seconds for the backend to wake up (Render free tier limitation).</p>
      </div>
    </div>
  );
};

export default TestBackend;
