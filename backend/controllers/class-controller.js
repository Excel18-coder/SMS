const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");
const Subject = require("../models/subjectSchema.js");
const Teacher = require("../models/teacherSchema.js");

const sclassCreate = async (req, res) => {
  try {
    const sclass = new Sclass({
      sclassName: req.body.sclassName,
      school: req.body.adminID,
    });

    const existingSclassByName = await Sclass.findOne({
      sclassName: req.body.sclassName,
      school: req.body.adminID,
    });

    if (existingSclassByName) {
      return res.status(400).json({
        success: false,
        message: "Sorry this class name already exists",
      });
    }

    const result = await sclass.save();
    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating class",
      error: err.message,
    });
  }
};

const sclassList = async (req, res) => {
  try {
    let sclasses = await Sclass.find({ school: req.params.id });
    if (sclasses.length > 0) {
      res.json({
        success: true,
        data: sclasses,
      });
    } else {
      res.json({
        success: true,
        message: "No sclasses found",
        data: [],
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching classes",
      error: err.message,
    });
  }
};

const getSclassDetail = async (req, res) => {
  try {
    let sclass = await Sclass.findById(req.params.id);
    if (sclass) {
      sclass = await sclass.populate("school", "schoolName");
      res.json({
        success: true,
        data: sclass,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No class found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching class details",
      error: err.message,
    });
  }
};

const getSclassStudents = async (req, res) => {
  try {
    let students = await Student.find({ sclassName: req.params.id });
    if (students.length > 0) {
      let modifiedStudents = students.map((student) => {
        return { ...student._doc, password: undefined };
      });
      res.json({
        success: true,
        data: modifiedStudents,
      });
    } else {
      res.json({
        success: true,
        message: "No students found",
        data: [],
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: err.message,
    });
  }
};

const deleteSclass = async (req, res) => {
  try {
    const deletedClass = await Sclass.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    const deletedStudents = await Student.deleteMany({
      sclassName: req.params.id,
    });
    const deletedSubjects = await Subject.deleteMany({
      sclassName: req.params.id,
    });
    const deletedTeachers = await Teacher.deleteMany({
      teachSclass: req.params.id,
    });
    res.json({
      success: true,
      message: "Class and related data deleted successfully",
      data: deletedClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting class",
      error: error.message,
    });
  }
};

const deleteSclasses = async (req, res) => {
  try {
    const deletedClasses = await Sclass.deleteMany({ school: req.params.id });
    if (deletedClasses.deletedCount === 0) {
      return res.send({ message: "No classes found to delete" });
    }
    const deletedStudents = await Student.deleteMany({ school: req.params.id });
    const deletedSubjects = await Subject.deleteMany({ school: req.params.id });
    const deletedTeachers = await Teacher.deleteMany({ school: req.params.id });
    res.send(deletedClasses);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  sclassCreate,
  sclassList,
  deleteSclass,
  deleteSclasses,
  getSclassDetail,
  getSclassStudents,
};
