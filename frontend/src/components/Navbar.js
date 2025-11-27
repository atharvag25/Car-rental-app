import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🚗 Car Rental
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <li className="nav-item">
                  <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                </li>
              )}
              {isAdmin && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link">Admin Dashboard</Link>
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
                <Link to="/login" className="btn btn-primary">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-success">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
