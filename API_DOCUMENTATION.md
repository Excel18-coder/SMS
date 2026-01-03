# School Management System - API Documentation

## Base URL

```
http://localhost:5000
```

## Response Format

All API responses follow this standard format:

```json
{
  "success": true/false,
  "message": "Description of the result",
  "data": {} // Response data (if applicable)
}
```

---

## Authentication

### Headers Required for Protected Routes

```
Authorization: Bearer <JWT_TOKEN>
```

### Login Responses Include

```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE",
  "role": "Admin/Teacher/Student/Parent",
  "_id": "USER_ID"
  // ... other user details
}
```

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Admin Login

```http
POST /AdminLogin
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "password123"
}
```

### 1.2 Teacher Login

```http
POST /TeacherLogin
Content-Type: application/json

{
  "email": "teacher@school.com",
  "password": "password123"
}
```

### 1.3 Student Login

```http
POST /StudentLogin
Content-Type: application/json

{
  "rollNum": 101,
  "studentName": "John Doe",
  "password": "password123"
}
```

### 1.4 Parent Login ✨ NEW

```http
POST /ParentLogin
Content-Type: application/json

{
  "email": "parent@email.com",
  "password": "password123"
}
```

### 1.5 Admin Registration

```http
POST /AdminReg
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "password123",
  "schoolName": "ABC High School"
}
```

---

## 2. STUDENT MANAGEMENT

### 2.1 Register Student

```http
POST /StudentReg
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "name": "John Doe",
  "rollNum": 101,
  "password": "student123",
  "sclassName": "CLASS_ID",
  "adminID": "SCHOOL_ID",
  "email": "john@email.com",
  "phone": "1234567890",
  "dateOfBirth": "2005-05-15",
  "gender": "Male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "guardianInfo": {
    "fatherName": "Mr. Doe",
    "fatherPhone": "9876543210",
    "motherName": "Mrs. Doe",
    "motherPhone": "9876543211"
  }
}
```

### 2.2 Get All Students of a School

```http
GET /Students/:schoolId
Authorization: Bearer <TOKEN>
```

### 2.3 Get Student Details

```http
GET /Student/:studentId
Authorization: Bearer <TOKEN>
```

### 2.4 Update Student

```http
PUT /Student/:studentId
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "email": "newemail@email.com",
  "phone": "9999999999"
}
```

### 2.5 Mark Student Attendance

```http
PUT /StudentAttendance/:studentId
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "subName": "SUBJECT_ID",
  "status": "Present", // Present, Absent, Late, Excused
  "date": "2024-01-15"
}
```

### 2.6 Update Exam Results

```http
PUT /UpdateExamResult/:studentId
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "subName": "SUBJECT_ID",
  "marksObtained": 85,
  "totalMarks": 100,
  "examType": "Mid-Term", // Quiz, Mid-Term, Final, Assignment, Project
  "examDate": "2024-01-20"
}
```

### 2.7 Delete Student

```http
DELETE /Student/:studentId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 3. TEACHER MANAGEMENT

### 3.1 Register Teacher

```http
POST /TeacherReg
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@school.com",
  "password": "teacher123",
  "teachSclass": "CLASS_ID",
  "teachSubject": "SUBJECT_ID",
  "school": "SCHOOL_ID",
  "phone": "1234567890",
  "qualification": {
    "degree": "M.Sc",
    "specialization": "Mathematics",
    "university": "ABC University"
  },
  "experience": 5
}
```

### 3.2 Get All Teachers

```http
GET /Teachers/:schoolId
Authorization: Bearer <ADMIN_TOKEN>
```

### 3.3 Get Teacher Details

```http
GET /Teacher/:teacherId
Authorization: Bearer <TOKEN>
```

### 3.4 Update Teacher Subject

```http
PUT /TeacherSubject
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "teacherId": "TEACHER_ID",
  "teachSubject": "NEW_SUBJECT_ID"
}
```

### 3.5 Delete Teacher

```http
DELETE /Teacher/:teacherId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 4. CLASS MANAGEMENT

### 4.1 Create Class

```http
POST /SclassCreate
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "sclassName": "Class 10A",
  "adminID": "SCHOOL_ID"
}
```

### 4.2 Get All Classes

```http
GET /SclassList/:schoolId
Authorization: Bearer <TOKEN>
```

### 4.3 Get Class Details

```http
GET /Sclass/:classId
Authorization: Bearer <TOKEN>
```

### 4.4 Get Class Students

```http
GET /Sclass/Students/:classId
Authorization: Bearer <TOKEN>
```

### 4.5 Delete Class

