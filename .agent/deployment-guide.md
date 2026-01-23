# Database & Deployment Guide

## 1️⃣ Database Information

### **Current Database: MySQL**

Your project uses **MySQL** as the primary database:

- **ORM/Query Builder**: Direct MySQL queries using `mysql2` package
- **Connection**: MySQL connection pool (`server/mysql-db.ts`)
- **Tables**: 
  - `admins` - Admin user authentication
  - `programs` - Course/training programs (with image column)
  - `enquiries` - Student enquiries/applications

### **Alternative Database Setup**

You also have **PostgreSQL** setup available (currently not in use):
- Files: `server/db.ts` uses Drizzle ORM with PostgreSQL
- Package: `pg` (PostgreSQL client)
- This appears to be an alternative/backup setup

### **Active Database**: 
✅ **MySQL** (via `server/mysql-db.ts`)

---

## 2️⃣ Hosting Frontend & Backend on Separate Servers

### **YES, you can absolutely host them separately!** 

Here's how:

## Architecture Overview

```
┌─────────────────────┐         ┌─────────────────────┐
│   Frontend Server   │────────▶│   Backend Server    │
│   (React/Vite)      │  API    │   (Express.js)      │
│   Port: 80/443      │ Calls   │   Port: 5000        │
└─────────────────────┘         └─────────────────────┘
                                         │
                                         ▼
                                ┌─────────────────────┐
                                │   MySQL Database    │
                                │   Port: 3306        │
                                └─────────────────────┘
```

---

## 📋 Step-by-Step Separation Guide

### **STEP 1: Prepare Backend for Separate Hosting**

#### 1.1 Create Backend Environment File
Create `.env` on your backend server:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=innovativeminds

# Session Secret
SESSION_SECRET=your-super-secret-session-key-change-this

# CORS Configuration (Frontend URL)
FRONTEND_URL=https://your-frontend-domain.com
```

#### 1.2 Update CORS Settings
Create/update `server/cors.ts`:

```typescript
import cors from 'cors';

export const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

#### 1.3 Update `server/index.ts`
Add CORS middleware (after line 23):

```typescript
import cors from 'cors';
import { corsOptions } from './cors';

// Add this after express.urlencoded
app.use(cors(corsOptions));
```

#### 1.4 Install CORS package
```bash
npm install cors
npm install --save-dev @types/cors
```

#### 1.5 Backend Build & Deploy
```bash
# Build the backend
npm run build

# Start production server
npm start
```

---

### **STEP 2: Prepare Frontend for Separate Hosting**

#### 2.1 Create Frontend Environment File
Create `.env` in your project root:

```env
VITE_API_URL=https://your-backend-domain.com
```

#### 2.2 Update API Base URL
Create `client/src/config/api.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

#### 2.3 Update All API Calls
Update files that make API calls to use the base URL:

**Example for `client/src/hooks/use-programs.ts`:**

```typescript
import { API_BASE_URL } from '@/config/api';

async function fetchPrograms(): Promise<Program[]> {
    const response = await fetch(`${API_BASE_URL}/api/programs`);
    if (!response.ok) throw new Error("Failed to fetch programs");
    return response.json();
}
```

Apply this pattern to:
- `client/src/hooks/use-programs.ts`
- `client/src/hooks/use-enquiries.ts`
- `client/src/hooks/use-admin-auth.ts`
- Any other files making API calls

#### 2.4 Build Frontend
```bash
npm run build
```

This creates optimized static files in `dist/public/`

---

### **STEP 3: Deployment Options**

## Backend Deployment Options

### Option A: **VPS/Cloud Server** (DigitalOcean, AWS EC2, Linode)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt-get install mysql-server

# Clone your project
git clone your-repo-url
cd innovativeminds

# Install dependencies
npm install

# Setup environment
nano .env  # Add your configuration

# Install PM2 for process management
npm install -g pm2

# Start backend
pm2 start npm --name "innovativeminds-api" -- start
pm2 save
pm2 startup
```

### Option B: **Railway.app** (Easy deployment)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Option C: **Heroku**
```bash
# Install Heroku CLI
heroku create your-app-name
heroku addons:create cleardb:ignite  # MySQL addon
heroku config:set NODE_ENV=production
git push heroku main
```

---

## Frontend Deployment Options

### Option A: **Vercel** (Recommended for React)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add environment variable in Vercel dashboard:
- `VITE_API_URL` = your backend URL

### Option B: **Netlify**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist/public`
4. Add environment variable: `VITE_API_URL`

### Option C: **Static Hosting** (Nginx/Apache)
```bash
# Copy built files to web server
scp -r dist/public/* user@server:/var/www/html/

# Nginx configuration
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📝 Required Code Changes Summary

### Files to Create:
1. `server/cors.ts` - CORS configuration
2. `client/src/config/api.ts` - API base URL configuration
3. `.env` - Environment variables

### Files to Modify:
1. `server/index.ts` - Add CORS middleware
2. `client/src/hooks/use-programs.ts` - Use API_BASE_URL
3. `client/src/hooks/use-enquiries.ts` - Use API_BASE_URL
4. `client/src/hooks/use-admin-auth.ts` - Use API_BASE_URL
5. `package.json` - Add cors dependency

### Environment Variables Needed:

**Backend (.env):**
- PORT
- NODE_ENV
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- SESSION_SECRET
- FRONTEND_URL

**Frontend (.env):**
- VITE_API_URL

---

## 🎯 Quick Deployment Checklist

### Backend:
- [ ] Install CORS package
- [ ] Add CORS middleware
- [ ] Configure environment variables
- [ ] Setup MySQL database
- [ ] Run database migrations
- [ ] Build and deploy backend
- [ ] Test API endpoints

### Frontend:
- [ ] Create API config file
- [ ] Update all API calls to use base URL
- [ ] Configure environment variables
- [ ] Build production bundle
- [ ] Deploy to hosting service
- [ ] Test frontend-backend connection

---

## 🔒 Security Considerations

1. **Use HTTPS** for both frontend and backend in production
2. **Secure SESSION_SECRET** - Use a strong random string
3. **Database Security** - Don't expose MySQL port publicly
4. **Environment Variables** - Never commit `.env` files
5. **CORS** - Only allow your frontend domain
6. **Rate Limiting** - Add rate limiting to API endpoints

---

## 🚀 Recommended Setup

**Best Practice Architecture:**

```
Frontend: Vercel/Netlify (Free tier available)
Backend: Railway/Render (Free tier available)  
Database: Railway MySQL/PlanetScale (Free tier available)
```

This gives you:
- ✅ Automatic HTTPS
- ✅ Auto-scaling
- ✅ Easy deployments
- ✅ Free tiers for testing
- ✅ Built-in monitoring

---

Would you like me to help you implement any of these steps?
