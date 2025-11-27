import React from 'react';
import { Link } from 'react-router-dom';
import './CarCard.css';

const CarCard = ({ car }) => {
  return (
    <div className="car-card">
      <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="car-image" />
      <div className="car-info">
        <h3>{car.brand} {car.model}</h3>
        <p className="car-year">{car.year}</p>
        <p className="car-category">{car.category.toUpperCase()}</p>
        <p className="car-price">${car.pricePerDay}/day</p>
        <div className="car-status">
          {car.isAvailable ? (
            <span className="status-available">Available</span>
          ) : (
            <span className="status-unavailable">Not Available</span>
          )}
        </div>
        <Link to={`/cars/${car._id}`} className="btn btn-primary">View Details</Link>
      </div>
    </div>
  );
};

export default CarCard;
