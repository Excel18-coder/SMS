const Complain = require("../models/complainSchema.js");

const complainCreate = async (req, res) => {
  try {
    const complain = new Complain(req.body);
    const result = await complain.save();
    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error submitting complaint",
      error: err.message,
    });
  }
};

const complainList = async (req, res) => {
  try {
    let complains = await Complain.find({ school: req.params.id }).populate(
      "user",
      "name"
    );
    res.json({
      success: true,
      data: complains,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching complaints",
      error: err.message,
    });
  }
};

module.exports = { complainCreate, complainList };
