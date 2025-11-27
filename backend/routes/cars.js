const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const { auth, adminAuth } = require('../middleware/auth');

// Get all cars with filters
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, available } = req.query;
    let query = {};

    if (category) query.category = category;
    if (available === 'true') query.isAvailable = true;
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single car
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check car availability for dates
router.post('/:id/check-availability', async (req, res) => {
  try {
    const { pickupDate, returnDate } = req.body;
    const carId = req.params.id;

    const overlappingBookings = await Booking.find({
      carId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { pickupDate: { $lte: new Date(returnDate) }, returnDate: { $gte: new Date(pickupDate) } }
      ]
    });

    res.json({ available: overlappingBookings.length === 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create car (Admin only)
router.post('/', [auth, adminAuth,
  body('brand').trim().notEmpty(),
  body('model').trim().notEmpty(),
  body('year').isInt({ min: 1900 }),
  body('category').isIn(['sedan', 'suv', 'sports', 'hatchback']),
  body('pricePerDay').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update car (Admin only)
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete car (Admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
