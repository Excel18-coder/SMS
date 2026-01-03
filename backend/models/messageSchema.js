const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
      required: true,
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["admin", "teacher", "student", "parent"],
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientModel",
      required: true,
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ["admin", "teacher", "student", "parent"],
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Urgent"],
      default: "Normal",
    },
    category: {
      type: String,
      enum: [
        "Academic",
        "Attendance",
        "Fees",
        "Discipline",
        "General",
        "Event",
      ],
      default: "General",
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);
