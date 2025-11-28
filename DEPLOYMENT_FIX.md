# Deployment Fix Guide

## Issue
Registration failing with "Request failed with status code 404"

## Root Cause
Vercel doesn't automatically read `.env.production` files. Environment variables must be set in the Vercel dashboard.

## Solution Steps

### 1. Set Environment Variable in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your `car-rental-app` project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://car-rental-api-coah.onrender.com/api`
   - **Environments:** Check all three (Production, Preview, Development)
5. Click **Save**

### 2. Redeploy Backend on Render

1. Go to https://dashboard.render.com
2. Select your `car-rental-api` service
3. Click **Manual Deploy** → **Deploy latest commit**
4. Wait for deployment to complete (check logs for "Server running on port 5000")

### 3. Redeploy Frontend on Vercel

After adding the environment variable:
1. Go to your Vercel project
2. Go to **Deployments** tab
3. Click the three dots (...) on the latest deployment
4. Click **Redeploy**
5. Make sure "Use existing Build Cache" is **unchecked**
6. Click **Redeploy**

### 4. Verify Backend is Running

Test the backend health endpoint:
```bash
curl https://car-rental-api-coah.onrender.com/api/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

### 5. Test Registration

1. Go to your deployed frontend URL
2. Navigate to Register page
3. Fill in the form
4. Open browser console (F12) to see detailed logs
5. Try to register

## Alternative: Push Changes to Trigger Auto-Deploy

```bash
git add .
git commit -m "Add Vercel config and fix CORS"
git push
```

Both Render and Vercel will auto-deploy when they detect the push.

## Troubleshooting

### If still getting 404:
- Check Render logs to ensure backend is running
- Verify the backend URL is correct: `https://car-rental-api-coah.onrender.com`
- Test the health endpoint first

### If getting CORS errors:
- Check Render environment variables include `FRONTEND_URL`
- Verify backend logs show the correct CORS configuration

### If getting "Registration failed" without details:
- Open browser console (F12 → Console tab)
- Look for the detailed error logs we added
- Share the console output for further debugging
