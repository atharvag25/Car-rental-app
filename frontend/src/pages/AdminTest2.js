import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminTest2 = () => {
  const { user, isAuthenticated, isAdmin, token } = useAuth();

  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#000000',
      padding: '20px',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{color: '#000000', fontSize: '32px'}}>Authentication Test</h1>
      
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        margin: '20px 0',
        border: '2px solid #000000'
      }}>
        <h2 style={{color: '#000000'}}>Auth Status:</h2>
        <p style={{color: '#000000'}}><strong>Is Authenticated:</strong> {isAuthenticated ? 'YES' : 'NO'}</p>
        <p style={{color: '#000000'}}><strong>Is Admin:</strong> {isAdmin ? 'YES' : 'NO'}</p>
        <p style={{color: '#000000'}}><strong>Has Token:</strong> {token ? 'YES' : 'NO'}</p>
        <p style={{color: '#000000'}}><strong>User Data:</strong></p>
        <pre style={{color: '#000000', backgroundColor: '#ffffff', padding: '10px', border: '1px solid #ccc'}}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div style={{
        backgroundColor: '#e0e0e0',
        padding: '20px',
        margin: '20px 0',
        border: '2px solid #000000'
      }}>
        <h2 style={{color: '#000000'}}>Local Storage:</h2>
        <p style={{color: '#000000'}}><strong>Token:</strong> {localStorage.getItem('token') || 'Not found'}</p>
        <p style={{color: '#000000'}}><strong>User:</strong> {localStorage.getItem('user') || 'Not found'}</p>
      </div>
    </div>
  );
};

export default AdminTest2;