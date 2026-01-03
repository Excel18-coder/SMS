const Student = require("../models/studentSchema");
const PDFDocument = require("pdfkit");

// Generate Report Card
const generateReportCard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academicYear, term } = req.query;

    const student = await Student.findById(studentId)
      .populate("school", "schoolName")
      .populate("sclassName", "sclassName")
      .populate("examResult.subName", "subName subCode")
      .populate("attendance.subName", "subName sessions");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Calculate attendance
    const attendanceBySubject = {};
    student.attendance.forEach((record) => {
      const subName = record.subName.subName;
      if (!attendanceBySubject[subName]) {
        attendanceBySubject[subName] = {
          present: 0,
          total: 0,
          sessions: record.subName.sessions,
        };
      }
      attendanceBySubject[subName].total++;
      if (record.status === "Present") {
        attendanceBySubject[subName].present++;
      }
    });

    // Calculate overall performance
    let totalMarks = 0;
    let maxTotalMarks = 0;
    const subjectResults = {};

    student.examResult.forEach((result) => {
      const subName = result.subName.subName;
      if (!subjectResults[subName]) {
        subjectResults[subName] = {
          subCode: result.subName.subCode,
          marks: 0,
          maxMarks: 0,
        };
      }
      subjectResults[subName].marks += result.marksObtained || 0;
      subjectResults[subName].maxMarks += result.totalMarks || 100;
      totalMarks += result.marksObtained || 0;
      maxTotalMarks += result.totalMarks || 100;
    });

    const overallPercentage =
      maxTotalMarks > 0 ? ((totalMarks / maxTotalMarks) * 100).toFixed(2) : 0;

    // Determine grade
    const getGrade = (percentage) => {
      if (percentage >= 90) return "A+";
      if (percentage >= 80) return "A";
      if (percentage >= 70) return "B+";
      if (percentage >= 60) return "B";
      if (percentage >= 50) return "C";
      if (percentage >= 40) return "D";
      return "F";
    };

    const reportData = {
      student: {
        name: student.name,
        rollNum: student.rollNum,
        class: student.sclassName.sclassName,
        school: student.school.schoolName,
      },
      academicYear: academicYear || new Date().getFullYear().toString(),
      term: term || "Not Specified",
      subjects: Object.entries(subjectResults).map(([subName, data]) => {
        const percentage = ((data.marks / data.maxMarks) * 100).toFixed(2);
        return {
          subject: subName,
          subCode: data.subCode,
          marksObtained: data.marks,
          maxMarks: data.maxMarks,
          percentage: percentage,
          grade: getGrade(percentage),
        };
      }),
      attendance: Object.entries(attendanceBySubject).map(([subName, data]) => {
        const percentage = ((data.present / data.total) * 100).toFixed(2);
        return {
          subject: subName,
          present: data.present,
          total: data.total,
          percentage: percentage,
        };
      }),
      overall: {
        totalMarks,
        maxTotalMarks,
        percentage: overallPercentage,
        grade: getGrade(overallPercentage),
      },
      remarks: generateRemarks(overallPercentage),
      generatedDate: new Date().toLocaleDateString(),
    };

    res.json({
      success: true,
      data: reportData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error generating report card",
      error: err.message,
    });
  }
};

