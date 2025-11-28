import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'cars') fetchCars();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Dashboard data:', response.data);
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
        <button 
          className={activeTab === 'cars' ? 'active' : ''}
          onClick={() => setActiveTab('cars')}
        >
          Cars
        </button>
      </div>

      {activeTab === 'overview' && dashboardData && (
        <div className="overview-tab">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{dashboardData.stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Cars</h3>
              <p className="stat-number">{dashboardData.stats.totalCars}</p>
            </div>
            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p className="stat-number">{dashboardData.stats.totalBookings}</p>
            </div>
            <div className="stat-card">
              <h3>Active Bookings</h3>
              <p className="stat-number">{dashboardData.stats.activeBookings}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-number">${dashboardData.stats.totalRevenue}</p>
            </div>
          </div>

          <div className="recent-bookings">
            <h3>Recent Bookings</h3>
            <div className="bookings-list">
              {dashboardData.recentBookings.map(booking => (
                <div key={booking._id} className="booking-item">
                  <div>
                    <strong>{booking.userId.name}</strong> - {booking.carId.brand} {booking.carId.model}
                  </div>
                  <div className={`status ${booking.status}`}>
                    {booking.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>{user.name}</td>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>{user.email}</td>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-danger">Delete</button>
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
                {bookings && bookings.length > 0 ? bookings.map((booking, index) => {
                  console.log(`Booking ${index}:`, booking);
                  return (
                  <tr key={booking._id || index}>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>{booking.userId?.name || 'N/A'}</td>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>{booking.carId ? `${booking.carId.brand} ${booking.carId.model}` : 'N/A'}</td>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>
                      {booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>
                      {booking.returnDate ? new Date(booking.returnDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>{booking.totalDays || 'N/A'}</td>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>${booking.totalPrice || 0}</td>
                    <td className={`status ${booking.status}`}>
                      {booking.status}
                    </td>
                    <td>
                      <select 
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                        style={{color: '#000000', fontWeight: '600', fontSize: '12px'}}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="8" style={{textAlign: 'center', padding: '20px', color: '#000000', fontWeight: '600'}}>
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
          <h3>Car Management ({cars.length} cars)</h3>
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
                {cars && cars.length > 0 ? cars.map((car, index) => {
                  console.log(`Car ${index}:`, car);
                  return (
                  <tr key={car._id || index}>
                    <td>
                      <img 
                        src={car.imageUrl || car.image || 'https://via.placeholder.com/60x40?text=Car'} 
                        alt={`${car.brand || 'Car'} ${car.model || ''}`}
                        style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px'}}
                      />
                    </td>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>{car.brand || 'N/A'}</td>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>{car.model || 'N/A'}</td>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>{car.year || 'N/A'}</td>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>{car.category || 'N/A'}</td>
                    <td style={{color: '#000000', fontWeight: '700', fontSize: '14px'}}>${car.pricePerDay || 0}</td>
                    <td className={`availability ${car.isAvailable ? 'available' : 'unavailable'}`} style={{color: car.isAvailable ? '#28a745' : '#dc3545', fontWeight: '600'}}>
                      {car.isAvailable ? 'Available' : 'Unavailable'}
                    </td>
                    <td>
                      <button className="btn-edit">Edit</button>
                      <button className="btn-danger">Delete</button>
                    </td>
                  </tr>
                  );
                }) : (
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
  );
};

export default AdminDashboard;