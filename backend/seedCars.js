require('dotenv').config();
const mongoose = require('mongoose');
const Car = require('./models/Car');

const cars = [
  // Sedans
  {
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    category: 'sedan',
    description: 'Comfortable and reliable sedan perfect for business trips and family outings.',
    pricePerDay: 45,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    isAvailable: true
  },
  {
    brand: 'Honda',
    model: 'Accord',
    year: 2023,
    category: 'sedan',
    description: 'Spacious sedan with excellent fuel efficiency and modern features.',
    pricePerDay: 50,
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
    isAvailable: true
  },
  {
    brand: 'BMW',
    model: '3 Series',
    year: 2024,
    category: 'sedan',
    description: 'Luxury sedan with premium interior and powerful performance.',
    pricePerDay: 85,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    isAvailable: true
  },
  {
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2024,
    category: 'sedan',
    description: 'Elegant sedan combining luxury, comfort, and cutting-edge technology.',
    pricePerDay: 95,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    isAvailable: true
  },

  // SUVs
  {
    brand: 'Toyota',
    model: 'RAV4',
    year: 2023,
    category: 'suv',
    description: 'Versatile SUV perfect for adventures and family trips.',
    pricePerDay: 65,
    imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    isAvailable: true
  },
  {
    brand: 'Honda',
    model: 'CR-V',
    year: 2023,
    category: 'suv',
    description: 'Spacious and comfortable SUV with advanced safety features.',
    pricePerDay: 70,
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    isAvailable: true
  },
  {
    brand: 'Jeep',
    model: 'Grand Cherokee',
    year: 2024,
    category: 'suv',
    description: 'Rugged SUV built for both city driving and off-road adventures.',
    pricePerDay: 80,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    isAvailable: true
  },
  {
    brand: 'Land Rover',
    model: 'Range Rover Sport',
    year: 2024,
    category: 'suv',
    description: 'Luxury SUV with exceptional performance and premium amenities.',
    pricePerDay: 150,
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    isAvailable: true
  },

  // Sports Cars
  {
    brand: 'Porsche',
    model: '911',
    year: 2024,
    category: 'sports',
    description: 'Iconic sports car delivering thrilling performance and style.',
    pricePerDay: 200,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    isAvailable: true
  },
  {
    brand: 'Chevrolet',
    model: 'Corvette',
    year: 2024,
    category: 'sports',
    description: 'American muscle car with breathtaking speed and design.',
    pricePerDay: 180,
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    isAvailable: true
  },
  {
    brand: 'BMW',
    model: 'M4',
    year: 2024,
    category: 'sports',
    description: 'High-performance sports coupe with precision handling.',
    pricePerDay: 175,
    imageUrl: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
    isAvailable: true
  },
  {
    brand: 'Audi',
    model: 'R8',
    year: 2024,
    category: 'sports',
    description: 'Supercar with stunning looks and incredible performance.',
    pricePerDay: 250,
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800',
    isAvailable: true
  },

  // Hatchbacks
  {
    brand: 'Honda',
    model: 'Civic Hatchback',
    year: 2023,
    category: 'hatchback',
    description: 'Sporty and practical hatchback perfect for city driving.',
    pricePerDay: 40,
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
    isAvailable: true
  },
  {
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2023,
    category: 'hatchback',
    description: 'Versatile hatchback with European styling and efficiency.',
    pricePerDay: 42,
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    isAvailable: true
  },
  {
    brand: 'Mazda',
    model: 'Mazda3 Hatchback',
    year: 2023,
    category: 'hatchback',
    description: 'Stylish hatchback with premium interior and fun driving dynamics.',
    pricePerDay: 45,
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    isAvailable: true
  },
  {
    brand: 'Ford',
    model: 'Focus',
    year: 2023,
    category: 'hatchback',
    description: 'Reliable and fuel-efficient hatchback for everyday use.',
    pricePerDay: 38,
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    isAvailable: true
  }
];

const seedCars = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');

    // Clear existing cars
    await Car.deleteMany({});
    console.log('Cleared existing cars');

    // Insert new cars
    const insertedCars = await Car.insertMany(cars);
    console.log(`\n✅ Successfully added ${insertedCars.length} cars to the database\n`);

    // Display summary
    const categories = ['sedan', 'suv', 'sports', 'hatchback'];
    console.log('Cars by category:');
    for (const category of categories) {
      const count = insertedCars.filter(car => car.category === category).length;
      console.log(`  - ${category.toUpperCase()}: ${count} cars`);
    }

    console.log('\n🎉 Database seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedCars();
