import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarCard from '../components/CarCard';
import './Home.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    available: false
  });

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.available) params.available = 'true';

      const response = await axios.get(`${API_URL}/cars`, { params });
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      available: false
    });
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Find Your Perfect Ride</h1>
        <p>Choose from our wide selection of quality vehicles</p>
      </div>

      <div className="container">
        <div className="filters-section">
          <h2>Filter Cars</h2>
          <div className="filters">
            <div className="filter-group">
              <label>Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="sports">Sports</option>
                <option value="hatchback">Hatchback</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="$0"
              />
            </div>
            <div className="filter-group">
              <label>Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="$1000"
              />
            </div>
            <div className="filter-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="available"
                  checked={filters.available}
                  onChange={handleFilterChange}
                />
                Available Only
              </label>
            </div>
            <button onClick={resetFilters} className="btn btn-secondary">Reset Filters</button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading cars...</div>
        ) : (
          <>
            <h2 className="section-title">Available Cars ({cars.length})</h2>
            {cars.length === 0 ? (
              <p className="no-results">No cars found matching your criteria.</p>
            ) : (
              <div className="cars-grid">
                {cars.map(car => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
