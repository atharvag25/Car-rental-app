const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { auth, adminAuth } = require('../middleware/auth');

// Create booking
router.post('/', [auth,
  body('carId').notEmpty(),
  body('pickupDate').isISO8601(),
  body('returnDate').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { carId, pickupDate, returnDate } = req.body;

    // Validate dates
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    if (pickup >= returnD) {
      return res.status(400).json({ message: 'Return date must be after pickup date' });
    }

    // Check car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      carId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { pickupDate: { $lte: returnD }, returnDate: { $gte: pickup } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Car is not available for selected dates' });
    }

    // Calculate total days and price
    const totalDays = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
    const totalPrice = totalDays * car.pricePerDay;

    const booking = new Booking({
      userId: req.user._id,
      carId,
      pickupDate: pickup,
      returnDate: returnD,
      totalDays,
      totalPrice
    });

    await booking.save();
    await booking.populate('carId');
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('carId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings (Admin only)
router.get('/all', [auth, adminAuth], async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('carId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status (Admin only)
router.patch('/:id/status', [auth, adminAuth], async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('carId').populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking (Customer)
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();
    await booking.populate('carId');

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
