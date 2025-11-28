const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const { auth, adminAuth } = require('../middleware/auth');

// Admin dashboard stats
router.get('/dashboard', [auth, adminAuth], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ 
      status: { $in: ['pending', 'confirmed'] } 
    });
    
    // Revenue calculation
    const completedBookings = await Booking.find({ status: 'completed' });
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('carId', 'brand model')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalCars,
        totalBookings,
        activeBookings,
        totalRevenue
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (Admin only)
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user status (Admin only)
router.patch('/users/:id/status', [auth, adminAuth], async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;