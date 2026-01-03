const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const { errorHandler } = require("./middleware/errorHandler.js");

const app = express();
const Routes = require("./routes/route.js");

// Load environment variables first
dotenv.config();

const PORT = process.env.PORT || 5000;

// Validate required environment variables
if (!process.env.MONGO_URL) {
  console.error("❌ FATAL ERROR: MONGO_URL is not defined in .env file");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1);
}

// ========== SECURITY MIDDLEWARE ==========

// Enable CORS FIRST to handle preflight requests
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Body parser middleware (must be before rate limiter to parse request body)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting for all routes
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limit for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts (increased from 5 for better UX)
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
  skipSuccessfulRequests: true,
});

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

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

// Health check endpoint (public)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Apply auth rate limiting to login routes
app.use("/AdminLogin", authLimiter);
app.use("/StudentLogin", authLimiter);
app.use("/TeacherLogin", authLimiter);

// API routes
app.use("/", Routes);

// 404 handler - must be before error handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ========== GLOBAL ERROR HANDLING MIDDLEWARE ==========
app.use(errorHandler);

// ========== START SERVER ==========

const server = app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔒 Security: Enabled (Helmet, Rate Limiting, XSS Protection)`);
  console.log(`🌐 CORS: ${corsOptions.origin}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Process terminated");
  });
});
