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
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}`,
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

// Verify token ownership (user can only access their own data)
exports.verifyOwnership = (req, res, next) => {
  const requestedId = req.params.id;
  const userId = req.user.id;

  // Admin can access any data
  if (req.user.role === "Admin") {
    return next();
  }

  // Users can only access their own data
  if (requestedId !== userId) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own data.",
    });
  }

  next();
};
