const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass",
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    schedule: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          required: true,
        },
        periods: [
          {
            periodNumber: {
              type: Number,
              required: true,
            },
            startTime: {
              type: String,
              required: true, // Format: "09:00"
            },
            endTime: {
              type: String,
              required: true, // Format: "09:45"
            },
            subject: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "subject",
            },
            teacher: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "teacher",
            },
            room: {
              type: String,
            },
            type: {
              type: String,
              enum: ["Class", "Break", "Lunch", "Assembly"],
              default: "Class",
            },
          },
        ],
      },
    ],
    academicYear: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      enum: ["First Term", "Second Term", "Third Term"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("timetable", timetableSchema);
