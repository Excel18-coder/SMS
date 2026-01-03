const Assignment = require("../models/assignmentSchema");
const Student = require("../models/studentSchema");

// Create Assignment
const createAssignment = async (req, res, next) => {
  try {
    const assignment = new Assignment(req.body);
    const result = await assignment.save();

    await result.populate([
      { path: "subject", select: "subName subCode" },
      { path: "class", select: "sclassName" },
      { path: "teacher", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get All Assignments for a Class
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ class: req.params.classId })
      .populate("subject", "subName subCode")
      .populate("teacher", "name email")
      .populate("submissions.student", "name rollNum")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: assignments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
      error: err.message,
    });
  }
};

// Get Assignment Details
const getAssignmentDetail = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("subject", "subName subCode")
      .populate("class", "sclassName")
      .populate("teacher", "name email")
      .populate("submissions.student", "name rollNum email");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.json({
      success: true,
      data: assignment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching assignment",
      error: err.message,
    });
  }
};

// Get Assignments for a Student
const getStudentAssignments = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const assignments = await Assignment.find({ class: student.sclassName })
      .populate("subject", "subName subCode")
      .populate("teacher", "name");

    // Add submission status for each assignment
    const assignmentsWithStatus = assignments.map((assignment) => {
      const submission = assignment.submissions.find(
        (sub) => sub.student.toString() === req.params.studentId
      );

      return {
        ...assignment.toObject(),
        submissionStatus: submission ? submission.status : "Not Submitted",
        submissionDetails: submission || null,
      };
    });

    res.json({
      success: true,
      data: assignmentsWithStatus,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
      error: err.message,
    });
  }
};

// Submit Assignment
const submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId, studentId, attachments, remarks } = req.body;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      (sub) => sub.student.toString() === studentId
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: "Assignment already submitted",
      });
    }

    // Determine if late
    const isLate = new Date() > assignment.dueDate;

    assignment.submissions.push({
      student: studentId,
      status: isLate ? "Late" : "Submitted",
      attachments,
      submittedAt: new Date(),
    });

    await assignment.save();

    res.status(200).json({
      success: true,
      message: "Assignment submitted successfully",
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

// Grade Assignment Submission
const gradeAssignment = async (req, res, next) => {
  try {
    const { assignmentId, studentId, marksObtained, feedback, gradedBy } =
      req.body;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const submission = assignment.submissions.find(
      (sub) => sub.student.toString() === studentId
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    submission.marksObtained = marksObtained;
    submission.feedback = feedback;
    submission.gradedAt = new Date();
    submission.gradedBy = gradedBy;

    await assignment.save();

    res.status(200).json({
      success: true,
      message: "Assignment graded successfully",
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

// Update Assignment
const updateAssignment = async (req, res, next) => {
  try {
    const result = await Assignment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Assignment
const deleteAssignment = async (req, res, next) => {
  try {
    const result = await Assignment.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get Teacher's Assignments
const getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.params.teacherId })
      .populate("subject", "subName subCode")
      .populate("class", "sclassName")
      .populate("submissions.student", "name rollNum")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: assignments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
      error: err.message,
    });
  }
};

// Get Assignments by Subject
const getAssignmentsBySubject = async (req, res) => {
  try {
    const assignments = await Assignment.find({ subject: req.params.subjectId })
      .populate("subject", "subName subCode")
      .populate("class", "sclassName")
      .populate("teacher", "name email")
      .populate("submissions.student", "name rollNum")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: assignments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
      error: err.message,
    });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentDetail,
  getStudentAssignments,
  submitAssignment,
  gradeAssignment,
  updateAssignment,
  deleteAssignment,
  getTeacherAssignments,
  getAssignmentsBySubject,
};
