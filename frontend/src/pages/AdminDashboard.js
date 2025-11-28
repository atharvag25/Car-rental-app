import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('cars');
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('AdminDashboard rendered, loading:', loading, 'dashboardData:', dashboardData);
  console.log('Token in localStorage:', localStorage.getItem('token') ? 'Present' : 'Missing');
  console.log('User in localStorage:', localStorage.getItem('user'));
  
  // Force show debug info
  if (typeof window !== 'undefined') {
    window.adminDebug = {
      loading,
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user'),
      dashboardData
    };
  }

  useEffect(() => {
    fetchDashboardData();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'cars') fetchCars();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching dashboard data with token:', token ? 'Present' : 'Missing');
      console.log('API URL:', `${API_URL}/admin/dashboard`);
      
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Dashboard data:', response.data);
      
      // Ensure the response has the expected structure
      const data = response.data;
      if (!data.stats) {
        data.stats = {
          totalUsers: 0,
          totalCars: 0,
          totalBookings: 0,
          activeBookings: 0,
          totalRevenue: 0
        };
      }
      if (!data.recentBookings) {
        data.recentBookings = [];
      }
      
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setError(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/bookings/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Bookings data:', response.data);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await axios.get(`${API_URL}/cars`);
      console.log('Cars data:', response.data);
      console.log('First car object:', response.data[0]);
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/bookings/${bookingId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const deleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('token');
        console.log('Deleting user:', userId, 'with token:', token ? 'Present' : 'Missing');
        
        const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Delete user response:', response.data);
        
        // Refresh the users list
        await fetchUsers();
        
        // Also refresh dashboard data to update stats
        await fetchDashboardData();
        
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        alert('Error deleting user: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const deleteCar = async (carId, carName) => {
    if (window.confirm(`Are you sure you want to delete "${carName}"? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('token');
        console.log('Deleting car:', carId, 'with token:', token ? 'Present' : 'Missing');
        
        const response = await axios.delete(`${API_URL}/cars/${carId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Delete car response:', response.data);
        
        // Refresh the cars list
        await fetchCars();
        
        // Also refresh dashboard data to update stats
        await fetchDashboardData();
        
        alert('Car deleted successfully!');
      } catch (error) {
        console.error('Error deleting car:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        alert('Error deleting car: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) return (
    <div className="admin-dashboard">
      <div className="loading">Loading admin dashboard...</div>
    </div>
  );

  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">
          <p>You need to be logged in as an admin to access this page.</p>
          <p>Please <a href="/login">log in</a> with admin credentials.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      zIndex: 9999,
      overflow: 'auto'
    }}>

      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo">
            <span className="car-icon">🚗</span>
            <span className="logo-text">
              <span className="auto">AUTO</span>
              <span className="care">CARE</span>
            </span>
          </div>
        </div>
        <nav className="header-nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/admin" className="nav-link active">Admin Dashboard</a>
          <span className="admin-greeting">Hello, Admin</span>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}>Logout</button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="admin-content">
        <div className="admin-tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'cars' ? 'active' : ''}
            onClick={() => setActiveTab('cars')}
          >
            Car Management
          </button>
          <button 
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

      {activeTab === 'overview' && (
        <div className="overview-tab">
          {dashboardData && dashboardData.stats ? (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-number">{dashboardData.stats.totalUsers || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Cars</h3>
                  <p className="stat-number">{dashboardData.stats.totalCars || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Bookings</h3>
                  <p className="stat-number">{dashboardData.stats.totalBookings || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Bookings</h3>
                  <p className="stat-number">{dashboardData.stats.activeBookings || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Revenue</h3>
                  <p className="stat-number">${dashboardData.stats.totalRevenue || 0}</p>
                </div>
              </div>

              <div className="recent-bookings">
                <h3>Recent Bookings</h3>
                <div className="bookings-list">
                  {dashboardData.recentBookings && dashboardData.recentBookings.length > 0 ? (
                    dashboardData.recentBookings.map(booking => (
                      <div key={booking._id} className="booking-item">
                        <div>
                          <strong>{booking.userId?.name || 'Unknown User'}</strong> - {booking.carId?.brand || 'Unknown'} {booking.carId?.model || 'Car'}
                        </div>
                        <div className={`status ${booking.status}`}>
                          {booking.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="booking-item">
                      <div>No recent bookings found</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="error-message">
              <p>Unable to load dashboard data. {error && `Error: ${error}`}</p>
              <p>Please check your connection and try again.</p>
              <button onClick={fetchDashboardData} className="btn-primary">Retry</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-tab">
          <h3>User Management ({users.length} users)</h3>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn-danger"
                        onClick={() => deleteUser(user._id, user.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bookings-tab">
          <h3>Booking Management ({bookings.length} bookings)</h3>
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Car</th>
                  <th>Pickup Date</th>
                  <th>Return Date</th>
                  <th>Days</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings && bookings.length > 0 ? bookings.map((booking, index) => (
                  <tr key={booking._id || index}>
                    <td>{booking.userId?.name || 'N/A'}</td>
                    <td>{booking.carId ? `${booking.carId.brand} ${booking.carId.model}` : 'N/A'}</td>
                    <td>
                      {booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      {booking.returnDate ? new Date(booking.returnDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>{booking.totalDays || 'N/A'}</td>
                    <td>${booking.totalPrice || 0}</td>
                    <td className={`status ${booking.status}`}>
                      {booking.status}
                    </td>
                    <td>
                      <select 
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'cars' && (
        <div className="cars-tab">
          <div className="cars-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>Category</th>
                  <th>Price/Day</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars && cars.length > 0 ? cars.map((car, index) => (
                  <tr key={car._id || index}>
                    <td>
                      <img 
                        src={car.imageUrl || car.image || 'https://via.placeholder.com/80x60?text=Car'} 
                        alt={`${car.brand || 'Car'} ${car.model || ''}`}
                      />
                    </td>
                    <td>{car.brand || ''}</td>
                    <td>{car.model || ''}</td>
                    <td>{car.year || ''}</td>
                    <td>{car.category || ''}</td>
                    <td>${car.pricePerDay || 0}</td>
                    <td className={`availability ${car.isAvailable ? 'available' : 'unavailable'}`}>
                      {car.isAvailable ? 'Available' : 'Unavailable'}
                    </td>
                    <td>
                      <button className="btn-edit">Edit</button>
                      <button 
                        className="btn-danger"
                        onClick={() => deleteCar(car._id, `${car.brand} ${car.model}`)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                      No cars found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;