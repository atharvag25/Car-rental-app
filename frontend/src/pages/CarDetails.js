import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CarDetails.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    pickupDate: '',
    returnDate: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchCar();
  }, [id]);

  useEffect(() => {
    calculatePrice();
  }, [bookingData, car]);

  const fetchCar = async () => {
    try {
      const response = await axios.get(`${API_URL}/cars/${id}`);
      setCar(response.data);
    } catch (error) {
      console.error('Error fetching car:', error);
      setError('Failed to load car details');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (bookingData.pickupDate && bookingData.returnDate && car) {
      const pickup = new Date(bookingData.pickupDate);
      const returnDate = new Date(bookingData.returnDate);
      const days = Math.ceil((returnDate - pickup) / (1000 * 60 * 60 * 24));
      if (days > 0) {
        setTotalPrice(days * car.pricePerDay);
      } else {
        setTotalPrice(0);
      }
    }
  };

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAdmin) {
      setError('Admins cannot book cars');
      return;
    }

    const pickup = new Date(bookingData.pickupDate);
    const returnDate = new Date(bookingData.returnDate);
    
    if (pickup >= returnDate) {
      setError('Return date must be after pickup date');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/bookings`, {
        carId: id,
        ...bookingData
      });
      setSuccess('Booking created successfully!');
      setBookingData({ pickupDate: '', returnDate: '' });
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!car) return <div className="error">Car not found</div>;

  return (
    <div className="car-details-container">
      <div className="container">
        <div className="car-details">
          <div className="car-image-section">
            <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} />
          </div>
          <div className="car-info-section">
            <h1>{car.brand} {car.model}</h1>
            <div className="car-meta">
              <span className="badge">{car.category.toUpperCase()}</span>
              <span className="year">{car.year}</span>
              {car.isAvailable ? (
                <span className="status-badge available">Available</span>
              ) : (
                <span className="status-badge unavailable">Not Available</span>
              )}
            </div>
            <p className="car-description">{car.description || 'No description available.'}</p>
            <div className="price-section">
              <h2>${car.pricePerDay}</h2>
              <span>per day</span>
            </div>

            {!isAdmin && car.isAvailable && (
              <div className="booking-form">
                <h3>Book This Car</h3>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <form onSubmit={handleBooking}>
                  <div className="form-group">
                    <label>Pickup Date</label>
                    <input
                      type="date"
                      name="pickupDate"
                      value={bookingData.pickupDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Return Date</label>
                    <input
                      type="date"
                      name="returnDate"
                      value={bookingData.returnDate}
                      onChange={handleChange}
                      min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  {totalPrice > 0 && (
                    <div className="total-price">
                      <strong>Total Price: ${totalPrice}</strong>
                    </div>
                  )}
                  <button type="submit" className="btn btn-success" disabled={bookingLoading}>
                    {bookingLoading ? 'Booking...' : 'Book Now'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
