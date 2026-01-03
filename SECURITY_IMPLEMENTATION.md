# Security Implementation Guide

## 🔐 Critical Security Fixes - Code Examples

---

## 1. JWT Authentication Middleware

### Create: `backend/middleware/auth.js`

```javascript
const jwt = require("jsonwebtoken");

// Verify JWT Token
exports.authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token.",
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Verify User Role
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

// Generate JWT Token
exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};
```

---

## 2. Fix Admin Password Hashing

### Update: `backend/controllers/admin-controller.js`

Replace the current plain-text code with:

```javascript
const bcrypt = require("bcrypt");
const Admin = require("../models/adminSchema.js");
const { generateToken } = require("../middleware/auth.js");

const adminRegister = async (req, res) => {
  try {
    const { name, email, password, schoolName } = req.body;

    // Check if admin already exists
    const existingAdminByEmail = await Admin.findOne({ email });
    const existingSchool = await Admin.findOne({ schoolName });

    if (existingAdminByEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (existingSchool) {
      return res.status(400).json({
        success: false,
        message: "School name already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password: hashedPass,
      schoolName,
      role: "Admin",
    });

    const result = await admin.save();

    // Generate JWT token
    const token = generateToken({
      id: result._id,
      role: result.role,
      email: result.email,
    });

    // Don't send password in response
    result.password = undefined;

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: result,
      token,
    });
  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(500).json({
      success: false,
      message: "Error registering admin",
      error: err.message,
    });
  }
};

const adminLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const validated = await bcrypt.compare(password, admin.password);

    if (!validated) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: admin._id,
      role: admin.role,
      email: admin.email,
    });

    // Don't send password
    admin.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: admin,
      token,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: err.message,
    });
  }
};

const getAdminDetail = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching admin details",
      error: err.message,
    });
  }
};

module.exports = { adminRegister, adminLogIn, getAdminDetail };
```

---

## 3. Update Routes with Authentication

### Update: `backend/routes/route.js`

```javascript
const router = require("express").Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth.js");

// Import all controllers
const {
  adminRegister,
  adminLogIn,
  getAdminDetail,
} = require("../controllers/admin-controller.js");
// ... other imports

// ========== PUBLIC ROUTES (No Authentication) ==========

// Admin
router.post("/AdminReg", adminRegister);
router.post("/AdminLogin", adminLogIn);

// Student
router.post("/StudentLogin", studentLogIn);

// Teacher
router.post("/TeacherLogin", teacherLogIn);

// ========== PROTECTED ROUTES (Authentication Required) ==========

// Admin Routes - Only Admin can access
router.get(
  "/Admin/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  getAdminDetail
);

// Student Routes
router.post(
  "/StudentReg",
  authenticateToken,
  authorizeRoles("Admin"),
  studentRegister
);
router.get(
  "/Students/:id",
  authenticateToken,
  authorizeRoles("Admin", "Teacher"),
  getStudents
);
router.get("/Student/:id", authenticateToken, getStudentDetail);
router.delete(
  "/Students/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteStudents
);
router.delete(
  "/Student/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteStudent
);
router.put("/Student/:id", authenticateToken, updateStudent);
router.put(
  "/UpdateExamResult/:id",
  authenticateToken,
  authorizeRoles("Admin", "Teacher"),
  updateExamResult
);
router.put(
  "/StudentAttendance/:id",
  authenticateToken,
  authorizeRoles("Teacher"),
  studentAttendance
);

// Teacher Routes
router.post(
  "/TeacherReg",
  authenticateToken,
  authorizeRoles("Admin"),
  teacherRegister
);
router.get(
  "/Teachers/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  getTeachers
);
router.get("/Teacher/:id", authenticateToken, getTeacherDetail);
router.delete(
  "/Teachers/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteTeachers
);
router.delete(
  "/Teacher/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteTeacher
);
router.put(
  "/TeacherSubject",
  authenticateToken,
  authorizeRoles("Admin"),
  updateTeacherSubject
);

// Notice Routes
router.post(
  "/NoticeCreate",
  authenticateToken,
  authorizeRoles("Admin"),
  noticeCreate
);
router.get("/NoticeList/:id", authenticateToken, noticeList);
router.delete(
  "/Notices/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteNotices
);
router.delete(
  "/Notice/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteNotice
);
router.put(
  "/Notice/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  updateNotice
);

// Complain Routes
router.post("/ComplainCreate", authenticateToken, complainCreate);
router.get(
  "/ComplainList/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  complainList
);

// Class Routes
router.post(
  "/SclassCreate",
  authenticateToken,
  authorizeRoles("Admin"),
  sclassCreate
);
router.get("/SclassList/:id", authenticateToken, sclassList);
router.get("/Sclass/:id", authenticateToken, getSclassDetail);
router.get("/Sclass/Students/:id", authenticateToken, getSclassStudents);
router.delete(
  "/Sclasses/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteSclasses
);
router.delete(
  "/Sclass/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteSclass
);

// Subject Routes
router.post(
  "/SubjectCreate",
  authenticateToken,
  authorizeRoles("Admin"),
  subjectCreate
);
router.get("/AllSubjects/:id", authenticateToken, allSubjects);
router.get("/ClassSubjects/:id", authenticateToken, classSubjects);
router.get(
  "/FreeSubjectList/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  freeSubjectList
);
router.get("/Subject/:id", authenticateToken, getSubjectDetail);
router.delete(
  "/Subject/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteSubject
);
router.delete(
  "/Subjects/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteSubjects
);

module.exports = router;
```

