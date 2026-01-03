const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    feeStructure: {
      tuitionFee: {
        type: Number,
        default: 0,
      },
      transportFee: {
        type: Number,
        default: 0,
      },
      libraryFee: {
        type: Number,
        default: 0,
      },
      labFee: {
        type: Number,
        default: 0,
      },
      sportsFee: {
        type: Number,
        default: 0,
      },
      otherFees: [
        {
          description: String,
          amount: Number,
        },
      ],
    },
    totalFee: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
    },
    payments: [
      {
        amount: {
          type: Number,
          required: true,
        },
        paymentDate: {
          type: Date,
          default: Date.now,
        },
        paymentMethod: {
          type: String,
          enum: ["Cash", "Card", "Bank Transfer", "Online", "Cheque"],
        },
        transactionId: String,
        receiptNumber: String,
        remarks: String,
        receivedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "admin",
        },
      },
    ],
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Partial", "Pending", "Overdue"],
      default: "Pending",
    },
    discount: {
      amount: Number,
      reason: String,
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate remaining amount
feeSchema.pre("save", function (next) {
  this.remainingAmount = this.totalFee - this.paidAmount;

  // Update status based on payment
  if (this.paidAmount >= this.totalFee) {
    this.status = "Paid";
  } else if (this.paidAmount > 0) {
    this.status = "Partial";
  } else if (new Date() > this.dueDate) {
    this.status = "Overdue";
  } else {
    this.status = "Pending";
  }

  next();
});

module.exports = mongoose.model("fee", feeSchema);