// Generate PDF Report Card
const generatePDFReportCard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academicYear, term } = req.query;

    const student = await Student.findById(studentId)
      .populate("school", "schoolName")
      .populate("sclassName", "sclassName")
      .populate("examResult.subName", "subName subCode")
      .populate("attendance.subName", "subName sessions");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-card-${student.rollNum}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Header
    doc.fontSize(20).text(student.school.schoolName, { align: "center" });
    doc.fontSize(16).text("REPORT CARD", { align: "center" });
    doc.moveDown();

    // Student Info
    doc.fontSize(12);
    doc.text(`Student Name: ${student.name}`);
    doc.text(`Roll Number: ${student.rollNum}`);
    doc.text(`Class: ${student.sclassName.sclassName}`);
    doc.text(
      `Academic Year: ${academicYear || new Date().getFullYear().toString()}`
    );
    doc.text(`Term: ${term || "Not Specified"}`);
    doc.moveDown();

    // Marks Table
    doc.fontSize(14).text("Academic Performance", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(10);
    const tableTop = doc.y;
    const tableHeaders = [
      "Subject",
      "Marks Obtained",
      "Max Marks",
      "Percentage",
      "Grade",
    ];
    const colWidths = [150, 100, 80, 80, 60];

    // Draw table headers
    let x = 50;
    tableHeaders.forEach((header, i) => {
      doc.text(header, x, tableTop, { width: colWidths[i] });
      x += colWidths[i];
    });

    doc.moveDown();

    // Calculate and draw subject results
    let totalMarks = 0;
    let maxTotalMarks = 0;
    const subjectResults = {};

    student.examResult.forEach((result) => {
      const subName = result.subName.subName;
      if (!subjectResults[subName]) {
        subjectResults[subName] = {
          marks: 0,
          maxMarks: 0,
        };
      }
      subjectResults[subName].marks += result.marksObtained || 0;
      subjectResults[subName].maxMarks += result.totalMarks || 100;
      totalMarks += result.marksObtained || 0;
      maxTotalMarks += result.totalMarks || 100;
    });

    const getGrade = (percentage) => {
      if (percentage >= 90) return "A+";
      if (percentage >= 80) return "A";
      if (percentage >= 70) return "B+";
      if (percentage >= 60) return "B";
      if (percentage >= 50) return "C";
      if (percentage >= 40) return "D";
      return "F";
    };

    Object.entries(subjectResults).forEach(([subName, data]) => {
      const percentage = ((data.marks / data.maxMarks) * 100).toFixed(2);
      const grade = getGrade(percentage);

      x = 50;
      const y = doc.y;
      doc.text(subName, x, y, { width: colWidths[0] });
      x += colWidths[0];
      doc.text(data.marks.toString(), x, y, { width: colWidths[1] });
      x += colWidths[1];
      doc.text(data.maxMarks.toString(), x, y, { width: colWidths[2] });
      x += colWidths[2];
      doc.text(percentage + "%", x, y, { width: colWidths[3] });
      x += colWidths[3];
      doc.text(grade, x, y, { width: colWidths[4] });
      doc.moveDown(0.5);
    });

    doc.moveDown();

    // Overall Performance
    const overallPercentage =
      maxTotalMarks > 0 ? ((totalMarks / maxTotalMarks) * 100).toFixed(2) : 0;

    doc.fontSize(12);
    doc.text(`Total Marks: ${totalMarks}/${maxTotalMarks}`);
    doc.text(`Overall Percentage: ${overallPercentage}%`);
    doc.text(`Overall Grade: ${getGrade(overallPercentage)}`);
    doc.moveDown();

    // Attendance
    doc.fontSize(14).text("Attendance Summary", { underline: true });
    doc.moveDown(0.5);

    const attendanceBySubject = {};
    student.attendance.forEach((record) => {
      const subName = record.subName.subName;
      if (!attendanceBySubject[subName]) {
        attendanceBySubject[subName] = {
          present: 0,
          total: 0,
        };
      }
      attendanceBySubject[subName].total++;
      if (record.status === "Present") {
        attendanceBySubject[subName].present++;
      }
    });

    doc.fontSize(10);
    Object.entries(attendanceBySubject).forEach(([subName, data]) => {
      const percentage = ((data.present / data.total) * 100).toFixed(2);
      doc.text(`${subName}: ${data.present}/${data.total} (${percentage}%)`);
    });

    doc.moveDown();

    // Remarks
    doc.fontSize(12);
    doc.text("Remarks:", { underline: true });
    doc.fontSize(10);
    doc.text(generateRemarks(overallPercentage));

    doc.moveDown(2);

    // Signatures
    doc.fontSize(10);
    doc.text("_________________", 50);
    doc.text("Class Teacher", 50);

    doc.text("_________________", 350);
    doc.text("Principal", 350);

    // Finalize PDF
    doc.end();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error generating PDF report card",
      error: err.message,
    });
  }
};

// Helper function to generate remarks
const generateRemarks = (percentage) => {
  if (percentage >= 90) {
    return "Outstanding performance! Keep up the excellent work.";
  } else if (percentage >= 80) {
    return "Excellent work! Continue to strive for excellence.";
  } else if (percentage >= 70) {
    return "Good performance. Keep working hard.";
  } else if (percentage >= 60) {
    return "Satisfactory performance. There is room for improvement.";
  } else if (percentage >= 50) {
    return "Average performance. Please focus more on studies.";
  } else if (percentage >= 40) {
    return "Below average performance. Extra attention required.";
  } else {
    return "Poor performance. Immediate intervention needed.";
  }
};

// Get Class Report Cards
const getClassReportCards = async (req, res) => {
  try {
    const { classId } = req.params;
    const { academicYear, term } = req.query;

    const students = await Student.find({ sclassName: classId })
      .populate("examResult.subName", "subName")
      .populate("attendance.subName", "subName");

    const reportCards = students.map((student) => {
      let totalMarks = 0;
      let maxTotalMarks = 0;

      student.examResult.forEach((result) => {
        totalMarks += result.marksObtained || 0;
        maxTotalMarks += result.totalMarks || 100;
      });

      const overallPercentage =
        maxTotalMarks > 0 ? ((totalMarks / maxTotalMarks) * 100).toFixed(2) : 0;

      const getGrade = (percentage) => {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C";
        if (percentage >= 40) return "D";
        return "F";
      };

      return {
        studentId: student._id,
        name: student.name,
        rollNum: student.rollNum,
        totalMarks,
        maxTotalMarks,
        percentage: overallPercentage,
        grade: getGrade(overallPercentage),
      };
    });

    res.json({
      success: true,
      data: reportCards.sort((a, b) => b.percentage - a.percentage),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching class report cards",
      error: err.message,
    });
  }
};

module.exports = {
  generateReportCard,
  generatePDFReportCard,
  getClassReportCards,
};
