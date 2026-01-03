const router = require("express").Router();

// Import middleware
const { authenticateToken, authorizeRoles } = require("../middleware/auth.js");
const {
  validateAdminRegister,
  validateAdminLogin,
  validateStudentRegister,
  validateStudentLogin,
  validateTeacherRegister,
  validateTeacherLogin,
  validateMongoId,
  validateNotice,
  validateClass,
  validateSubject,
  handleValidationErrors,
} = require("../middleware/validators.js");

// Import controllers
const {
  adminRegister,
  adminLogIn,
  getAdminDetail,
} = require("../controllers/admin-controller.js");
const {
  sclassCreate,
  sclassList,
  deleteSclass,
  deleteSclasses,
  getSclassDetail,
  getSclassStudents,
} = require("../controllers/class-controller.js");
const {
  complainCreate,
  complainList,
} = require("../controllers/complain-controller.js");
const {
  noticeCreate,
  noticeList,
  deleteNotices,
  deleteNotice,
  updateNotice,
} = require("../controllers/notice-controller.js");
const {
  studentRegister,
  studentLogIn,
  getStudents,
  getStudentDetail,
  deleteStudents,
  deleteStudent,
  updateStudent,
  studentAttendance,
  deleteStudentsByClass,
  updateExamResult,
  clearAllStudentsAttendanceBySubject,
  clearAllStudentsAttendance,
  removeStudentAttendanceBySubject,
  removeStudentAttendance,
} = require("../controllers/student_controller.js");
const {
  subjectCreate,
  classSubjects,
  deleteSubjectsByClass,
  getSubjectDetail,
  deleteSubject,
  freeSubjectList,
  allSubjects,
  deleteSubjects,
} = require("../controllers/subject-controller.js");
const {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  deleteTeachers,
  deleteTeachersByClass,
  deleteTeacher,
  updateTeacherSubject,
  teacherAttendance,
} = require("../controllers/teacher-controller.js");

// ========== PUBLIC ROUTES (No Authentication Required) ==========

// Admin Authentication
router.post(
  "/AdminReg",
  validateAdminRegister,
  handleValidationErrors,
  adminRegister
);
router.post(
  "/AdminLogin",
  validateAdminLogin,
  handleValidationErrors,
  adminLogIn
);

// Student Authentication
router.post(
  "/StudentLogin",
  validateStudentLogin,
  handleValidationErrors,
  studentLogIn
);

// Teacher Authentication
router.post(
  "/TeacherLogin",
  validateTeacherLogin,
  handleValidationErrors,
  teacherLogIn
);

// ========== PROTECTED ROUTES (Authentication Required) ==========

// Admin Routes - Only Admin can access
router.get(
  "/Admin/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  getAdminDetail
);

// Student Routes
router.post(
  "/StudentReg",
  authenticateToken,
  authorizeRoles("Admin"),
  validateStudentRegister,
  handleValidationErrors,
  studentRegister
);
router.get(
  "/Students/:id",
  authenticateToken,
  authorizeRoles("Admin", "Teacher"),
  validateMongoId,
  handleValidationErrors,
  getStudents
);
router.get(
  "/Student/:id",
  authenticateToken,
  validateMongoId,
  handleValidationErrors,
  getStudentDetail
);
router.delete(
  "/Students/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteStudents
);
router.delete(
  "/StudentsClass/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteStudentsByClass
);
router.delete(
  "/Student/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteStudent
);
router.put(
  "/Student/:id",
  authenticateToken,
  validateMongoId,
  handleValidationErrors,
  updateStudent
);
router.put(
  "/UpdateExamResult/:id",
  authenticateToken,
  authorizeRoles("Admin", "Teacher"),
  validateMongoId,
  handleValidationErrors,
  updateExamResult
);
router.put(
  "/StudentAttendance/:id",
  authenticateToken,
  authorizeRoles("Teacher", "Admin"),
  validateMongoId,
  handleValidationErrors,
  studentAttendance
);
router.put(
  "/RemoveAllStudentsSubAtten/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  clearAllStudentsAttendanceBySubject
);
router.put(
  "/RemoveAllStudentsAtten/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  clearAllStudentsAttendance
);
router.put(
  "/RemoveStudentSubAtten/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  removeStudentAttendanceBySubject
);
router.put(
  "/RemoveStudentAtten/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  removeStudentAttendance
);

