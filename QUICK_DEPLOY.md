# Quick Deployment Guide - 15 Minutes

## 🚀 Fast Track Deployment

### Step 1: MongoDB Atlas (5 min)
1. Go to https://mongodb.com/cloud/atlas/register
2. Sign up → Create FREE cluster
3. Database Access → Add User (username: `carrental`, save password!)
4. Network Access → Allow Access from Anywhere (0.0.0.0/0)
5. Connect → Get connection string → Save it!

### Step 2: Push to GitHub (2 min)
```bash
cd "E:\Web project"
git init
git add .
git commit -m "Car rental app"
```

Create repo at https://github.com/new then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/car-rental-mern.git
git push -u origin main
```

### Step 3: Deploy Backend - Render (5 min)
1. Go to https://render.com → Sign up with GitHub
2. New + → Web Service → Connect your repo
3. Settings:
   - Name: `car-rental-api`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Free tier
4. Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://carrental:PASSWORD@cluster0.xxxxx.mongodb.net/car-rental
   JWT_SECRET=my-super-secret-jwt-key-12345
   NODE_ENV=production
   ```
5. Create → Copy URL (e.g., `https://car-rental-api.onrender.com`)

### Step 4: Deploy Frontend - Vercel (3 min)
1. Go to https://vercel.com → Sign up with GitHub
2. New Project → Import your repo
3. Settings:
   - Root Directory: `frontend`
   - Framework: Create React App
4. Environment Variable:
   ```
   REACT_APP_API_URL=https://car-rental-api.onrender.com/api
   ```
5. Deploy → Copy URL

### Step 5: Create Admin (1 min)
1. Visit your site → Register account
2. Go to MongoDB Atlas → Browse Collections → `users`
3. Find your user → Edit → Change `role` to `"admin"` → Update
4. Login again → Access Admin Dashboard

## ✅ Done! Your site is live!

**Frontend**: https://your-project.vercel.app
**Backend**: https://car-rental-api.onrender.com

---

## Alternative: All-in-One Vercel Deployment

If you want to deploy both frontend and backend on Vercel:

1. Update `vercel.json` in root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

2. Deploy to Vercel from root directory
3. Add environment variables in Vercel dashboard

---

## 🔥 Pro Tips

1. **Keep Backend Alive**: Use https://uptimerobot.com to ping every 5 min
2. **Custom Domain**: Add in Vercel/Render settings (free)
3. **SSL**: Automatic with Vercel/Render
4. **Logs**: Check Render dashboard for backend errors

## 💰 Cost: $0/month (100% FREE)
