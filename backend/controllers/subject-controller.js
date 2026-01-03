const Subject = require("../models/subjectSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Student = require("../models/studentSchema.js");

const subjectCreate = async (req, res) => {
  try {
    const subjects = req.body.subjects.map((subject) => ({
      subName: subject.subName,
      subCode: subject.subCode,
      sessions: subject.sessions,
    }));

    const existingSubjectBySubCode = await Subject.findOne({
      "subjects.subCode": subjects[0].subCode,
      school: req.body.adminID,
    });

    if (existingSubjectBySubCode) {
      return res.status(400).json({
        success: false,
        message: "Sorry this subcode must be unique as it already exists",
      });
    }

    const newSubjects = subjects.map((subject) => ({
      ...subject,
      sclassName: req.body.sclassName,
      school: req.body.adminID,
    }));

    const result = await Subject.insertMany(newSubjects);
    res.status(201).json({
      success: true,
      message: "Subjects created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating subjects",
      error: err.message,
    });
  }
};

const allSubjects = async (req, res) => {
  try {
    let subjects = await Subject.find({ school: req.params.id }).populate(
      "sclassName",
      "sclassName"
    );
    res.json({
      success: true,
      data: subjects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching subjects",
      error: err.message,
    });
  }
};

const classSubjects = async (req, res) => {
  try {
    let subjects = await Subject.find({ sclassName: req.params.id });
    if (subjects.length > 0) {
      res.json({
        success: true,
        data: subjects,
      });
    } else {
      res.json({
        success: true,
        message: "No subjects found",
        data: [],
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching subjects",
      error: err.message,
    });
  }
};

const freeSubjectList = async (req, res) => {
  try {
    let subjects = await Subject.find({
      sclassName: req.params.id,
      teacher: { $exists: false },
    });
    if (subjects.length > 0) {
      res.json({
        success: true,
        data: subjects,
      });
    } else {
      res.json({
        success: true,
        message: "No subjects found",
        data: [],
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching free subjects",
      error: err.message,
    });
  }
};

const getSubjectDetail = async (req, res) => {
  try {
    let subject = await Subject.findById(req.params.id);
    if (subject) {
      subject = await subject.populate("sclassName", "sclassName");
      subject = await subject.populate("teacher", "name");
      res.json({
        success: true,
        data: subject,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No subject found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching subject details",
      error: err.message,
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // Set the teachSubject field to null in teachers
    await Teacher.updateOne(
      { teachSubject: deletedSubject._id },
      { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
    );

    // Remove the objects containing the deleted subject from students' examResult array
    await Student.updateMany(
      {},
      { $pull: { examResult: { subName: deletedSubject._id } } }
    );

    // Remove the objects containing the deleted subject from students' attendance array
    await Student.updateMany(
      {},
      { $pull: { attendance: { subName: deletedSubject._id } } }
    );

    res.json({
      success: true,
      message: "Subject deleted successfully",
      data: deletedSubject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting subject",
      error: error.message,
    });
  }
};

const deleteSubjects = async (req, res) => {
  try {
    const deletedSubjects = await Subject.deleteMany({ school: req.params.id });

    // Set the teachSubject field to null in teachers
    await Teacher.updateMany(
      { teachSubject: { $in: deletedSubjects.map((subject) => subject._id) } },
      { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
    );

    // Set examResult and attendance to null in all students
    await Student.updateMany(
      {},
      { $set: { examResult: null, attendance: null } }
    );

    res.send(deletedSubjects);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteSubjectsByClass = async (req, res) => {
  try {
    const deletedSubjects = await Subject.deleteMany({
      sclassName: req.params.id,
    });

    // Set the teachSubject field to null in teachers
    await Teacher.updateMany(
      { teachSubject: { $in: deletedSubjects.map((subject) => subject._id) } },
      { $unset: { teachSubject: "" }, $unset: { teachSubject: null } }
    );

    // Set examResult and attendance to null in all students
    await Student.updateMany(
      {},
      { $set: { examResult: null, attendance: null } }
    );

    res.send(deletedSubjects);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  subjectCreate,
  freeSubjectList,
  classSubjects,
  getSubjectDetail,
  deleteSubjectsByClass,
  deleteSubjects,
  deleteSubject,
  allSubjects,
};