```http
DELETE /Sclass/:classId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 5. SUBJECT MANAGEMENT

### 5.1 Create Subjects

```http
POST /SubjectCreate
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "sclassName": "CLASS_ID",
  "adminID": "SCHOOL_ID",
  "subjects": [
    {
      "subName": "Mathematics",
      "subCode": "MATH101",
      "sessions": "40"
    },
    {
      "subName": "Physics",
      "subCode": "PHY101",
      "sessions": "35"
    }
  ]
}
```

### 5.2 Get All Subjects

```http
GET /AllSubjects/:schoolId
Authorization: Bearer <TOKEN>
```

### 5.3 Get Class Subjects

```http
GET /ClassSubjects/:classId
Authorization: Bearer <TOKEN>
```

### 5.4 Get Subject Details

```http
GET /Subject/:subjectId
Authorization: Bearer <TOKEN>
```

### 5.5 Delete Subject

```http
DELETE /Subject/:subjectId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 6. ASSIGNMENT MANAGEMENT ✨ NEW

### 6.1 Create Assignment

```http
POST /AssignmentCreate
Authorization: Bearer <TEACHER_TOKEN>
Content-Type: application/json

{
  "title": "Chapter 5 Homework",
  "description": "Complete all exercises from chapter 5",
  "subject": "SUBJECT_ID",
  "class": "CLASS_ID",
  "teacher": "TEACHER_ID",
  "school": "SCHOOL_ID",
  "dueDate": "2024-02-01",
  "maxMarks": 100,
  "attachments": [
    {
      "fileName": "chapter5.pdf",
      "fileUrl": "https://example.com/chapter5.pdf"
    }
  ]
}
```

### 6.2 Get Class Assignments

```http
GET /Assignments/:classId
Authorization: Bearer <TOKEN>
```

### 6.3 Get Assignment Details

```http
GET /Assignment/:assignmentId
Authorization: Bearer <TOKEN>
```

### 6.4 Get Student Assignments

```http
GET /StudentAssignments/:studentId
Authorization: Bearer <TOKEN>
```

### 6.5 Submit Assignment

```http
POST /AssignmentSubmit
Authorization: Bearer <STUDENT_TOKEN>
Content-Type: application/json

{
  "assignmentId": "ASSIGNMENT_ID",
  "studentId": "STUDENT_ID",
  "attachments": [
    {
      "fileName": "submission.pdf",
      "fileUrl": "https://example.com/submission.pdf"
    }
  ]
}
```

### 6.6 Grade Assignment

```http
PUT /AssignmentGrade
Authorization: Bearer <TEACHER_TOKEN>
Content-Type: application/json

{
  "assignmentId": "ASSIGNMENT_ID",
  "studentId": "STUDENT_ID",
  "marksObtained": 85,
  "feedback": "Well done! Good work on problem 5.",
  "gradedBy": "TEACHER_ID"
}
```

### 6.7 Get Teacher Assignments

```http
GET /TeacherAssignments/:teacherId
Authorization: Bearer <TOKEN>
```

### 6.8 Update Assignment

```http
PUT /Assignment/:assignmentId
Authorization: Bearer <TEACHER_TOKEN>
Content-Type: application/json

{
  "dueDate": "2024-02-05",
  "maxMarks": 120
}
```

### 6.9 Delete Assignment

```http
DELETE /Assignment/:assignmentId
Authorization: Bearer <TEACHER_TOKEN>
```

---

## 7. TIMETABLE MANAGEMENT ✨ NEW

### 7.1 Create Timetable

```http
POST /TimetableCreate
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "class": "CLASS_ID",
  "school": "SCHOOL_ID",
  "academicYear": "2023-2024",
  "term": "First Term",
  "schedule": [
    {
      "day": "Monday",
      "periods": [
        {
          "periodNumber": 1,
          "startTime": "09:00",
          "endTime": "09:45",
          "subject": "SUBJECT_ID",
          "teacher": "TEACHER_ID",
          "room": "Room 101",
          "type": "Class"
        },
        {
          "periodNumber": 2,
          "startTime": "09:45",
          "endTime": "10:00",
          "type": "Break"
        }
      ]
    }
  ]
}
```

### 7.2 Get Timetable

```http
GET /Timetable?classId=CLASS_ID&academicYear=2023-2024&term=First Term
Authorization: Bearer <TOKEN>
```

### 7.3 Get Teacher Timetable

```http
GET /TeacherTimetable/:teacherId
Authorization: Bearer <TOKEN>
```

### 7.4 Update Timetable

```http
PUT /Timetable/:timetableId
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "schedule": [...]
}
```

### 7.5 Delete Timetable

