# 🚀 Critical Updates Installation Guide

## ⚠️ IMPORTANT: Security Updates Applied

This project has been updated with **critical security fixes** and **quality improvements**. All admin passwords are now securely hashed, JWT authentication is implemented, and the system includes comprehensive input validation and rate limiting.

---

## 📋 What Was Fixed

### ✅ Critical Security Issues Resolved

1. ✅ **Admin password hashing** - Now uses bcrypt (previously plain text)
2. ✅ **JWT Authentication** - Token-based auth for all protected routes
3. ✅ **Input validation** - Comprehensive validation on all endpoints
4. ✅ **Rate limiting** - Protection against brute force attacks
5. ✅ **XSS Protection** - Data sanitization implemented
6. ✅ **NoSQL Injection Protection** - MongoDB query sanitization
7. ✅ **Security headers** - Helmet.js integrated
8. ✅ **Error handling** - Centralized error management
9. ✅ **CORS configuration** - Properly configured for security

### ✨ New Features Added

1. ✨ JWT token generation and verification
2. ✨ Role-based access control (RBAC)
3. ✨ Enhanced error responses with proper status codes
4. ✨ Health check endpoint
5. ✨ Request/Response interceptors in frontend
6. ✨ Auto token refresh on expiry
7. ✨ Improved API response structure

---

## 📦 Installation Steps

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

**New packages installed:**

- `jsonwebtoken` - JWT authentication
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `express-validator` - Input validation
- `express-mongo-sanitize` - NoSQL injection protection
- `xss-clean` - XSS protection

### Step 2: Update Environment Variables

The `.env` file has been updated in `backend/.env`. **Verify it contains:**

```env
MONGO_URL=mongodb://127.0.0.1:27017/smsproject
PORT=5000
NODE_ENV=development

# JWT Configuration - IMPORTANT!
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-this
JWT_EXPIRE=7d

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANT:** Change the `JWT_SECRET` to a strong, unique value for production!

### Step 3: Install Frontend Dependencies (if needed)

```bash
cd frontend
npm install
```

The frontend `.env` has also been updated at `frontend/.env`:

```env
REACT_APP_BASE_URL=http://localhost:5000
REACT_APP_NAME=School Management System
REACT_APP_VERSION=1.0.0
```

---

## 🔄 Migration Guide - IMPORTANT!

### ⚠️ Existing Data Migration Required

**If you have existing admin users in your database:**

All existing admin accounts with plain-text passwords will NO LONGER WORK with the new system. You have two options:

#### Option A: Re-register All Admins (Recommended)

1. Delete existing admin records from MongoDB
2. Re-register admins through the registration endpoint
3. New passwords will be properly hashed

#### Option B: Manual Password Hash Update (Advanced)

Run this script to hash existing passwords:

```javascript
// migration-script.js
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Admin = require("./models/adminSchema");

async function migratePasswords() {
  await mongoose.connect("your-mongodb-url");

  const admins = await Admin.find({});

  for (let admin of admins) {
    // Only hash if password appears to be plain text (adjust logic as needed)
    if (!admin.password.startsWith("$2b$")) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(admin.password, salt);
      await admin.save();
      console.log(`Updated password for ${admin.email}`);
    }
  }

  console.log("Migration complete!");
  process.exit(0);
}

migratePasswords();
```

**For students and teachers:** Their passwords were already hashed, so no migration needed.

---

## 🚀 Starting the Application

### Start Backend

```bash
cd backend
npm run dev
```

You should see:

```
✅ Connected to MongoDB
🚀 Server started on port 5000
📝 Environment: development
🔒 Security: Enabled (Helmet, Rate Limiting, XSS Protection)
🌐 CORS: http://localhost:3000
```

### Start Frontend

```bash
cd frontend
npm start
```

---

## 🧪 Testing the Updates

### Test 1: Health Check

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2026-01-02T...",
  "uptime": 10.5,
  "environment": "development"
}
```

### Test 2: Admin Registration

```bash
curl -X POST http://localhost:5000/AdminReg \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "admin@school.com",
    "password": "Admin123",
    "schoolName": "Test School"
  }'
```

Expected response:

```json
{
  "success": true,
  "message": "Admin registered successfully",
  "name": "John Doe",
  "email": "admin@school.com",
  "schoolName": "Test School",
  "role": "Admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test 3: Admin Login

```bash
curl -X POST http://localhost:5000/AdminLogin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "Admin123"
  }'
```

Should return token and admin data.

### Test 4: Protected Route (Should Fail Without Token)

```bash
curl http://localhost:5000/Admin/123456789012345678901234
```

Expected response:

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Test 5: Protected Route (Should Work With Token)

```bash
curl http://localhost:5000/Admin/YOUR_ADMIN_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Should return admin details.