---

## 4. Add Security Middleware to App

### Update: `backend/index.js`

```javascript
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const app = express();
const Routes = require("./routes/route.js");

const PORT = process.env.PORT || 5000;

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.MONGO_URL) {
  console.error("FATAL ERROR: MONGO_URL is not defined.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

// ========== SECURITY MIDDLEWARE ==========

// Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true,
});
app.use("/AdminLogin", authLimiter);
app.use("/StudentLogin", authLimiter);
app.use("/TeacherLogin", authLimiter);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Enable CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ========== DATABASE CONNECTION ==========

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ========== ROUTES ==========

app.use("/", Routes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========== ERROR HANDLING MIDDLEWARE ==========

app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ========== START SERVER ==========

app.listen(PORT, () => {
  console.log(`🚀 Server started at port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err);
  process.exit(1);
});
```

---

## 5. Input Validation Middleware

### Create: `backend/middleware/validators.js`

```javascript
const { body, param, validationResult } = require("express-validator");

// Validation error handler
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Admin validation rules
exports.validateAdminRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2-50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("schoolName")
    .trim()
    .notEmpty()
    .withMessage("School name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("School name must be between 3-100 characters"),
];

exports.validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Student validation rules
exports.validateStudentRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2-50 characters"),
  body("rollNum")
    .notEmpty()
    .withMessage("Roll number is required")
    .isInt({ min: 1 })
    .withMessage("Roll number must be a positive integer"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("sclassName")
    .notEmpty()
    .withMessage("Class is required")
    .isMongoId()
    .withMessage("Invalid class ID"),
  body("adminID")
    .notEmpty()
    .withMessage("Admin ID is required")
    .isMongoId()
    .withMessage("Invalid admin ID"),
];

// MongoDB ID validation
exports.validateMongoId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];

// Notice validation
exports.validateNotice = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3-200 characters"),
  body("details")
    .trim()
    .notEmpty()
    .withMessage("Details are required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Details must be between 10-5000 characters"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
];

// Subject validation
exports.validateSubject = [
  body("subName")
    .trim()
    .notEmpty()
    .withMessage("Subject name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Subject name must be between 2-50 characters"),
  body("subCode")
    .trim()
    .notEmpty()
    .withMessage("Subject code is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Subject code must be between 2-20 characters"),
  body("sessions")
    .notEmpty()
    .withMessage("Sessions are required")
    .isInt({ min: 1 })
    .withMessage("Sessions must be a positive integer"),
];

// Class validation
exports.validateClass = [
  body("sclassName")
    .trim()
    .notEmpty()
    .withMessage("Class name is required")
    .isLength({ min: 1, max: 20 })
    .withMessage("Class name must be between 1-20 characters"),
];
```

### Apply Validators to Routes:

```javascript
// In route.js
const {
  validateAdminRegister,
  validateLogin,
  validateMongoId,
  handleValidationErrors,
} = require("../middleware/validators.js");

// Example usage
router.post(
  "/AdminReg",
  validateAdminRegister,
  handleValidationErrors,
  adminRegister
);

router.post("/AdminLogin", validateLogin, handleValidationErrors, adminLogIn);

router.get(
  "/Admin/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  getAdminDetail
);
```

---

## 6. Frontend: Store and Use JWT

### Update: `frontend/src/redux/userRelated/userHandle.js`

```javascript
import axios from "axios";
import { authRequest, authSuccess, authFailed, authError } from "./userSlice";

// Create axios instance with interceptor
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const loginUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await api.post(`/${role}Login`, fields);

    if (result.data.success && result.data.token) {
      // Store token and user data
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.data));
      dispatch(authSuccess(result.data.data));
    } else {
      dispatch(authFailed(result.data.message || "Login failed"));
    }
  } catch (error) {
    const message = error.response?.data?.message || "Network error";
    dispatch(authError(message));
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Export configured axios instance
export default api;
```

---

## 7. Install Required Packages

```bash
cd backend

# Security
npm install jsonwebtoken express-rate-limit helmet express-mongo-sanitize xss-clean

# Validation
npm install express-validator

# If not already installed
npm install bcrypt dotenv cors express mongoose
```

---

## 8. Update .env File

Ensure your `backend/.env` has:

```env
MONGO_URL=mongodb://127.0.0.1:27017/smsproject
PORT=5000
NODE_ENV=development

# JWT Configuration - CHANGE THESE!
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-this
JWT_EXPIRE=7d

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Implementation Order

1. ✅ Install packages
2. ✅ Create auth middleware (`backend/middleware/auth.js`)
3. ✅ Fix admin password hashing (`backend/controllers/admin-controller.js`)
4. ✅ Update index.js with security middleware
5. ✅ Create validation middleware (`backend/middleware/validators.js`)
6. ✅ Update routes with authentication & validation
7. ✅ Update frontend to store and use JWT tokens
8. ✅ Test all endpoints

---

## ✅ Testing Checklist

- [ ] Can register new admin with strong password
- [ ] Cannot register with weak password
- [ ] Can login with correct credentials
- [ ] Cannot login with wrong credentials
- [ ] Protected routes reject requests without token
- [ ] Protected routes accept requests with valid token
- [ ] Expired tokens are rejected
- [ ] Rate limiting blocks excessive requests
- [ ] XSS attacks are sanitized
- [ ] SQL injection attempts are blocked

---

**IMPORTANT**: After implementing these changes, all passwords will be hashed. You'll need to re-register users or update existing passwords through the registration flow.