```http
DELETE /Timetable/:timetableId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 8. FEE MANAGEMENT ✨ NEW

### 8.1 Create Fee Record

```http
POST /FeeCreate
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "student": "STUDENT_ID",
  "school": "SCHOOL_ID",
  "class": "CLASS_ID",
  "academicYear": "2023-2024",
  "feeStructure": {
    "tuitionFee": 5000,
    "transportFee": 1000,
    "libraryFee": 500,
    "labFee": 800,
    "sportsFee": 300
  },
  "totalFee": 7600,
  "dueDate": "2024-04-30"
}
```

### 8.2 Get Student Fees

```http
GET /StudentFees/:studentId
Authorization: Bearer <TOKEN>
```

### 8.3 Get Class Fees

```http
GET /ClassFees/:classId
Authorization: Bearer <TOKEN>
```

### 8.4 Get School Fee Summary

```http
GET /SchoolFeesSummary/:schoolId
Authorization: Bearer <ADMIN_TOKEN>
```

### 8.5 Add Payment

```http
POST /PaymentAdd
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "feeId": "FEE_ID",
  "amount": 5000,
  "paymentMethod": "Online", // Cash, Card, Online, Bank Transfer, Cheque
  "transactionId": "TXN123456",
  "receiptNumber": "REC001",
  "receivedBy": "ADMIN_ID"
}
```

### 8.6 Apply Discount

```http
POST /ApplyDiscount
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "feeId": "FEE_ID",
  "amount": 500,
  "reason": "Merit scholarship"
}
```

### 8.7 Generate Fee Report

```http
GET /FeeReport?schoolId=SCHOOL_ID&academicYear=2023-2024&status=Pending
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 9. EVENT MANAGEMENT ✨ NEW

### 9.1 Create Event

```http
POST /EventCreate
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "title": "Annual Sports Day",
  "description": "School-wide sports competition",
  "type": "Sports", // Holiday, Exam, Meeting, Sports, Cultural, PTA, Other
  "startDate": "2024-03-15",
  "endDate": "2024-03-17",
  "startTime": "09:00",
  "endTime": "16:00",
  "location": "School Ground",
  "school": "SCHOOL_ID",
  "targetAudience": ["All"], // All, Students, Teachers, Parents, Admin
  "organizer": "ADMIN_ID",
  "organizerModel": "admin"
}
```

### 9.2 Get School Events

```http
GET /SchoolEvents/:schoolId?type=Sports&status=Scheduled
Authorization: Bearer <TOKEN>
```

### 9.3 Get Event Details

```http
GET /Event/:eventId
Authorization: Bearer <TOKEN>
```

### 9.4 Get User Events

```http
GET /UserEvents?userId=USER_ID&role=Student&schoolId=SCHOOL_ID
Authorization: Bearer <TOKEN>
```

### 9.5 Get Upcoming Events

```http
GET /UpcomingEvents/:schoolId
Authorization: Bearer <TOKEN>
```

### 9.6 Update Event

```http
PUT /Event/:eventId
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "status": "Completed",
  "location": "New Venue"
}
```

### 9.7 Cancel Event

```http
PUT /EventCancel/:eventId
Authorization: Bearer <ADMIN_TOKEN>
```

### 9.8 Delete Event

