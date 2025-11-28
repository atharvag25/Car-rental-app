import React from 'react';
import { Link } from 'react-router-dom';
import './CarCard.css';

const CarCard = ({ car }) => {
  return (
    <div className="car-card">
      <div className="car-image-container">
        <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="car-image" />
        <div className="car-category-badge">{car.category}</div>
      </div>
      <div className="car-details">
        <div className="car-brand">{car.brand}</div>
        <h3 className="car-name">{car.model} {car.year}</h3>
        <p className="car-description">{car.description || 'Premium vehicle with excellent features and comfort.'}</p>
        <div className="car-info">
          <div className="car-price">
            ${car.pricePerDay}<span>/day</span>
          </div>
          <div className={`car-availability ${car.isAvailable ? 'available' : 'unavailable'}`}>
            <span className="availability-dot"></span>
            {car.isAvailable ? 'Available' : 'Booked'}
          </div>
        </div>
      </div>
      <div className="car-actions">
        <Link to={`/cars/${car._id}`} className="btn btn-primary">
          View Details & Book
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
