const mongoose = require('mongoose');
const Car = require('./models/Car');
const User = require('./models/User');
const Booking = require('./models/Booking');
require('dotenv').config();

const sampleCars = [
  // Sedan Cars (4 cars)
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
    model: 'Accord',
    year: 2023,
    category: 'sedan',
    pricePerDay: 55,
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
    description: 'Premium midsize sedan with advanced features'
  },
  {
    brand: 'Nissan',
    model: 'Altima',
    year: 2022,
    category: 'sedan',
    pricePerDay: 48,
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400',
    description: 'Stylish and efficient sedan'
  },
  {
    brand: 'Hyundai',
    model: 'Sonata',
    year: 2023,
    category: 'sedan',
    pricePerDay: 52,
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400',
    description: 'Modern sedan with excellent fuel economy'
  },

  // SUV Cars (4 cars)
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
    brand: 'Toyota',
    model: 'RAV4',
    year: 2023,
    category: 'suv',
    pricePerDay: 68,
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
    description: 'Versatile compact SUV with AWD'
  },
  {
    brand: 'Ford',
    model: 'Explorer',
    year: 2022,
    category: 'suv',
    pricePerDay: 75,
    imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400',
    description: 'Full-size SUV with 7-seat capacity'
  },
  {
    brand: 'Jeep',
    model: 'Grand Cherokee',
    year: 2023,
    category: 'suv',
    pricePerDay: 78,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400',
    description: 'Rugged SUV with off-road capabilities'
  },

  // Sports Cars (4 cars)
  {
    brand: 'BMW',
    model: 'M3',
    year: 2023,
    category: 'sports',
    pricePerDay: 120,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    description: 'High-performance sports car'
  },
  {
    brand: 'Audi',
    model: 'RS5',
    year: 2023,
    category: 'sports',
    pricePerDay: 135,
    imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400',
    description: 'Luxury sports coupe with quattro AWD'
  },
  {
    brand: 'Mercedes',
    model: 'AMG C63',
    year: 2022,
    category: 'sports',
    pricePerDay: 140,
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400',
    description: 'High-performance luxury sports car'
  },
  {
    brand: 'Porsche',
    model: '911',
    year: 2023,
    category: 'sports',
    pricePerDay: 180,
    imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400',
    description: 'Iconic sports car with exceptional handling'
  },

  // Hatchback Cars (4 cars)
  {
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2023,
    category: 'hatchback',
    pricePerDay: 42,
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400',
    description: 'Compact and efficient hatchback'
  },
  {
    brand: 'Honda',
    model: 'Civic Hatchback',
    year: 2022,
    category: 'hatchback',
    pricePerDay: 45,
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400',
    description: 'Sporty and practical hatchback'
  },
  {
    brand: 'Mazda',
    model: 'Mazda3',
    year: 2023,
    category: 'hatchback',
    pricePerDay: 47,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    description: 'Premium compact hatchback with style'
  },
  {
    brand: 'Hyundai',
    model: 'Elantra GT',
    year: 2022,
    category: 'hatchback',
    pricePerDay: 44,
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
    description: 'Versatile hatchback with great value'
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