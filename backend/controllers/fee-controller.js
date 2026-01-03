const Fee = require("../models/feeSchema");
const Student = require("../models/studentSchema");

// Create Fee Record
const createFeeRecord = async (req, res, next) => {
  try {
    const fee = new Fee(req.body);
    const result = await fee.save();

    await result.populate([
      { path: "student", select: "name rollNum" },
      { path: "class", select: "sclassName" },
    ]);

    res.status(201).json({
      success: true,
      message: "Fee record created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get Student Fee Details
const getStudentFees = async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId })
      .populate("class", "sclassName")
      .sort({ academicYear: -1, createdAt: -1 });

    res.json({
      success: true,
      data: fees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching fee details",
      error: err.message,
    });
  }
};

// Get Class Fees
const getClassFees = async (req, res) => {
  try {
    const fees = await Fee.find({ class: req.params.classId })
      .populate("student", "name rollNum")
      .sort({ "student.rollNum": 1 });

    res.json({
      success: true,
      data: fees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching class fees",
      error: err.message,
    });
  }
};

// Get School Fees Summary
const getSchoolFeesSummary = async (req, res) => {
  try {
    const fees = await Fee.find({ school: req.params.schoolId });

    const summary = {
      totalExpected: 0,
      totalCollected: 0,
      totalPending: 0,
      paidCount: 0,
      partialCount: 0,
      pendingCount: 0,
      overdueCount: 0,
    };

    fees.forEach((fee) => {
      summary.totalExpected += fee.totalFee;
      summary.totalCollected += fee.paidAmount;
      summary.totalPending += fee.remainingAmount;

      switch (fee.status) {
        case "Paid":
          summary.paidCount++;
          break;
        case "Partial":
          summary.partialCount++;
          break;
        case "Pending":
          summary.pendingCount++;
          break;
        case "Overdue":
          summary.overdueCount++;
          break;
      }
    });

    res.json({
      success: true,
      data: summary,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching fees summary",
      error: err.message,
    });
  }
};

// Add Payment
const addPayment = async (req, res, next) => {
  try {
    const {
      feeId,
      amount,
      paymentMethod,
      transactionId,
      receiptNumber,
      remarks,
      receivedBy,
    } = req.body;

    const fee = await Fee.findById(feeId);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0",
      });
    }

    if (fee.paidAmount + amount > fee.totalFee) {
      return res.status(400).json({
        success: false,
        message: "Payment amount exceeds remaining fee",
      });
    }

    fee.payments.push({
      amount,
      paymentMethod,
      transactionId,
      receiptNumber,
      remarks,
      receivedBy,
      paymentDate: new Date(),
    });

    fee.paidAmount += amount;
    await fee.save();

    res.status(200).json({
      success: true,
      message: "Payment recorded successfully",
      data: fee,
    });
  } catch (err) {
    next(err);
  }
};

// Update Fee Record
const updateFeeRecord = async (req, res, next) => {
  try {
    const result = await Fee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate("student", "name rollNum")
      .populate("class", "sclassName");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee record updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Fee Record
const deleteFeeRecord = async (req, res, next) => {
  try {
    const result = await Fee.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fee record deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Apply Discount
const applyDiscount = async (req, res, next) => {
  try {
    const { feeId, amount, reason } = req.body;

    const fee = await Fee.findById(feeId);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    fee.discount = { amount, reason };
    fee.totalFee -= amount;
    await fee.save();

    res.status(200).json({
      success: true,
      message: "Discount applied successfully",
      data: fee,
    });
  } catch (err) {
    next(err);
  }
};

// Generate Fee Report
const generateFeeReport = async (req, res) => {
  try {
    const { schoolId, academicYear, status } = req.query;

    const query = { school: schoolId };
    if (academicYear) query.academicYear = academicYear;
    if (status) query.status = status;

    const fees = await Fee.find(query)
      .populate("student", "name rollNum")
      .populate("class", "sclassName");

    res.json({
      success: true,
      data: fees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error generating fee report",
      error: err.message,
    });
  }
};

module.exports = {
  createFeeRecord,
  getStudentFees,
  getClassFees,
  getSchoolFeesSummary,
  addPayment,
  updateFeeRecord,
  deleteFeeRecord,
  applyDiscount,
  generateFeeReport,
};
