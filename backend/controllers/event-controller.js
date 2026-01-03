const Event = require("../models/eventSchema");

// Create Event
const createEvent = async (req, res, next) => {
  try {
    const event = new Event(req.body);
    const result = await event.save();

    await result.populate([
      { path: "school", select: "schoolName" },
      { path: "classes", select: "sclassName" },
    ]);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get All Events for School
const getSchoolEvents = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { type, status, startDate, endDate } = req.query;

    const query = { school: schoolId };
    if (type) query.type = type;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const events = await Event.find(query)
      .populate("classes", "sclassName")
      .sort({ startDate: 1 });

    res.json({
      success: true,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: err.message,
    });
  }
};

// Get Event Details
const getEventDetail = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("school", "schoolName")
      .populate("classes", "sclassName")
      .populate("organizer", "name email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching event details",
      error: err.message,
    });
  }
};

// Get User Events (Based on Role)
const getUserEvents = async (req, res) => {
  try {
    const { userId, role, schoolId } = req.query;

    const query = {
      school: schoolId,
      targetAudience: { $in: [role, "All"] },
    };

    const events = await Event.find(query)
      .populate("classes", "sclassName")
      .sort({ startDate: 1 });

    res.json({
      success: true,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching user events",
      error: err.message,
    });
  }
};

// Get Upcoming Events
const getUpcomingEvents = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find({
      school: schoolId,
      startDate: { $gte: today },
      status: { $ne: "Cancelled" },
    })
      .populate("classes", "sclassName")
      .sort({ startDate: 1 })
      .limit(10);

    res.json({
      success: true,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching upcoming events",
      error: err.message,
    });
  }
};

// Update Event
const updateEvent = async (req, res, next) => {
  try {
    const result = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate("school", "schoolName")
      .populate("classes", "sclassName");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Event
const deleteEvent = async (req, res, next) => {
  try {
    const result = await Event.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Cancel Event
const cancelEvent = async (req, res, next) => {
  try {
    const result = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "Cancelled" } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event cancelled successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEvent,
  getSchoolEvents,
  getEventDetail,
  getUserEvents,
  getUpcomingEvents,
  updateEvent,
  deleteEvent,
  cancelEvent,
};