```http
DELETE /Event/:eventId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 10. MESSAGING SYSTEM ✨ NEW

### 10.1 Send Message

```http
POST /MessageSend
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "sender": "SENDER_ID",
  "senderModel": "teacher", // admin, teacher, student, parent
  "recipient": "RECIPIENT_ID",
  "recipientModel": "student",
  "school": "SCHOOL_ID",
  "subject": "Regarding your recent test",
  "message": "Please see me after class to discuss your performance.",
  "priority": "High", // Low, Normal, High, Urgent
  "category": "Academic" // Academic, Attendance, Fees, Discipline, General, Event
}
```

### 10.2 Get Inbox Messages

```http
GET /InboxMessages?userId=USER_ID&userModel=student
Authorization: Bearer <TOKEN>
```

### 10.3 Get Sent Messages

```http
GET /SentMessages?userId=USER_ID&userModel=teacher
Authorization: Bearer <TOKEN>
```

### 10.4 Get Message Details

```http
GET /Message/:messageId
Authorization: Bearer <TOKEN>
```

### 10.5 Mark Message as Read

```http
PUT /MessageRead/:messageId
Authorization: Bearer <TOKEN>
```

### 10.6 Get Unread Count

```http
GET /UnreadCount?userId=USER_ID&userModel=student
Authorization: Bearer <TOKEN>
```

### 10.7 Get Conversation

```http
GET /Conversation?user1Id=ID1&user1Model=teacher&user2Id=ID2&user2Model=student
Authorization: Bearer <TOKEN>
```

### 10.8 Reply to Message

```http
POST /MessageReply/:originalMessageId
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "sender": "SENDER_ID",
  "senderModel": "student",
  "school": "SCHOOL_ID",
  "subject": "Re: Regarding your recent test",
  "message": "Thank you, I will meet you tomorrow."
}
```

### 10.9 Delete Message

```http
DELETE /Message/:messageId
Authorization: Bearer <TOKEN>
```

### 10.10 Bulk Delete Messages

```http
POST /BulkDeleteMessages
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "messageIds": ["MSG_ID_1", "MSG_ID_2", "MSG_ID_3"]
}
```

---

## 11. LIBRARY MANAGEMENT ✨ NEW

### 11.1 Add Book

```http
POST /BookAdd
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "isbn": "978-0061120084",
  "category": "Fiction",
  "publisher": "Harper Perennial",
  "publishYear": 1960,
  "totalCopies": 5,
  "school": "SCHOOL_ID",
  "location": {
    "shelf": "A",
    "row": "3"
  }
}
```

### 11.2 Get All Books

```http
GET /Books?schoolId=SCHOOL_ID&category=Fiction&available=true
Authorization: Bearer <TOKEN>
```

### 11.3 Get Book Details

```http
GET /Book/:bookId
Authorization: Bearer <TOKEN>
```

### 11.4 Search Books

```http
GET /SearchBooks?schoolId=SCHOOL_ID&query=mockingbird
Authorization: Bearer <TOKEN>
```

### 11.5 Issue Book

```http
POST /BookIssue
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "bookId": "BOOK_ID",
  "borrowerId": "STUDENT_ID",
  "borrowerModel": "student", // student or teacher
  "dueDate": "2024-02-15",
  "issuedBy": "ADMIN_ID"
}
```

### 11.6 Return Book

```http
POST /BookReturn
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "borrowId": "BORROW_ID",
  "returnedTo": "ADMIN_ID",
  "remarks": "Book returned in good condition"
}
```

### 11.7 Get User Borrowed Books

```http
GET /UserBorrowedBooks?userId=USER_ID&userModel=student
Authorization: Bearer <TOKEN>
```

### 11.8 Get School Borrows

```http
GET /SchoolBorrows/:schoolId?status=Borrowed
Authorization: Bearer <ADMIN_TOKEN>
```

### 11.9 Get Overdue Books

```http
GET /OverdueBooks/:schoolId
Authorization: Bearer <ADMIN_TOKEN>
```

### 11.10 Pay Fine

```http
POST /PayFine
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "borrowId": "BORROW_ID"
}
```

### 11.11 Get Library Statistics

```http
GET /LibraryStats/:schoolId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 12. SETTINGS & PROFILE ✨ NEW

### 12.1 Update Profile

```http
PUT /UpdateProfile
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "userId": "USER_ID",
  "userModel": "student", // student, teacher, admin, parent
  "updates": {
    "email": "newemail@email.com",
    "phone": "9999999999",
    "address": {
      "city": "Boston"
    }
  }
}
```

### 12.2 Change Password

