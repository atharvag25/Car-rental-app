import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <svg viewBox="0 0 850 400" className="logo-svg">
            <path d="M180 220 Q 350 180, 520 220 L 520 280 Q 350 320, 180 280 Z" fill="#E31E24"/>
            <path d="M200 240 Q 350 210, 500 240 L 500 270 Q 350 300, 200 270 Z" fill="#2A2A2A"/>
            <ellipse cx="250" cy="290" rx="35" ry="35" fill="#E5E5E5" stroke="#333" strokeWidth="8"/>
            <ellipse cx="450" cy="290" rx="35" ry="35" fill="#E5E5E5" stroke="#333" strokeWidth="8"/>
            <ellipse cx="250" cy="290" rx="20" ry="20" fill="#1A1A1A"/>
            <ellipse cx="450" cy="290" rx="20" ry="20" fill="#1A1A1A"/>
          </svg>
          <span className="logo-text">
            <span className="logo-auto">AUTO</span>
            <span className="logo-care">CARE</span>
          </span>
        </Link>
        
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <li className="nav-item">
                  <Link to="/my-bookings" className="nav-link" onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>
                </li>
              )}
              {isAdmin && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
                </li>
              )}
              <li className="nav-item">
                <span className="nav-user">Hello, {user?.name}</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
