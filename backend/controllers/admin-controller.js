const bcrypt = require("bcrypt");
const Admin = require("../models/adminSchema.js");
const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");
const Notice = require("../models/noticeSchema.js");
const Complain = require("../models/complainSchema.js");
const { generateToken } = require("../middleware/auth.js");

const adminRegister = async (req, res, next) => {
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
      schoolName: result.schoolName,
    });

    // Don't send password in response
    result.password = undefined;

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      ...result._doc,
      token,
    });
  } catch (err) {
    console.error("Admin registration error:", err);
    next(err);
  }
};

const adminLogIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

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
      schoolName: admin.schoolName,
    });

    // Don't send password
    admin.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: admin.role,
      _id: admin._id,
      email: admin.email,
      schoolName: admin.schoolName,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    next(err);
  }
};

const getAdminDetail = async (req, res, next) => {
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
    next(err);
  }
};

// const deleteAdmin = async (req, res) => {
//     try {
//         const result = await Admin.findByIdAndDelete(req.params.id)

//         await Sclass.deleteMany({ school: req.params.id });
//         await Student.deleteMany({ school: req.params.id });
//         await Teacher.deleteMany({ school: req.params.id });
//         await Subject.deleteMany({ school: req.params.id });
//         await Notice.deleteMany({ school: req.params.id });
//         await Complain.deleteMany({ school: req.params.id });

//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// const updateAdmin = async (req, res) => {
//     try {
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             res.body.password = await bcrypt.hash(res.body.password, salt)
//         }
//         let result = await Admin.findByIdAndUpdate(req.params.id,
//             { $set: req.body },
//             { new: true })

//         result.password = undefined;
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };

module.exports = { adminRegister, adminLogIn, getAdminDetail };
