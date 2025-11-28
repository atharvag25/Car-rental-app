const mongoose = require('mongoose');
const Car = require('./models/Car');
const User = require('./models/User');
const Booking = require('./models/Booking');
require('dotenv').config();

const sampleCars = [
  {
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    category: 'sedan',
    pricePerDay: 50,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    description: 'Reliable and comfortable sedan'
  },
  {
    brand: 'Honda',
    model: 'CR-V',
    year: 2022,
    category: 'suv',
    pricePerDay: 65,
    imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
    description: 'Spacious SUV perfect for families'
  },
  {
    brand: 'BMW',
    model: 'M3',
    year: 2023,
    category: 'sports',
    pricePerDay: 120,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    description: 'High-performance sports car'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Car.deleteMany({});
    console.log('Cleared existing cars');

    // Insert sample cars
    const cars = await Car.insertMany(sampleCars);
    console.log(`Inserted ${cars.length} cars`);

    // Create a test customer if doesn't exist
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Test Customer',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      });
      await testUser.save();
      console.log('Created test customer');
    }

    // Create sample bookings
    const sampleBookings = [
      {
        userId: testUser._id,
        carId: cars[0]._id,
        pickupDate: new Date('2024-01-15'),
        returnDate: new Date('2024-01-20'),
        totalDays: 5,
        totalPrice: 250,
        status: 'confirmed'
      },
      {
        userId: testUser._id,
        carId: cars[1]._id,
        pickupDate: new Date('2024-02-01'),
        returnDate: new Date('2024-02-05'),
        totalDays: 4,
        totalPrice: 260,
        status: 'pending'
      }
    ];

    await Booking.deleteMany({});
    const bookings = await Booking.insertMany(sampleBookings);
    console.log(`Inserted ${bookings.length} bookings`);

    console.log('Sample data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();