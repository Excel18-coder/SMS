const bcrypt = require("bcrypt");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");
const { generateToken } = require("../middleware/auth.js");

const teacherRegister = async (req, res, next) => {
  const { name, email, password, role, school, teachSubject, teachSclass } =
    req.body;
  try {
    const existingTeacherByEmail = await Teacher.findOne({ email });

    if (existingTeacherByEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPass,
      role,
      school,
      teachSubject,
      teachSclass,
    });

    let result = await teacher.save();
    await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
    result.password = undefined;

    res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const teacherLogIn = async (req, res, next) => {
  try {
    let teacher = await Teacher.findOne({ email: req.body.email });

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const validated = await bcrypt.compare(req.body.password, teacher.password);

    if (!validated) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    teacher = await teacher.populate("teachSubject", "subName sessions");
    teacher = await teacher.populate("school", "schoolName");
    teacher = await teacher.populate("teachSclass", "sclassName");

    // Generate JWT token
    const token = generateToken({
      id: teacher._id,
      role: teacher.role,
      email: teacher.email,
      name: teacher.name,
    });

    teacher.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: teacher.role,
      _id: teacher._id,
      email: teacher.email,
      name: teacher.name,
      school: teacher.school,
      teachSubject: teacher.teachSubject,
      teachSclass: teacher.teachSclass,
    });
  } catch (err) {
    next(err);
  }
};

const getTeachers = async (req, res) => {
  try {
    let teachers = await Teacher.find({ school: req.params.id })
      .populate("teachSubject", "subName")
      .populate("teachSclass", "sclassName");
    let modifiedTeachers = teachers.map((teacher) => {
      return { ...teacher._doc, password: undefined };
    });
    res.json({
      success: true,
      data: modifiedTeachers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching teachers",
      error: err.message,
    });
  }
};

const getTeacherDetail = async (req, res) => {
  try {
    let teacher = await Teacher.findById(req.params.id)
      .populate("teachSubject", "subName sessions")
      .populate("school", "schoolName")
      .populate("teachSclass", "sclassName");
    if (teacher) {
      teacher.password = undefined;
      res.json({
        success: true,
        data: teacher,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No teacher found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching teacher details",
      error: err.message,
    });
  }
};

const updateTeacherSubject = async (req, res) => {
  const { teacherId, teachSubject } = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { teachSubject },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    await Subject.findByIdAndUpdate(teachSubject, {
      teacher: updatedTeacher._id,
    });

    res.json({
      success: true,
      message: "Teacher subject updated successfully",
      data: updatedTeacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating teacher subject",
      error: error.message,
    });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!deletedTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    await Subject.updateOne(
      { teacher: deletedTeacher._id, teacher: { $exists: true } },
      { $unset: { teacher: 1 } }
    );

    res.json({
      success: true,
      message: "Teacher deleted successfully",
      data: deletedTeacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting teacher",
      error: error.message,
    });
  }
};

const deleteTeachers = async (req, res) => {
  try {
    const deletionResult = await Teacher.deleteMany({ school: req.params.id });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      return res.json({
        success: true,
        message: "No teachers found to delete",
        data: { deletedCount: 0 },
      });
    }

    const deletedTeachers = await Teacher.find({ school: req.params.id });

    await Subject.updateMany(
      {
        teacher: { $in: deletedTeachers.map((teacher) => teacher._id) },
        teacher: { $exists: true },
      },
      { $unset: { teacher: "", teacher: null } }
    );

    res.json({
      success: true,
      message: `${deletedCount} teachers deleted successfully`,
      data: deletionResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting teachers",
      error: error.message,
    });
  }
};

const deleteTeachersByClass = async (req, res) => {
  try {
    const deletionResult = await Teacher.deleteMany({
      sclassName: req.params.id,
    });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      return res.json({
        success: true,
        message: "No teachers found to delete",
        data: { deletedCount: 0 },
      });
    }

    const deletedTeachers = await Teacher.find({ sclassName: req.params.id });

    await Subject.updateMany(
      {
        teacher: { $in: deletedTeachers.map((teacher) => teacher._id) },
        teacher: { $exists: true },
      },
      { $unset: { teacher: "", teacher: null } }
    );

    res.json({
      success: true,
      message: `${deletedCount} teachers deleted successfully`,
      data: deletionResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting teachers",
      error: error.message,
    });
  }
};

const teacherAttendance = async (req, res) => {
  const { status, date } = req.body;

  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const existingAttendance = teacher.attendance.find(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      teacher.attendance.push({ date, status });
    }

    const result = await teacher.save();
    return res.json({
      success: true,
      message: "Teacher attendance updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating teacher attendance",
      error: error.message,
    });
  }
};

module.exports = {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  updateTeacherSubject,
  deleteTeacher,
  deleteTeachers,
  deleteTeachersByClass,
  teacherAttendance,
};
