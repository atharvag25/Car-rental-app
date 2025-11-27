import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyBookings.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings/my-bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await axios.patch(`${API_URL}/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return classes[status] || '';
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="my-bookings">
      <div className="container">
        <h1>My Bookings</h1>
        {error && <div className="error">{error}</div>}
        
        {bookings.length === 0 ? (
          <p className="no-bookings">You haven't made any bookings yet.</p>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-car-info">
                  <img src={booking.carId?.imageUrl} alt={booking.carId?.brand} />
                  <div>
                    <h3>{booking.carId?.brand} {booking.carId?.model}</h3>
                    <p className="car-category">{booking.carId?.category}</p>
                  </div>
                </div>
                <div className="booking-details">
                  <div className="detail-row">
                    <span className="label">Pickup Date:</span>
                    <span>{new Date(booking.pickupDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Return Date:</span>
                    <span>{new Date(booking.returnDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Total Days:</span>
                    <span>{booking.totalDays}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Total Price:</span>
                    <span className="price">${booking.totalPrice}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span className={`status ${getStatusClass(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <button 
                    onClick={() => handleCancel(booking._id)} 
                    className="btn btn-danger"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
