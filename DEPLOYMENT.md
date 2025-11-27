# Car Rental Website - Deployment Guide

## Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Render account (free) OR Vercel account (free)
- Vercel/Netlify account for frontend (free)

---

## Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a free cluster (M0 Sandbox - FREE)

### 1.2 Configure Database
1. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `carrental`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

2. **Whitelist IP Address**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

3. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `car-rental`
   - Example: `mongodb+srv://carrental:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/car-rental?retryWrites=true&w=majority`

---

## Step 2: Push Code to GitHub

### 2.1 Initialize Git Repository
```bash
cd "E:\Web project"
git init
git add .
git commit -m "Initial commit - Car Rental MERN App"
```

### 2.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `car-rental-mern`
3. Make it Public or Private
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/car-rental-mern.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

### 3.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

### 3.2 Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `car-rental-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable":
   - `MONGODB_URI`: (paste your MongoDB Atlas connection string)
   - `JWT_SECRET`: (generate random string, e.g., `your-super-secret-jwt-key-12345`)
   - `NODE_ENV`: `production`
   - `PORT`: `5000`

5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. Copy your backend URL (e.g., `https://car-rental-api.onrender.com`)

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Update Frontend Environment
1. Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://car-rental-api.onrender.com/api
```
(Replace with your actual Render backend URL)

2. Commit changes:
```bash
git add .
git commit -m "Add production environment"
git push
```

### 4.2 Deploy to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

6. **Add Environment Variable**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://car-rental-api.onrender.com/api` (your backend URL)

7. Click "Deploy"
8. Wait for deployment (2-5 minutes)
9. Your site will be live at: `https://your-project.vercel.app`

---

## Alternative: Deploy Frontend to Netlify

### 4.1 Deploy to Netlify
1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

6. **Add Environment Variable**:
   - Go to "Site settings" → "Environment variables"
   - Add: `REACT_APP_API_URL` = `https://car-rental-api.onrender.com/api`

7. Click "Deploy site"
8. Your site will be live at: `https://your-project.netlify.app`

---

## Step 5: Create Admin Account on Production

### Option 1: Using MongoDB Atlas
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Find `car-rental` database → `users` collection
4. Click "Insert Document"
5. Add:
```json
{
  "name": "Admin User",
  "email": "admin@carrental.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "admin",
  "createdAt": {"$date": "2024-01-01T00:00:00.000Z"},
  "updatedAt": {"$date": "2024-01-01T00:00:00.000Z"}
}
```

### Option 2: Register then Update
1. Go to your deployed site
2. Register a new account
3. Go to MongoDB Atlas → Browse Collections
4. Find your user in `users` collection
5. Edit the document
6. Change `"role": "customer"` to `"role": "admin"`
7. Save

---

## Step 6: Test Your Deployment

1. Visit your frontend URL
2. Register a customer account
3. Login as admin (after creating admin user)
4. Add cars through Admin Dashboard
5. Test booking flow as customer

---

## Troubleshooting

### Backend Issues
- **Check Render Logs**: Dashboard → Logs
- **Verify Environment Variables**: Settings → Environment
- **MongoDB Connection**: Check connection string format

### Frontend Issues
- **Check Build Logs**: Vercel/Netlify deployment logs
- **Verify API URL**: Check environment variable
- **CORS Errors**: Backend already has CORS enabled

### Common Issues
1. **"Failed to fetch"**: Backend URL is wrong or backend is down
2. **"Network Error"**: Check if backend is deployed and running
3. **"Unauthorized"**: JWT_SECRET mismatch or token expired

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Render
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## Monitoring & Maintenance

### Free Tier Limitations
- **Render Free**: Spins down after 15 min of inactivity (cold starts)
- **MongoDB Atlas Free**: 512 MB storage
- **Vercel Free**: 100 GB bandwidth/month

### Keep Backend Alive
Use a service like UptimeRobot to ping your backend every 5 minutes:
1. Go to https://uptimerobot.com
2. Add monitor with your backend URL
3. Set interval to 5 minutes

---

## Cost Summary
- MongoDB Atlas: **FREE** (512 MB)
- Render Backend: **FREE** (with cold starts)
- Vercel/Netlify Frontend: **FREE**
- **Total: $0/month**

---

## Next Steps After Deployment

1. ✅ Test all features on production
2. ✅ Create admin account
3. ✅ Add sample cars
4. ✅ Test booking flow
5. ✅ Share your live URL!

Your car rental website is now live! 🚀