// Teacher Routes
router.post(
  "/TeacherReg",
  authenticateToken,
  authorizeRoles("Admin"),
  validateTeacherRegister,
  handleValidationErrors,
  teacherRegister
);
router.get(
  "/Teachers/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  getTeachers
);
router.get(
  "/Teacher/:id",
  authenticateToken,
  validateMongoId,
  handleValidationErrors,
  getTeacherDetail
);
router.delete(
  "/Teachers/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteTeachers
);
router.delete(
  "/TeachersClass/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteTeachersByClass
);
router.delete(
  "/Teacher/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteTeacher
);
router.put(
  "/TeacherSubject",
  authenticateToken,
  authorizeRoles("Admin"),
  updateTeacherSubject
);
router.post(
  "/TeacherAttendance/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  teacherAttendance
);

// Notice Routes
router.post(
  "/NoticeCreate",
  authenticateToken,
  authorizeRoles("Admin"),
  validateNotice,
  handleValidationErrors,
  noticeCreate
);
router.get(
  "/NoticeList/:id",
  authenticateToken,
  validateMongoId,
  handleValidationErrors,
  noticeList
);
router.delete(
  "/Notices/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteNotices
);
router.delete(
  "/Notice/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteNotice
);
router.put(
  "/Notice/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  updateNotice
);

// Complain Routes
router.post("/ComplainCreate", authenticateToken, complainCreate);
router.get(
  "/ComplainList/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  complainList
);

// Class Routes
router.post(
  "/SclassCreate",
  authenticateToken,
  authorizeRoles("Admin"),
  validateClass,
  handleValidationErrors,
  sclassCreate
);
router.get(
  "/SclassList/:id",
  authenticateToken,
  validateMongoId,
  handleValidationErrors,
  sclassList
);
router.get(
  "/Sclass/:id",
  authenticateToken,
  validateMongoId,
  handleValidationErrors,
  getSclassDetail
);
router.get(
  "/Sclass/Students/:id",
  authenticateToken,
  validateMongoId,
  handleValidationErrors,
  getSclassStudents
);
router.delete(
  "/Sclasses/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteSclasses
);
router.delete(
  "/Sclass/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteSclass
);

// Subject Routes
router.post(
  "/SubjectCreate",
  authenticateToken,
  authorizeRoles("Admin"),
  validateSubject,
  handleValidationErrors,
  subjectCreate
);
router.get(
  "/AllSubjects/:id",
  authenticateToken,
  validateMongoId,
  handleValidationErrors,
  allSubjects
);
router.get(
  "/ClassSubjects/:id",
  authenticateToken,
  validateMongoId,
  handleValidationErrors,
  classSubjects
);
router.get(
  "/FreeSubjectList/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  freeSubjectList
);
router.get(
  "/Subject/:id",
  authenticateToken,
  validateMongoId,
  handleValidationErrors,
  getSubjectDetail
);
router.delete(
  "/Subject/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteSubject
);
router.delete(
  "/Subjects/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteSubjects
);
router.delete(
  "/SubjectsClass/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateMongoId,
  handleValidationErrors,
  deleteSubjectsByClass
);

// ========== NEW FEATURES ROUTES ==========

// Parent Routes
const {
  parentRegister,
  parentLogin,
  getParentDetail,
  linkChildToParent,
  updateParent,
  deleteParent,
  getParents,
} = require("../controllers/parent-controller.js");

router.post(
  "/ParentReg",
  authenticateToken,
  authorizeRoles("Admin"),
  parentRegister
);
router.post("/ParentLogin", parentLogin);
router.get("/Parent/:id", authenticateToken, getParentDetail);
router.post(
  "/LinkChild",
  authenticateToken,
  authorizeRoles("Admin"),
  linkChildToParent
);
router.put("/Parent/:id", authenticateToken, updateParent);
router.delete(
  "/Parent/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteParent
);
router.get(
  "/Parents/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  getParents
);

// Assignment Routes
const {
  createAssignment,
  getAssignments,
  getAssignmentDetail,
  getStudentAssignments,
  submitAssignment,
  gradeAssignment,
  updateAssignment,
  deleteAssignment,
  getTeacherAssignments,
  getAssignmentsBySubject,
} = require("../controllers/assignment-controller.js");

