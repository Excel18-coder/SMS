const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: [
        "Holiday",
        "Exam",
        "Meeting",
        "Sports",
        "Cultural",
        "PTA",
        "Other",
      ],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startTime: String,
    endTime: String,
    location: String,
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    targetAudience: {
      type: [String],
      enum: ["All", "Students", "Teachers", "Parents", "Admin"],
      default: ["All"],
    },
    classes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sclass",
      },
    ],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "organizerModel",
    },
    organizerModel: {
      type: String,
      enum: ["admin", "teacher"],
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
    },
    status: {
      type: String,
      enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);
