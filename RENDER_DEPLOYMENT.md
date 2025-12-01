# Render.com Deployment Guide

## Quick Fix for "Cannot find module" Error

If you're seeing this error:
```
Error: Cannot find module '/opt/render/project/src/dist/server.js'
```

**The issue:** Render's Root Directory is set to `src/` instead of the project root.

**The fix:**
1. Go to your Render dashboard
2. Select your web service
3. Go to **Settings** → **Build & Deploy**
4. Find **Root Directory** field
5. Set it to `.` (dot) or leave it **empty**
6. Save and redeploy

## Step-by-Step Deployment

### 1. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Select the repository and branch

### 2. Configure Service Settings

**Basic Settings:**
- **Name**: `uza-empower-api` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `.` (IMPORTANT: Must be project root, not `src/`)

**Build & Deploy:**
- **Build Command**: `npm install && npm run prisma:generate && npm run build`
- **Start Command**: `node dist/server.js`

### 3. Set Environment Variables

Add these environment variables in Render dashboard:

**Required:**
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your-strong-secret-key-here
JWT_REFRESH_SECRET=your-strong-refresh-secret-key-here
NODE_ENV=production
PORT=10000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

**Optional (for messaging services):**
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
SENDGRID_API_KEY=your_sendgrid_api_key
```

### 4. MongoDB Atlas Configuration

1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Add IP Address: `0.0.0.0/0` (allows from anywhere) OR add Render's specific IPs
4. Ensure your database user has proper permissions

### 5. Deploy

1. Click **Save Changes** in Render
2. Render will automatically start the build
3. Monitor the build logs to ensure:
   - Dependencies install successfully
   - Prisma client generates
   - TypeScript compiles to `dist/` folder
   - Server starts without errors

## Verification

After deployment, verify:
- ✅ Health check: `https://your-service.onrender.com/health`
- ✅ API docs: `https://your-service.onrender.com/api-docs`
- ✅ Check logs for any errors

## Common Issues

### Issue: Build fails with "Cannot find module"
**Solution**: Check Root Directory is set to `.` not `src/`

### Issue: Prisma client not found
**Solution**: Ensure build command includes `npm run prisma:generate`

### Issue: Database connection fails
**Solution**: 
- Verify DATABASE_URL is correct
- Check MongoDB Atlas IP whitelist
- Verify database user credentials

### Issue: Port already in use
**Solution**: Render sets PORT automatically, don't override it

## Using render.yaml (Alternative)

If you prefer using `render.yaml`:
1. The file is already in the repository
2. Render will auto-detect it
3. Still verify Root Directory in dashboard is set correctly

## Support

For more help:
- [Render Documentation](https://render.com/docs)
- [Render Troubleshooting](https://render.com/docs/troubleshooting-deploys)

