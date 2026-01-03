const bcrypt = require("bcrypt");
const Parent = require("../models/parentSchema");
const Student = require("../models/studentSchema");
const { generateToken } = require("../middleware/auth");

// Parent Registration
const parentRegister = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const existingParent = await Parent.findOne({ email: req.body.email });

    if (existingParent) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const parent = new Parent({
      ...req.body,
      password: hashedPass,
    });

    let result = await parent.save();
    result.password = undefined;

    res.status(201).json({
      success: true,
      message: "Parent registered successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Parent Login
const parentLogin = async (req, res, next) => {
  try {
    let parent = await Parent.findOne({ email: req.body.email })
      .populate("school", "schoolName")
      .populate({
        path: "children",
        select: "name rollNum sclassName",
        populate: { path: "sclassName", select: "sclassName" },
      });

    if (!parent) {
      return res.status(401).json({
        success: false,
        message: "Parent not found",
      });
    }

    const validated = await bcrypt.compare(req.body.password, parent.password);

    if (!validated) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken({
      id: parent._id,
      role: parent.role,
      email: parent.email,
    });

    const responseData = {
      success: true,
      message: "Login successful",
      token,
      role: parent.role,
      _id: parent._id,
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      children: parent.children,
      school: parent.school,
    };

    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

// Get Parent Details
const getParentDetail = async (req, res) => {
  try {
    let parent = await Parent.findById(req.params.id)
      .populate("school", "schoolName")
      .populate({
        path: "children",
        select: "-password",
        populate: [
          { path: "sclassName", select: "sclassName" },
          { path: "examResult.subName", select: "subName" },
          { path: "attendance.subName", select: "subName sessions" },
        ],
      });

    if (parent) {
      parent.password = undefined;
      res.json({
        success: true,
        data: parent,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching parent details",
      error: err.message,
    });
  }
};

// Link Child to Parent
const linkChildToParent = async (req, res, next) => {
  try {
    const { parentId, studentId } = req.body;

    const parent = await Parent.findById(parentId);
    const student = await Student.findById(studentId);

    if (!parent || !student) {
      return res.status(404).json({
        success: false,
        message: "Parent or Student not found",
      });
    }

    if (parent.children.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student already linked to this parent",
      });
    }

    parent.children.push(studentId);
    student.parent = parentId;

    await parent.save();
    await student.save();

    res.status(200).json({
      success: true,
      message: "Child linked to parent successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Update Parent
const updateParent = async (req, res, next) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const result = await Parent.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Parent updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Parent
const deleteParent = async (req, res, next) => {
  try {
    const result = await Parent.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    // Remove parent reference from students
    await Student.updateMany(
      { parent: req.params.id },
      { $unset: { parent: "" } }
    );

    res.status(200).json({
      success: true,
      message: "Parent deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get All Parents of a School
const getParents = async (req, res) => {
  try {
    let parents = await Parent.find({ school: req.params.id })
      .populate("children", "name rollNum")
      .select("-password");

    res.json({
      success: true,
      data: parents,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching parents",
      error: err.message,
    });
  }
};

module.exports = {
  parentRegister,
  parentLogin,
  getParentDetail,
  linkChildToParent,
  updateParent,
  deleteParent,
  getParents,
};
