const bcrypt = require("bcrypt");
const Student = require("../models/studentSchema.js");
const Subject = require("../models/subjectSchema.js");
const { generateToken } = require("../middleware/auth.js");

const studentRegister = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const existingStudent = await Student.findOne({
      rollNum: req.body.rollNum,
      school: req.body.adminID,
      sclassName: req.body.sclassName,
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Roll Number already exists",
      });
    }

    const student = new Student({
      ...req.body,
      school: req.body.adminID,
      password: hashedPass,
    });

    let result = await student.save();
    result.password = undefined;

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const studentLogIn = async (req, res, next) => {
  try {
    console.log("Student login attempt:", {
      rollNum: req.body.rollNum,
      studentName: req.body.studentName,
    });

    let student = await Student.findOne({
      rollNum: req.body.rollNum,
      name: req.body.studentName,
    });

    if (!student) {
      console.log("Student not found with provided credentials");
      return res.status(401).json({
        success: false,
        message: "Student not found. Please check your roll number and name.",
      });
    }

    const validated = await bcrypt.compare(req.body.password, student.password);

    if (!validated) {
      console.log("Invalid password for student:", student.rollNum);
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Populate school and class details
    student = await student.populate("school", "schoolName");
    student = await student.populate("sclassName", "sclassName");

    // Generate JWT token
    const token = generateToken({
      id: student._id,
      role: student.role,
      rollNum: student.rollNum,
      name: student.name,
    });

    // Prepare response data
    const responseData = {
      success: true,
      message: "Login successful",
      token,
      role: student.role || "Student",
      _id: student._id,
      rollNum: student.rollNum,
      name: student.name,
      school: student.school,
      sclassName: student.sclassName,
    };

    console.log("Student login successful:", {
      _id: student._id,
      rollNum: student.rollNum,
      name: student.name,
      role: student.role,
    });

    res.status(200).json(responseData);
  } catch (err) {
    console.error("Student login error:", err);
    next(err);
  }
};

const getStudents = async (req, res) => {
  try {
    let students = await Student.find({ school: req.params.id }).populate(
      "sclassName",
      "sclassName"
    );
    let modifiedStudents = students.map((student) => {
      return { ...student._doc, password: undefined };
    });
    res.json({
      success: true,
      data: modifiedStudents,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: err.message,
    });
  }
};

const getStudentDetail = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id)
      .populate("school", "schoolName")
      .populate("sclassName", "sclassName")
      .populate("examResult.subName", "subName")
      .populate("attendance.subName", "subName sessions");
    if (student) {
      student.password = undefined;
      res.json({
        success: true,
        data: student,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No student found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching student details",
      error: err.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    res.json({
      success: true,
      message: "Student deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting student",
      error: error.message,
    });
  }
};

const deleteStudents = async (req, res) => {
  try {
    const result = await Student.deleteMany({ school: req.params.id });
    if (result.deletedCount === 0) {
      return res.json({
        success: true,
        message: "No students found to delete",
        data: { deletedCount: 0 },
      });
    } else {
      res.json({
        success: true,
        message: `${result.deletedCount} students deleted successfully`,
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting students",
      error: error.message,
    });
  }
};

const deleteStudentsByClass = async (req, res) => {
  try {
    const result = await Student.deleteMany({ sclassName: req.params.id });
    if (result.deletedCount === 0) {
      return res.json({
        success: true,
        message: "No students found to delete",
        data: { deletedCount: 0 },
      });
    } else {
      res.json({
        success: true,
        message: `${result.deletedCount} students deleted successfully`,
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting students",
      error: error.message,
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    let result = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    result.password = undefined;
    res.json({
      success: true,
      message: "Student updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating student",
      error: error.message,
    });
  }
};

const updateExamResult = async (req, res) => {
  const { subName, marksObtained } = req.body;

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const existingResult = student.examResult.find(
      (result) => result.subName.toString() === subName
    );

    if (existingResult) {
      existingResult.marksObtained = marksObtained;
    } else {
      student.examResult.push({ subName, marksObtained });
    }

    const result = await student.save();
    return res.json({
      success: true,
      message: "Exam result updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating exam result",
      error: error.message,
    });
  }
};

const studentAttendance = async (req, res) => {
  const { subName, status, date } = req.body;

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const subject = await Subject.findById(subName);

    const existingAttendance = student.attendance.find(
      (a) =>
        a.date.toDateString() === new Date(date).toDateString() &&
        a.subName.toString() === subName
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      // Check if the student has already attended the maximum number of sessions
      const attendedSessions = student.attendance.filter(
        (a) => a.subName.toString() === subName
      ).length;

      if (attendedSessions >= subject.sessions) {
        return res.status(400).json({
          success: false,
          message: "Maximum attendance limit reached",
        });
      }

      student.attendance.push({ date, status, subName });
    }

    const result = await student.save();
    return res.json({
      success: true,
      message: "Attendance updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating attendance",
      error: error.message,
    });
  }
};

const clearAllStudentsAttendanceBySubject = async (req, res) => {
  const subName = req.params.id;

  try {
    const result = await Student.updateMany(
      { "attendance.subName": subName },
      { $pull: { attendance: { subName } } }
    );
    return res.json({
      success: true,
      message: "Attendance cleared successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error clearing attendance",
      error: error.message,
    });
  }
};

const clearAllStudentsAttendance = async (req, res) => {
  const schoolId = req.params.id;

  try {
    const result = await Student.updateMany(
      { school: schoolId },
      { $set: { attendance: [] } }
    );

    return res.json({
      success: true,
      message: "All student attendance cleared successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error clearing attendance",
      error: error.message,
    });
  }
};

const removeStudentAttendanceBySubject = async (req, res) => {
  const studentId = req.params.id;
  const subName = req.body.subId;

  try {
    const result = await Student.updateOne(
      { _id: studentId },
      { $pull: { attendance: { subName: subName } } }
    );

    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const removeStudentAttendance = async (req, res) => {
  const studentId = req.params.id;

  try {
    const result = await Student.updateOne(
      { _id: studentId },
      { $set: { attendance: [] } }
    );

    return res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  studentRegister,
  studentLogIn,
  getStudents,
  getStudentDetail,
  deleteStudents,
  deleteStudent,
  updateStudent,
  studentAttendance,
  deleteStudentsByClass,
  updateExamResult,

  clearAllStudentsAttendanceBySubject,
  clearAllStudentsAttendance,
  removeStudentAttendanceBySubject,
  removeStudentAttendance,
};
