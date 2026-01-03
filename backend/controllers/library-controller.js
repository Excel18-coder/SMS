const { Book, Borrow } = require("../models/librarySchema");
const mongoose = require("mongoose");

// ========== BOOK MANAGEMENT ==========

// Add Book
const addBook = async (req, res, next) => {
  try {
    const book = new Book(req.body);

    // Set available copies equal to total copies initially
    if (!book.availableCopies) {
      book.availableCopies = book.totalCopies;
    }

    const result = await book.save();

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: result,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Book with this ISBN already exists",
      });
    }
    next(err);
  }
};

// Get All Books
const getAllBooks = async (req, res) => {
  try {
    const { schoolId, category, available } = req.query;

    const query = { school: schoolId };
    if (category) query.category = category;
    if (available === "true") query.availableCopies = { $gt: 0 };

    const books = await Book.find(query).sort({ title: 1 });

    res.json({
      success: true,
      data: books,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching books",
      error: err.message,
    });
  }
};

// Get Book Details
const getBookDetail = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching book details",
      error: err.message,
    });
  }
};

// Update Book
const updateBook = async (req, res, next) => {
  try {
    const result = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Book
const deleteBook = async (req, res, next) => {
  try {
    // Check if book is currently borrowed
    const activeBorrows = await Borrow.countDocuments({
      book: req.params.id,
      status: "Borrowed",
    });

    if (activeBorrows > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete book. It is currently borrowed.",
      });
    }

    const result = await Book.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Search Books
const searchBooks = async (req, res) => {
  try {
    const { schoolId, query } = req.query;

    const books = await Book.find({
      school: schoolId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { isbn: { $regex: query, $options: "i" } },
      ],
    }).limit(20);

    res.json({
      success: true,
      data: books,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error searching books",
      error: err.message,
    });
  }
};

// ========== BORROW MANAGEMENT ==========

// Issue Book
const issueBook = async (req, res, next) => {
  try {
    const { bookId, borrowerId, borrowerModel, dueDate, issuedBy } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is not available",
      });
    }

    // Check if borrower already has this book
    const existingBorrow = await Borrow.findOne({
      book: bookId,
      borrower: borrowerId,
      status: "Borrowed",
    });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: "Borrower already has this book",
      });
    }

    // Create borrow record
    const borrow = new Borrow({
      book: bookId,
      borrower: borrowerId,
      borrowerModel,
      school: book.school,
      dueDate,
      issuedBy,
    });

    await borrow.save();

    // Update book available copies
    book.availableCopies -= 1;
    await book.save();

    await borrow.populate([
      { path: "book", select: "title author isbn" },
      { path: "borrower", select: "name email rollNum" },
    ]);

    res.status(201).json({
      success: true,
      message: "Book issued successfully",
      data: borrow,
    });
  } catch (err) {
    next(err);
  }
};

// Return Book
const returnBook = async (req, res, next) => {
  try {
    const { borrowId, returnedTo, remarks } = req.body;

    const borrow = await Borrow.findById(borrowId).populate("book");

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found",
      });
    }

    if (borrow.status !== "Borrowed") {
      return res.status(400).json({
        success: false,
        message: "Book already returned",
      });
    }

    // Calculate fine if overdue
    const today = new Date();
    const dueDate = new Date(borrow.dueDate);

    if (today > dueDate) {
      const daysLate = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      const finePerDay = 5; // $5 per day
      const fineAmount = daysLate * finePerDay;

      borrow.fine = {
        amount: fineAmount,
        paid: false,
      };
    }

    borrow.returnDate = today;
    borrow.status = "Returned";
    borrow.returnedTo = returnedTo;
    borrow.remarks = remarks;

    await borrow.save();

    // Update book available copies
    const book = await Book.findById(borrow.book._id);
    book.availableCopies += 1;
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
      data: borrow,
    });
  } catch (err) {
    next(err);
  }
};

// Get User's Borrowed Books
const getUserBorrowedBooks = async (req, res) => {
  try {
    const { userId, userModel } = req.query;

    const borrows = await Borrow.find({
      borrower: userId,
      borrowerModel: userModel,
    })
      .populate("book")
      .sort({ borrowDate: -1 });

    res.json({
      success: true,
      data: borrows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching borrowed books",
      error: err.message,
    });
  }
};

// Get All Borrows for School
const getSchoolBorrows = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { status } = req.query;

    const query = { school: schoolId };
    if (status) query.status = status;

    const borrows = await Borrow.find(query)
      .populate("book", "title author isbn")
      .populate("borrower", "name email rollNum")
      .sort({ borrowDate: -1 });

    res.json({
      success: true,
      data: borrows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching borrow records",
      error: err.message,
    });
  }
};

// Get Overdue Books
const getOverdueBooks = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const today = new Date();

    const borrows = await Borrow.find({
      school: schoolId,
      status: "Borrowed",
      dueDate: { $lt: today },
    })
      .populate("book", "title author")
      .populate("borrower", "name email phone rollNum");

    res.json({
      success: true,
      data: borrows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching overdue books",
      error: err.message,
    });
  }
};

// Pay Fine
const payFine = async (req, res, next) => {
  try {
    const { borrowId } = req.body;

    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found",
      });
    }

    if (!borrow.fine || borrow.fine.amount === 0) {
      return res.status(400).json({
        success: false,
        message: "No fine to pay",
      });
    }

    borrow.fine.paid = true;
    borrow.fine.paidDate = new Date();
    await borrow.save();

    res.status(200).json({
      success: true,
      message: "Fine paid successfully",
      data: borrow,
    });
  } catch (err) {
    next(err);
  }
};

// Get Library Statistics
const getLibraryStats = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const totalBooks = await Book.countDocuments({ school: schoolId });
    const availableBooks = await Book.aggregate([
      { $match: { school: mongoose.Types.ObjectId(schoolId) } },
      { $group: { _id: null, total: { $sum: "$availableCopies" } } },
    ]);

    const borrowedBooks = await Borrow.countDocuments({
      school: schoolId,
      status: "Borrowed",
    });

    const overdueBooks = await Borrow.countDocuments({
      school: schoolId,
      status: "Borrowed",
      dueDate: { $lt: new Date() },
    });

    const unpaidFines = await Borrow.aggregate([
      {
        $match: {
          school: mongoose.Types.ObjectId(schoolId),
          "fine.paid": false,
          "fine.amount": { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalFines: { $sum: "$fine.amount" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalBooks,
        availableBooks: availableBooks[0]?.total || 0,
        borrowedBooks,
        overdueBooks,
        unpaidFines: unpaidFines[0]?.totalFines || 0,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching library statistics",
      error: err.message,
    });
  }
};

module.exports = {
  // Book operations
  addBook,
  getAllBooks,
  getBookDetail,
  updateBook,
  deleteBook,
  searchBooks,
  // Borrow operations
  issueBook,
  returnBook,
  getUserBorrowedBooks,
  getSchoolBorrows,
  getOverdueBooks,
  payFine,
  getLibraryStats,
};
