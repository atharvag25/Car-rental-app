# Car Rental Website - MERN Stack

A full-stack car rental application built with MongoDB, Express.js, React, and Node.js.

## Features

### Backend
- JWT-based authentication with role-based access control (Customer/Admin)
- RESTful API endpoints for cars, bookings, and users
- MongoDB database with Mongoose ODM
- Password hashing with bcrypt
- Input validation with express-validator
- Double-booking prevention system
- Automatic price calculation

### Frontend
- Modern React application with React Router
- Context API for state management
- Protected routes for authenticated users
- Responsive design
- Car filtering by category, price, and availability
- Date-based booking system
- Customer booking management
- Admin dashboard for car and booking management

## Project Structure

```
car-rental/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Car.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cars.js
│   │   └── bookings.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Navbar.css
    │   │   ├── CarCard.js
    │   │   ├── CarCard.css
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Home.css
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Auth.css
    │   │   ├── CarDetails.js
    │   │   ├── CarDetails.css
    │   │   ├── MyBookings.js
    │   │   ├── MyBookings.css
    │   │   ├── AdminDashboard.js
    │   │   └── AdminDashboard.css
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/:id` - Get single car
- `POST /api/cars/:id/check-availability` - Check car availability
- `POST /api/cars` - Create car (Admin only)
- `PUT /api/cars/:id` - Update car (Admin only)
- `DELETE /api/cars/:id` - Delete car (Admin only)

### Bookings
- `POST /api/bookings` - Create booking (Customer only)
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/all` - Get all bookings (Admin only)
- `PATCH /api/bookings/:id/status` - Update booking status (Admin only)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (Customer)

## Database Schemas

### User
- name: String
- email: String (unique)
- password: String (hashed)
- role: String (customer/admin)

### Car
- brand: String
- model: String
- year: Number
- category: String (sedan/suv/sports/hatchback)
- pricePerDay: Number
- isAvailable: Boolean
- imageUrl: String
- description: String

### Booking
- userId: ObjectId (ref: User)
- carId: ObjectId (ref: Car)
- pickupDate: Date
- returnDate: Date
- totalDays: Number
- totalPrice: Number
- status: String (pending/confirmed/completed/cancelled)

## Default Admin Account

To create an admin account, register a user and manually update the role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Features in Detail

### Customer Features
- Browse available cars
- Filter cars by category, price range, and availability
- View detailed car information
- Book cars with date selection
- View booking history
- Cancel pending/confirmed bookings

### Admin Features
- Add, edit, and delete cars
- View all bookings
- Update booking status
- Manage car inventory

### Security Features
- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Input validation

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- cors
- dotenv

### Frontend
- React 18
- React Router v6
- Axios
- Context API
- CSS3

## License

MIT
