# Admin Authentication Setup

## Overview
Your car rental application now has complete admin authentication functionality with role-based access control.

## Features Implemented

### Backend Features
- **Admin Role System**: Users can have 'customer' or 'admin' roles
- **Admin Middleware**: `adminAuth` middleware protects admin-only routes
- **Admin Routes**: Dedicated admin API endpoints at `/api/admin`
- **Admin Dashboard API**: Statistics and management endpoints
- **User Management**: Admin can view, manage, and delete users
- **Booking Management**: Admin can view all bookings and update statuses

### Frontend Features
- **Admin Dashboard**: Complete admin interface with tabs for:
  - Overview with statistics and recent bookings
  - User management
  - Booking management with status updates
  - Car management view
- **Role-based Navigation**: Admin users see "Admin Dashboard" instead of "My Bookings"
- **Protected Routes**: Admin dashboard is only accessible to admin users

## How to Create an Admin User

### Method 1: Using the Script (Recommended)
```bash
cd backend
npm run create-admin
```

This creates an admin user with:
- **Email**: admin@carrental.com
- **Password**: admin123
- **Role**: admin

### Method 2: Manual Registration
You can register a user normally and then manually update their role in the database:

```javascript
// In MongoDB or using a database tool
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

## Admin Dashboard Access

1. **Login** as an admin user
2. **Navigate** to `/admin` or click "Admin Dashboard" in the navbar
3. **Manage** users, bookings, and view statistics

## API Endpoints

### Admin Routes (`/api/admin`)
- `GET /dashboard` - Get dashboard statistics and recent bookings
- `GET /users` - Get all customer users
- `PATCH /users/:id/status` - Update user active status
- `DELETE /users/:id` - Delete a user

### Protected Car Routes (Admin Only)
- `POST /api/cars` - Create new car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

### Protected Booking Routes (Admin Only)
- `GET /api/bookings/all` - Get all bookings
- `PATCH /api/bookings/:id/status` - Update booking status

## Security Features

1. **JWT Authentication**: All admin routes require valid JWT token
2. **Role Verification**: Admin middleware checks user role
3. **Route Protection**: Frontend routes are protected with role-based access
4. **Password Hashing**: All passwords are hashed with bcrypt

## Default Admin Credentials

**⚠️ IMPORTANT**: Change the default admin password after first login!

- **Email**: admin@carrental.com
- **Password**: admin123

## Admin Capabilities

### User Management
- View all registered customers
- Delete user accounts
- Monitor user registration dates

### Booking Management
- View all bookings across all users
- Update booking statuses (pending → confirmed → completed)
- Cancel bookings if needed
- Monitor booking revenue

### Car Management
- View all cars in the system
- Add new cars to the fleet
- Update car information
- Remove cars from the system
- Monitor car availability

### Dashboard Analytics
- Total users count
- Total cars in fleet
- Total bookings made
- Active bookings count
- Total revenue generated
- Recent booking activity

## File Structure

```
backend/
├── routes/admin.js          # Admin-specific routes
├── middleware/auth.js       # Authentication & admin middleware
├── createAdmin.js          # Admin user creation script
└── models/User.js          # User model with role field

frontend/
├── src/pages/AdminDashboard.js    # Main admin dashboard
├── src/pages/AdminDashboard.css   # Dashboard styling
├── src/components/ProtectedRoute.js # Route protection
└── src/context/AuthContext.js     # Auth context with admin detection
```

## Usage Examples

### Creating Additional Admin Users
```javascript
// Register with role specified
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin2@example.com", 
  "password": "securepassword",
  "role": "admin"
}
```

### Checking Admin Status
```javascript
// In frontend components
const { isAdmin } = useAuth();
if (isAdmin) {
  // Show admin features
}
```

## Troubleshooting

### Admin Dashboard Not Loading
1. Ensure you're logged in as an admin user
2. Check browser console for API errors
3. Verify backend admin routes are working: `GET /api/admin/dashboard`

### Cannot Access Admin Routes
1. Verify JWT token is valid
2. Check user role in database
3. Ensure admin middleware is properly applied

### Admin Creation Script Fails
1. Check MongoDB connection
2. Verify environment variables are set
3. Ensure database is running

Your admin authentication system is now fully functional and ready for production use!