```http
POST /ChangePassword
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "userId": "USER_ID",
  "userModel": "student",
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

### 12.3 Update Preferences

```http
PUT /UpdatePreferences
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "userId": "USER_ID",
  "userModel": "student",
  "preferences": {
    "theme": "dark", // light or dark
    "emailNotifications": true,
    "smsNotifications": false
  }
}
```

### 12.4 Upload Profile Picture

```http
POST /UploadProfilePicture
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "userId": "USER_ID",
  "userModel": "student",
  "profilePicture": "https://example.com/profile.jpg"
}
```

### 12.5 Get Notifications

```http
GET /Notifications?userId=USER_ID&userModel=student
Authorization: Bearer <TOKEN>
```

### 12.6 Mark Notification as Read

```http
PUT /MarkNotificationRead
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "userId": "USER_ID",
  "userModel": "student",
  "notificationId": "NOTIFICATION_ID"
}
```

### 12.7 Clear All Notifications

```http
DELETE /ClearNotifications
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "userId": "USER_ID",
  "userModel": "student"
}
```

---

## 13. REPORT CARDS ✨ NEW

### 13.1 Generate Report Card (JSON)

```http
GET /ReportCard/:studentId?academicYear=2023-2024&term=Final
Authorization: Bearer <TOKEN>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "student": {
      "name": "John Doe",
      "rollNum": 101,
      "class": "10A",
      "school": "ABC High School"
    },
    "academicYear": "2023-2024",
    "term": "Final",
    "subjects": [
      {
        "subject": "Mathematics",
        "subCode": "MATH101",
        "marksObtained": 85,
        "maxMarks": 100,
        "percentage": "85.00",
        "grade": "A"
      }
    ],
    "attendance": [
      {
        "subject": "Mathematics",
        "present": 38,
        "total": 40,
        "percentage": "95.00"
      }
    ],
    "overall": {
      "totalMarks": 510,
      "maxTotalMarks": 600,
      "percentage": "85.00",
      "grade": "A"
    },
    "remarks": "Excellent work! Continue to strive for excellence.",
    "generatedDate": "01/15/2024"
  }
}
```

### 13.2 Generate Report Card PDF

```http
GET /ReportCardPDF/:studentId?academicYear=2023-2024&term=Final
Authorization: Bearer <TOKEN>
```

**Response:** PDF file download

### 13.3 Get Class Report Cards

```http
GET /ClassReportCards/:classId?academicYear=2023-2024&term=Final
Authorization: Bearer <TOKEN>
```

---

## 14. NOTICES & COMPLAINTS

### 14.1 Create Notice

```http
POST /NoticeCreate
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "title": "Important Announcement",
  "details": "School will remain closed on Friday",
  "date": "2024-01-15",
  "adminID": "SCHOOL_ID"
}
```

### 14.2 Get Notices

```http
GET /NoticeList/:schoolId
Authorization: Bearer <TOKEN>
```

### 14.3 Update Notice

```http
PUT /Notice/:noticeId
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "title": "Updated Title",
  "details": "Updated details"
}
```

### 14.4 Delete Notice

```http
DELETE /Notice/:noticeId
Authorization: Bearer <ADMIN_TOKEN>
```

### 14.5 Submit Complaint

```http
POST /ComplainCreate
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "user": "USER_ID",
  "complaint": "Cafeteria food quality needs improvement",
  "date": "2024-01-15",
  "school": "SCHOOL_ID"
}
```

### 14.6 Get Complaints

```http
GET /ComplainList/:schoolId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 15. PARENT MANAGEMENT ✨ NEW

### 15.1 Register Parent

```http
POST /ParentReg
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "name": "Mr. John Parent",
  "email": "parent@email.com",
  "password": "parent123",
  "phone": "1234567890",
  "address": "123 Main St",
  "school": "SCHOOL_ID"
}
```

### 15.2 Link Child to Parent

```http
POST /LinkChild
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "parentId": "PARENT_ID",
  "studentId": "STUDENT_ID"
}
```

### 15.3 Get Parent Details

```http
GET /Parent/:parentId
Authorization: Bearer <TOKEN>
```

### 15.4 Get All Parents

```http
GET /Parents/:schoolId
Authorization: Bearer <ADMIN_TOKEN>
```

### 15.5 Update Parent

```http
PUT /Parent/:parentId
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "phone": "9999999999",
  "address": "New Address"
}
```

### 15.6 Delete Parent

```http
DELETE /Parent/:parentId
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Error Codes

| Status Code | Description                                 |
| ----------- | ------------------------------------------- |
| 200         | Success                                     |
| 201         | Created                                     |
| 400         | Bad Request - Invalid input                 |
| 401         | Unauthorized - Invalid credentials or token |
| 403         | Forbidden - Insufficient permissions        |
| 404         | Not Found - Resource doesn't exist          |
| 429         | Too Many Requests - Rate limit exceeded     |
| 500         | Internal Server Error                       |

---

## Rate Limiting

- Login endpoints: 5 attempts per 15 minutes per IP
- Other endpoints: Standard rate limiting applies

---

## Testing with Postman/curl

### Example: Student Login with curl

```bash
curl -X POST http://localhost:5000/StudentLogin \
  -H "Content-Type: application/json" \
  -d '{
    "rollNum": 1,
    "studentName": "Dipesh Awasthi",
    "password": "zxc"
  }'
```

### Example: Get Student Details with Authorization

```bash
curl -X GET http://localhost:5000/Student/STUDENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Notes

1. **All IDs**: MongoDB ObjectIDs (24 character hex string)
2. **Dates**: ISO 8601 format (YYYY-MM-DD)
3. **Timestamps**: Automatically added by MongoDB (createdAt, updatedAt)
4. **File Uploads**: Currently expects URLs. For actual file upload, implement multipart/form-data endpoints
5. **Pagination**: Add ?page=1&limit=10 to list endpoints (to be implemented)
6. **Sorting**: Add ?sort=name&order=asc to list endpoints (to be implemented)

---

**API Version:** 2.0.0  
**Last Updated:** January 2026
