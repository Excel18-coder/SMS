const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Science",
        "Mathematics",
        "History",
        "Literature",
        "Reference",
        "Other",
      ],
    },
    publisher: String,
    publishYear: Number,
    totalCopies: {
      type: Number,
      required: true,
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    location: {
      shelf: String,
      row: String,
    },
    description: String,
    coverImage: String,
  },
  { timestamps: true }
);

const borrowSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "borrowerModel",
      required: true,
    },
    borrowerModel: {
      type: String,
      required: true,
      enum: ["student", "teacher"],
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: Date,
    status: {
      type: String,
      enum: ["Borrowed", "Returned", "Overdue", "Lost"],
      default: "Borrowed",
    },
    fine: {
      amount: Number,
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: Date,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
    returnedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
    remarks: String,
  },
  { timestamps: true }
);

const Book = mongoose.model("book", bookSchema);
const Borrow = mongoose.model("borrow", borrowSchema);

module.exports = { Book, Borrow };