router.post(
  "/AssignmentCreate",
  authenticateToken,
  authorizeRoles("Teacher", "Admin"),
  createAssignment
);
router.get("/Assignments/:classId", authenticateToken, getAssignments);
router.get("/Assignment/:id", authenticateToken, getAssignmentDetail);
router.get(
  "/StudentAssignments/:studentId",
  authenticateToken,
  getStudentAssignments
);
// Alias routes for consistency
router.get(
  "/AssignmentList/:studentId",
  authenticateToken,
  getStudentAssignments
);
router.get(
  "/SubjectList/:subjectId",
  authenticateToken,
  getAssignmentsBySubject
);
router.get(
  "/TeacherAssignments/:teacherId",
  authenticateToken,
  authorizeRoles("Teacher", "Admin"),
  getTeacherAssignments
);
router.post(
  "/AssignmentSubmit",
  authenticateToken,
  authorizeRoles("Student"),
  submitAssignment
);
router.put(
  "/AssignmentGrade",
  authenticateToken,
  authorizeRoles("Teacher"),
  gradeAssignment
);
router.put(
  "/Assignment/:id",
  authenticateToken,
  authorizeRoles("Teacher", "Admin"),
  updateAssignment
);
router.delete(
  "/Assignment/:id",
  authenticateToken,
  authorizeRoles("Teacher", "Admin"),
  deleteAssignment
);

// Timetable Routes
const {
  createTimetable,
  getTimetable,
  getTeacherTimetable,
  updateTimetable,
  deleteTimetable,
  getSchoolTimetables,
  getTimetableByClass,
} = require("../controllers/timetable-controller.js");

router.post(
  "/TimetableCreate",
  authenticateToken,
  authorizeRoles("Admin"),
  createTimetable
);
router.get("/Timetable", authenticateToken, getTimetable);
router.get(
  "/TeacherTimetable/:teacherId",
  authenticateToken,
  getTeacherTimetable
);
router.put(
  "/Timetable/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  updateTimetable
);
router.delete(
  "/Timetable/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteTimetable
);
router.get(
  "/SchoolTimetables/:schoolId",
  authenticateToken,
  getSchoolTimetables
);
// Alias routes for consistency
router.get("/TimetableList/:id", authenticateToken, getTimetable);
router.get("/StudentTimetableList/:id", authenticateToken, getTimetable);
router.get("/TimetableSclass/:classId", authenticateToken, getTimetableByClass);

// Fee Routes
const {
  createFeeRecord,
  getStudentFees,
  getClassFees,
  getSchoolFeesSummary,
  addPayment,
  updateFeeRecord,
  deleteFeeRecord,
  applyDiscount,
  generateFeeReport,
} = require("../controllers/fee-controller.js");

router.post(
  "/FeeCreate",
  authenticateToken,
  authorizeRoles("Admin"),
  createFeeRecord
);
router.get("/StudentFees/:studentId", authenticateToken, getStudentFees);
// Alias routes for consistency
router.get("/FeeList/:studentId", authenticateToken, getStudentFees);
router.get(
  "/ClassFees/:classId",
  authenticateToken,
  authorizeRoles("Admin", "Teacher"),
  getClassFees
);
router.get(
  "/SchoolFeesSummary/:schoolId",
  authenticateToken,
  authorizeRoles("Admin"),
  getSchoolFeesSummary
);
router.post(
  "/PaymentAdd",
  authenticateToken,
  authorizeRoles("Admin"),
  addPayment
);
router.put(
  "/Fee/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  updateFeeRecord
);
router.delete(
  "/Fee/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteFeeRecord
);
router.post(
  "/ApplyDiscount",
  authenticateToken,
  authorizeRoles("Admin"),
  applyDiscount
);
router.get(
  "/FeeReport",
  authenticateToken,
  authorizeRoles("Admin"),
  generateFeeReport
);

// Event Routes
const {
  createEvent,
  getSchoolEvents,
  getEventDetail,
  getUserEvents,
  getUpcomingEvents,
  updateEvent,
  deleteEvent,
  cancelEvent,
} = require("../controllers/event-controller.js");

router.post(
  "/EventCreate",
  authenticateToken,
  authorizeRoles("Admin", "Teacher"),
  createEvent
);
router.get("/SchoolEvents/:schoolId", authenticateToken, getSchoolEvents);
// Alias routes for consistency
router.get("/EventList/:schoolId", authenticateToken, getSchoolEvents);
router.get("/Event/:id", authenticateToken, getEventDetail);
router.get("/UserEvents", authenticateToken, getUserEvents);
router.get("/UpcomingEvents/:schoolId", authenticateToken, getUpcomingEvents);
router.put(
  "/Event/:id",
  authenticateToken,
  authorizeRoles("Admin", "Teacher"),
  updateEvent
);
router.delete(
  "/Event/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteEvent
);
router.put(
  "/EventCancel/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  cancelEvent
);

