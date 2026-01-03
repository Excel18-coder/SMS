const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rollNum: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      sparse: true,
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
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    profilePicture: {
      type: String,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    guardianInfo: {
      fatherName: String,
      fatherPhone: String,
      fatherOccupation: String,
      motherName: String,
      motherPhone: String,
      motherOccupation: String,
      emergencyContact: String,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "parent",
    },
    sclassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass",
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    role: {
      type: String,
      default: "Student",
    },
    examResult: [
      {
        subName: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "subject",
        },
        marksObtained: {
          type: Number,
          default: 0,
        },
        totalMarks: {
          type: Number,
          default: 100,
        },
        examDate: Date,
        examType: {
          type: String,
          enum: ["Quiz", "Mid-Term", "Final", "Assignment", "Project"],
        },
      },
    ],
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent", "Late", "Excused"],
          required: true,
        },
        subName: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "subject",
          required: true,
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
      smsNotifications: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("student", studentSchema);
