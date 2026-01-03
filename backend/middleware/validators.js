const { body, param, validationResult } = require("express-validator");

// Validation error handler
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
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
    .withMessage("Password must be at least 6 characters"),
  body("schoolName")
    .trim()
    .notEmpty()
    .withMessage("School name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("School name must be between 3-100 characters"),
];

exports.validateAdminLogin = [
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

exports.validateStudentLogin = [
  body("rollNum")
    .notEmpty()
    .withMessage("Roll number is required")
    .isInt({ min: 1 })
    .withMessage("Invalid roll number"),
  body("studentName").trim().notEmpty().withMessage("Student name is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Teacher validation rules
exports.validateTeacherRegister = [
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
    .withMessage("Password must be at least 6 characters"),
  body("school")
    .notEmpty()
    .withMessage("School ID is required")
    .isMongoId()
    .withMessage("Invalid school ID"),
  body("teachSclass")
    .notEmpty()
    .withMessage("Class is required")
    .isMongoId()
    .withMessage("Invalid class ID"),
];

exports.validateTeacherLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
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
  body("subjects")
    .isArray({ min: 1 })
    .withMessage("At least one subject is required"),
  body("subjects.*.subName")
    .trim()
    .notEmpty()
    .withMessage("Subject name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Subject name must be between 2-50 characters"),
  body("subjects.*.subCode")
    .trim()
    .notEmpty()
    .withMessage("Subject code is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Subject code must be between 2-20 characters"),
  body("subjects.*.sessions").notEmpty().withMessage("Sessions are required"),
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

// Class validation
exports.validateClass = [
  body("sclassName")
    .trim()
    .notEmpty()
    .withMessage("Class name is required")
    .isLength({ min: 1, max: 20 })
    .withMessage("Class name must be between 1-20 characters"),
];

// Attendance validation
exports.validateAttendance = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Present", "Absent"])
    .withMessage("Status must be Present or Absent"),
];

// Exam result validation
exports.validateExamResult = [
  body("subName")
    .notEmpty()
    .withMessage("Subject is required")
    .isMongoId()
    .withMessage("Invalid subject ID"),
  body("marksObtained")
    .notEmpty()
    .withMessage("Marks are required")
    .isInt({ min: 0, max: 100 })
    .withMessage("Marks must be between 0 and 100"),
];

// Complain validation
exports.validateComplain = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3-100 characters"),
  body("complaint")
    .trim()
    .notEmpty()
    .withMessage("Complaint details are required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Complaint must be between 10-1000 characters"),
];
