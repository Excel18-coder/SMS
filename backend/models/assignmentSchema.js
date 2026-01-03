const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    maxMarks: {
      type: Number,
      default: 100,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "student",
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["Submitted", "Late", "Not Submitted"],
          default: "Not Submitted",
        },
        attachments: [
          {
            fileName: String,
            fileUrl: String,
          },
        ],
        marksObtained: {
          type: Number,
        },
        feedback: {
          type: String,
        },
        gradedAt: Date,
        gradedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "teacher",
        },
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Closed", "Draft"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("assignment", assignmentSchema);
