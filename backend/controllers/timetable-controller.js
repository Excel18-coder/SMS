const Timetable = require("../models/timetableSchema");

// Create Timetable
const createTimetable = async (req, res, next) => {
  try {
    const existingTimetable = await Timetable.findOne({
      class: req.body.class,
      academicYear: req.body.academicYear,
      term: req.body.term,
    });

    if (existingTimetable) {
      return res.status(400).json({
        success: false,
        message: "Timetable already exists for this class, year and term",
      });
    }

    const timetable = new Timetable(req.body);
    const result = await timetable.save();

    await result.populate([
      { path: "class", select: "sclassName" },
      { path: "schedule.periods.subject", select: "subName subCode" },
      { path: "schedule.periods.teacher", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      message: "Timetable created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get Timetable for a Class
const getTimetable = async (req, res) => {
  try {
    const { classId, academicYear, term } = req.query;

    const query = { class: classId };
    if (academicYear) query.academicYear = academicYear;
    if (term) query.term = term;

    const timetable = await Timetable.findOne(query)
      .populate("class", "sclassName")
      .populate("schedule.periods.subject", "subName subCode")
      .populate("schedule.periods.teacher", "name email");

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    res.json({
      success: true,
      data: timetable,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching timetable",
      error: err.message,
    });
  }
};

// Get Teacher's Timetable
const getTeacherTimetable = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const timetables = await Timetable.find({
      "schedule.periods.teacher": teacherId,
      isActive: true,
    })
      .populate("class", "sclassName")
      .populate("schedule.periods.subject", "subName subCode")
      .populate("schedule.periods.teacher", "name email");

    // Filter to only include periods where this teacher teaches
    const teacherSchedule = timetables.map((timetable) => {
      const filteredSchedule = timetable.schedule
        .map((day) => ({
          day: day.day,
          periods: day.periods.filter(
            (period) =>
              period.teacher && period.teacher._id.toString() === teacherId
          ),
        }))
        .filter((day) => day.periods.length > 0);

      return {
        class: timetable.class,
        schedule: filteredSchedule,
        academicYear: timetable.academicYear,
        term: timetable.term,
      };
    });

    res.json({
      success: true,
      data: teacherSchedule,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching teacher timetable",
      error: err.message,
    });
  }
};

// Update Timetable
const updateTimetable = async (req, res, next) => {
  try {
    const result = await Timetable.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate("class", "sclassName")
      .populate("schedule.periods.subject", "subName subCode")
      .populate("schedule.periods.teacher", "name email");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Timetable
const deleteTimetable = async (req, res, next) => {
  try {
    const result = await Timetable.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Timetable deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get All Timetables for a School
const getSchoolTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find({ school: req.params.schoolId })
      .populate("class", "sclassName")
      .sort({ "class.sclassName": 1 });

    res.json({
      success: true,
      data: timetables,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching timetables",
      error: err.message,
    });
  }
};

// Get Timetable by Class ID (for path-based routing)
const getTimetableByClass = async (req, res) => {
  try {
    const timetable = await Timetable.findOne({
      class: req.params.classId,
      isActive: true,
    })
      .populate("class", "sclassName")
      .populate("schedule.periods.subject", "subName subCode")
      .populate("schedule.periods.teacher", "name email")
      .sort({ createdAt: -1 });

    if (!timetable) {
      return res.json({
        success: true,
        data: [],
        message: "No timetable found for this class",
      });
    }

    res.json({
      success: true,
      data: timetable,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching timetable",
      error: err.message,
    });
  }
};

module.exports = {
  createTimetable,
  getTimetable,
  getTeacherTimetable,
  updateTimetable,
  deleteTimetable,
  getSchoolTimetables,
  getTimetableByClass,
};
