const Notice = require("../models/noticeSchema.js");

const noticeCreate = async (req, res) => {
  try {
    const notice = new Notice({
      ...req.body,
      school: req.body.adminID,
    });
    const result = await notice.save();
    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating notice",
      error: err.message,
    });
  }
};

const noticeList = async (req, res) => {
  try {
    let notices = await Notice.find({ school: req.params.id });
    res.json({
      success: true,
      data: notices,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching notices",
      error: err.message,
    });
  }
};

const updateNotice = async (req, res) => {
  try {
    const result = await Notice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }
    res.json({
      success: true,
      message: "Notice updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notice",
      error: error.message,
    });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const result = await Notice.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }
    res.json({
      success: true,
      message: "Notice deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notice",
      error: error.message,
    });
  }
};

const deleteNotices = async (req, res) => {
  try {
    const result = await Notice.deleteMany({ school: req.params.id });
    if (result.deletedCount === 0) {
      return res.json({
        success: true,
        message: "No notices found to delete",
        data: { deletedCount: 0 },
      });
    } else {
      res.json({
        success: true,
        message: `${result.deletedCount} notices deleted successfully`,
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notices",
      error: error.message,
    });
  }
};

module.exports = {
  noticeCreate,
  noticeList,
  updateNotice,
  deleteNotice,
  deleteNotices,
};