---

## 🔐 Authentication Flow

### New Authentication Process

1. **Registration/Login**: User receives JWT token in response
2. **Token Storage**: Frontend stores token in localStorage
3. **API Requests**: Token automatically attached to all requests via interceptor
4. **Token Verification**: Backend validates token on protected routes
5. **Token Expiry**: Auto-logout on token expiration (7 days default)

### Frontend Usage

The token is automatically handled by the new `api.js` utility:

```javascript
// In any component
import api from "../../utils/api";

// Token is automatically attached
const data = await api.get("/Students/123");
```

---

## 📁 New Files Created

### Backend

- `backend/middleware/auth.js` - JWT authentication & authorization
- `backend/middleware/validators.js` - Input validation rules
- `backend/middleware/errorHandler.js` - Centralized error handling

### Frontend

- `frontend/src/utils/api.js` - Axios instance with interceptors

### Configuration

- `backend/.env` - Updated with JWT and security config
- `frontend/.env` - Updated with API configuration
- `.env.example` - Template for both environments

### Documentation

- `PROJECT_ASSESSMENT.md` - Comprehensive quality assessment
- `IMPLEMENTATION_CHECKLIST.md` - Step-by-step improvement guide
- `SECURITY_IMPLEMENTATION.md` - Security code examples
- `PROJECT_SUMMARY.md` - Executive summary
- `INSTALLATION_GUIDE.md` - This file

---

## ⚙️ Configuration Options

### JWT Settings

```env
JWT_SECRET=your-secret-key          # Secret key for signing tokens
JWT_EXPIRE=7d                       # Token expiration (7d, 24h, 60m, etc.)
```

### Rate Limiting

```env
RATE_LIMIT_WINDOW_MS=900000         # Time window (15 minutes)
RATE_LIMIT_MAX_REQUESTS=100         # Max requests per window
```

Login routes have stricter limits:

- 5 attempts per 15 minutes
- Automatically blocks excessive login attempts

---

## 🐛 Troubleshooting

### Issue: "JWT_SECRET is not defined"

**Solution:** Ensure `JWT_SECRET` is set in `backend/.env`

### Issue: "Login not working"

**Solution:** If you have existing admin accounts, they need password migration (see Migration Guide above)

### Issue: "Token expired" errors

**Solution:** Normal behavior after 7 days. Re-login to get new token.

### Issue: "Too many requests" error

**Solution:** Wait 15 minutes or adjust rate limit settings in `.env`

### Issue: CORS errors

**Solution:** Verify `FRONTEND_URL` in backend `.env` matches your frontend URL

### Issue: 401 Unauthorized on protected routes

**Solution:**

1. Check if token is being sent (check Network tab)
2. Verify token hasn't expired
3. Ensure you're logged in

---

## 📊 API Response Structure

All responses now follow this structure:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* ... */
  },
  "token": "..." // Only for login/register
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    /* validation errors */
  ]
}
```

---

## 🔒 Security Best Practices

### In Production

1. **Change JWT_SECRET**: Use a strong, random 32+ character string
2. **Use HTTPS**: Never send tokens over HTTP
3. **Set NODE_ENV=production**
4. **Use MongoDB Atlas**: Don't expose local MongoDB
5. **Enable CORS restrictions**: Whitelist only your frontend domain
6. **Regular updates**: Keep dependencies updated
7. **Monitor logs**: Watch for suspicious activity
8. **Backup data**: Regular database backups

### Password Requirements

New validation enforces:

- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

---

## 📞 Support

If you encounter issues:

1. Check console logs (both frontend and backend)
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Check that all dependencies installed correctly
5. Review error messages carefully

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Frontend dependencies up to date
- [ ] MongoDB running and accessible
- [ ] `.env` files configured (both frontend and backend)
- [ ] `JWT_SECRET` changed from default value
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Health check endpoint responding
- [ ] Admin registration works
- [ ] Admin login returns token
- [ ] Protected routes require authentication
- [ ] Token stored in localStorage
- [ ] Auto-logout on token expiry works
- [ ] Rate limiting functional
- [ ] Validation rejects invalid input

---

## 🎉 Success!

Your School Management System is now:

- ✅ Secure with JWT authentication
- ✅ Protected against common attacks
- ✅ Validated on all inputs
- ✅ Rate-limited against abuse
- ✅ Following best practices
- ✅ Production-ready (after additional testing)

---

**Generated:** January 2, 2026  
**Version:** 2.0.0  
**Security Level:** High  
**Status:** Production-Ready (with proper configuration)