// Message Routes
const {
  sendMessage,
  getInboxMessages,
  getSentMessages,
  getMessageDetail,
  markAsRead,
  getUnreadCount,
  getConversation,
  replyToMessage,
  deleteMessage,
  bulkDeleteMessages,
} = require("../controllers/message-controller.js");

router.post("/MessageSend", authenticateToken, sendMessage);
router.get("/InboxMessages", authenticateToken, getInboxMessages);
// Alias routes for consistency
router.get("/MessageList/:id", authenticateToken, getInboxMessages);
router.get("/SentMessages", authenticateToken, getSentMessages);
router.get("/Message/:id", authenticateToken, getMessageDetail);
router.put("/MessageRead/:id", authenticateToken, markAsRead);
router.get("/UnreadCount", authenticateToken, getUnreadCount);
router.get("/Conversation", authenticateToken, getConversation);
router.post("/MessageReply/:id", authenticateToken, replyToMessage);
router.delete("/Message/:id", authenticateToken, deleteMessage);
router.post("/BulkDeleteMessages", authenticateToken, bulkDeleteMessages);

// Library Routes
const {
  addBook,
  getAllBooks,
  getBookDetail,
  updateBook,
  deleteBook,
  searchBooks,
  issueBook,
  returnBook,
  getUserBorrowedBooks,
  getSchoolBorrows,
  getOverdueBooks,
  payFine,
  getLibraryStats,
} = require("../controllers/library-controller.js");

router.post("/BookAdd", authenticateToken, authorizeRoles("Admin"), addBook);
router.get("/Books", authenticateToken, getAllBooks);
// Alias routes for consistency
router.get("/LibraryList/:id", authenticateToken, getAllBooks);
router.get("/Book/:id", authenticateToken, getBookDetail);
router.put("/Book/:id", authenticateToken, authorizeRoles("Admin"), updateBook);
router.delete(
  "/Book/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  deleteBook
);
router.get("/SearchBooks", authenticateToken, searchBooks);
router.post(
  "/BookIssue",
  authenticateToken,
  authorizeRoles("Admin"),
  issueBook
);
router.post(
  "/BookReturn",
  authenticateToken,
  authorizeRoles("Admin"),
  returnBook
);
router.get("/UserBorrowedBooks", authenticateToken, getUserBorrowedBooks);
router.get(
  "/SchoolBorrows/:schoolId",
  authenticateToken,
  authorizeRoles("Admin"),
  getSchoolBorrows
);
router.get(
  "/OverdueBooks/:schoolId",
  authenticateToken,
  authorizeRoles("Admin"),
  getOverdueBooks
);
router.post("/PayFine", authenticateToken, payFine);
router.get(
  "/LibraryStats/:schoolId",
  authenticateToken,
  authorizeRoles("Admin"),
  getLibraryStats
);

// Settings Routes
const {
  updateProfile,
  changePassword,
  updatePreferences,
  uploadProfilePicture,
  addNotification,
  getNotifications,
  markNotificationRead,
  clearAllNotifications,
} = require("../controllers/settings-controller.js");

router.put("/UpdateProfile", authenticateToken, updateProfile);
router.post("/ChangePassword", authenticateToken, changePassword);
router.put("/UpdatePreferences", authenticateToken, updatePreferences);
router.post("/UploadProfilePicture", authenticateToken, uploadProfilePicture);
router.post("/AddNotification", authenticateToken, addNotification);
router.get("/Notifications", authenticateToken, getNotifications);
router.put("/MarkNotificationRead", authenticateToken, markNotificationRead);
router.delete("/ClearNotifications", authenticateToken, clearAllNotifications);

// Report Card Routes
const {
  generateReportCard,
  generatePDFReportCard,
  getClassReportCards,
} = require("../controllers/report-controller.js");

router.get("/ReportCard/:studentId", authenticateToken, generateReportCard);
router.get(
  "/ReportCardPDF/:studentId",
  authenticateToken,
  generatePDFReportCard
);
router.get(
  "/ClassReportCards/:classId",
  authenticateToken,
  authorizeRoles("Admin", "Teacher"),
  getClassReportCards
);

module.exports = router;

router.delete("/Subject/:id", deleteSubject);
router.delete("/Subjects/:id", deleteSubjects);
router.delete("/SubjectsClass/:id", deleteSubjectsByClass);

module.exports = router;
