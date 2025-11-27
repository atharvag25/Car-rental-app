import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [carForm, setCarForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'sedan',
    pricePerDay: '',
    imageUrl: '',
    description: '',
    isAvailable: true
  });

  useEffect(() => {
    if (activeTab === 'cars') {
      fetchCars();
    } else {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/cars`);
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/bookings/all`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCarFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCarForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCar) {
        await axios.put(`${API_URL}/cars/${editingCar._id}`, carForm);
      } else {
        await axios.post(`${API_URL}/cars`, carForm);
      }
      setShowCarForm(false);
      setEditingCar(null);
      resetCarForm();
      fetchCars();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save car');
    }
  };

  const resetCarForm = () => {
    setCarForm({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      category: 'sedan',
      pricePerDay: '',
      imageUrl: '',
      description: '',
      isAvailable: true
    });
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setCarForm(car);
    setShowCarForm(true);
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    
    try {
      await axios.delete(`${API_URL}/cars/${carId}`);
      fetchCars();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete car');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`${API_URL}/bookings/${bookingId}/status`, { status });
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update booking');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        
        <div className="tabs">
          <button 
            className={activeTab === 'cars' ? 'active' : ''} 
            onClick={() => setActiveTab('cars')}
          >
            Manage Cars
          </button>
          <button 
            className={activeTab === 'bookings' ? 'active' : ''} 
            onClick={() => setActiveTab('bookings')}
          >
            Manage Bookings
          </button>
        </div>

        {activeTab === 'cars' && (
          <div className="cars-section">
            <div className="section-header">
              <h2>Car Inventory</h2>
              <button 
                className="btn btn-success" 
                onClick={() => {
                  setShowCarForm(true);
                  setEditingCar(null);
                  resetCarForm();
                }}
              >
                Add New Car
              </button>
            </div>

            {showCarForm && (
              <div className="car-form-modal">
                <div className="modal-content">
                  <h3>{editingCar ? 'Edit Car' : 'Add New Car'}</h3>
                  <form onSubmit={handleCarSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Brand</label>
                        <input
                          type="text"
                          name="brand"
                          value={carForm.brand}
                          onChange={handleCarFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Model</label>
                        <input
                          type="text"
                          name="model"
                          value={carForm.model}
                          onChange={handleCarFormChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Year</label>
                        <input
                          type="number"
                          name="year"
                          value={carForm.year}
                          onChange={handleCarFormChange}
                          min="1900"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          name="category"
                          value={carForm.category}
                          onChange={handleCarFormChange}
                          required
                        >
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV</option>
                          <option value="sports">Sports</option>
                          <option value="hatchback">Hatchback</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Price Per Day ($)</label>
                      <input
                        type="number"
                        name="pricePerDay"
                        value={carForm.pricePerDay}
                        onChange={handleCarFormChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="url"
                        name="imageUrl"
                        value={carForm.imageUrl}
                        onChange={handleCarFormChange}
                        placeholder="https://example.com/car-image.jpg"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={carForm.description}
                        onChange={handleCarFormChange}
                        rows="4"
                      />
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          name="isAvailable"
                          checked={carForm.isAvailable}
                          onChange={handleCarFormChange}
                        />
                        Available for Rent
                      </label>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-success">
                        {editingCar ? 'Update Car' : 'Add Car'}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => {
                          setShowCarForm(false);
                          setEditingCar(null);
                          resetCarForm();
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading ? (
              <div className="loading">Loading cars...</div>
            ) : (
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
                    {cars.map(car => (
                      <tr key={car._id}>
                        <td>
                          <img src={car.imageUrl} alt={car.brand} className="table-car-img" />
                        </td>
                        <td>{car.brand}</td>
                        <td>{car.model}</td>
                        <td>{car.year}</td>
                        <td>{car.category}</td>
                        <td>${car.pricePerDay}</td>
                        <td>
                          <span className={car.isAvailable ? 'status-available' : 'status-unavailable'}>
                            {car.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-small btn-primary" 
                            onClick={() => handleEditCar(car)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-small btn-danger" 
                            onClick={() => handleDeleteCar(car._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <h2>All Bookings</h2>
            {loading ? (
              <div className="loading">Loading bookings...</div>
            ) : (
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
                    {bookings.map(booking => (
                      <tr key={booking._id}>
                        <td>{booking.userId?.name}</td>
                        <td>{booking.carId?.brand} {booking.carId?.model}</td>
                        <td>{new Date(booking.pickupDate).toLocaleDateString()}</td>
                        <td>{new Date(booking.returnDate).toLocaleDateString()}</td>
                        <td>{booking.totalDays}</td>
                        <td>${booking.totalPrice}</td>
                        <td>
                          <span className={`status status-${booking.status}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={booking.status}
                            onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
