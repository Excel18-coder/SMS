const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    profilePicture: {
      type: String,
    },
    qualification: {
      degree: String,
      specialization: String,
      university: String,
      year: Number,
    },
    experience: {
      type: Number, // Years of experience
      default: 0,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
    },
    role: {
      type: String,
      default: "Teacher",
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    teachSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
    },
    teachSclass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass",
      required: true,
    },
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        presentCount: {
          type: String,
        },
        absentCount: {
          type: String,
        },
        status: {
          type: String,
          enum: ["Present", "Absent", "Leave", "Half-Day"],
          default: "Present",
        },
      },
    ],
    notifications: [
      {
        title: String,
        message: String,
        read: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("teacher", teacherSchema);
