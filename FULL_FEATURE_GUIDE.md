# 🎓 School Management System - Complete Feature Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [User Roles](#user-roles)
- [Features by Role](#features-by-role)
- [New Features Added](#new-features-added)
- [Getting Started](#getting-started)
- [Backend API Endpoints](#backend-api-endpoints)
- [Frontend Pages](#frontend-pages)

## 🌟 Overview

This is a comprehensive School Management System built with the MERN stack (MongoDB, Express.js, React, Node.js) that provides complete school administration, student management, parent engagement, and teacher tools.

## 👥 User Roles

### 1. **Admin**

- Full system control
- School-wide management
- User account creation

### 2. **Teacher**

- Class and student management
- Assignment creation and grading
- Attendance tracking
- Performance assessment

### 3. **Student**

- View academic performance
- Submit assignments
- Check attendance
- Access timetable and notices

### 4. **Parent** ✨ NEW

- Monitor children's progress
- View attendance and grades
- Communicate with teachers
- Track fee payments

## 🎯 Features by Role

### Admin Dashboard Features

#### 📚 **Academic Management**

- **Class Management**: Create, view, update, and delete classes
- **Subject Management**: Add subjects to classes, assign teachers
- **Student Management**: Register students, track performance, manage records
- **Teacher Management**: Register teachers, assign subjects and classes
- **Notice Management**: Post school-wide announcements

#### 💰 **Financial Management** ✨ NEW

- **Fee Structure**: Set fee amounts per class/student
- **Payment Tracking**: Record payments, generate receipts
- **Fee Reports**: View payment status, pending fees, overdue accounts
- **Discount Management**: Apply discounts with reasons

#### 📅 **Event & Schedule Management** ✨ NEW

- **Timetable Creation**: Create class schedules with periods, subjects, teachers
- **Event Calendar**: Manage holidays, exams, meetings, sports events
- **Event Categories**: Holiday, Exam, Meeting, Sports, Cultural, PTA

#### 📚 **Library Management** ✨ NEW

- **Book Catalog**: Add books with ISBN, author, category
- **Issue/Return**: Track book borrowing
- **Fine Management**: Calculate and collect overdue fines
- **Library Statistics**: View borrowed, available, overdue books

#### 📊 **Reports & Analytics**

- **Report Cards**: Generate term-wise performance reports
- **Attendance Reports**: Class and student-wise attendance
- **Performance Analytics**: Grade distribution, class rankings
- **PDF Reports**: Downloadable report cards

#### 💬 **Communication** ✨ NEW

- **Messaging System**: Send/receive messages
- **Parent Communication**: Direct messaging with parents
- **Teacher Communication**: Coordinate with staff

### Teacher Dashboard Features

#### 👨‍🏫 **Class Management**

- **Class View**: See assigned class and students
- **Student List**: Access full student roster
- **Attendance Marking**: Mark daily attendance by subject
- **Exam Marks Entry**: Record test scores and grades

#### 📝 **Assignment Management** ✨ NEW

- **Create Assignments**: Set due dates, max marks, instructions
- **File Attachments**: Upload assignment materials
- **View Submissions**: Track who submitted, on time/late status
- **Grade Assignments**: Provide marks and feedback

#### 📅 **Schedule & Planning**

- **View Timetable**: See teaching schedule
- **Period Details**: Subject, time, room information
- **Class Coverage**: Track classes taught

#### 💬 **Communication**

- **Parent Messaging**: Communicate with parents
- **Student Messages**: Send announcements to students
- **Complaint Management**: View and respond to student complaints

### Student Dashboard Features

#### 📚 **Academic Access**

- **View Subjects**: See enrolled subjects
- **Check Attendance**: View attendance percentage by subject
- **View Exam Results**: Check marks, grades, percentage
- **Attendance Charts**: Visual representation of attendance

#### 📝 **Assignment Portal** ✨ NEW

- **View Assignments**: See all pending assignments
- **Submit Work**: Upload assignment files
- **Track Status**: Monitor submission status (Submitted/Late/Not Submitted)
- **View Feedback**: Read teacher comments and grades

#### 📅 **Schedule & Events**

- **View Timetable**: Check daily class schedule
- **Event Calendar**: See upcoming events, holidays, exams

#### 💰 **Fee Information**

- **Fee Status**: View pending fee amount
- **Payment History**: See past payments
- **Fee Structure**: Breakdown of different fee components

#### 💬 **Communication**

- **Submit Complaints**: Report issues to admin
- **Messages**: Receive notifications from teachers
- **View Notices**: Read school announcements

### Parent Dashboard Features ✨ NEW

#### 👶 **Child Management**

- **Multiple Children**: Link multiple students to one parent account
- **Switch Views**: Monitor each child separately
- **Quick Access**: Navigate to any child's performance

#### 📊 **Performance Monitoring**

- **Attendance Tracking**: View child's attendance by subject
- **Exam Results**: Check marks, grades, percentage
- **Progress Reports**: View term-wise performance
- **Attendance Charts**: Visual attendance representation

#### 📝 **Assignment Tracking**

- **View Assignments**: See all assignments given to child
- **Submission Status**: Check if submitted on time
- **Grades & Feedback**: View teacher comments

#### 💰 **Fee Management**

- **Fee Status**: Check pending dues
- **Payment History**: View past payments
- **Fee Structure**: See detailed fee breakdown

#### 💬 **Communication**

- **Teacher Messaging**: Direct communication with class teachers
- **School Updates**: Receive important notifications
- **Event Notifications**: Get alerts for school events

## ✨ New Features Added

### 1. **Parent Portal**

- Complete parent dashboard
- Multi-child management
- Performance monitoring
- Fee tracking
- Teacher communication

### 2. **Assignment Management System**

- Create assignments with due dates
- File attachments support
- Student submission tracking
- Late submission detection
- Grading with feedback
- Assignment history

### 3. **Timetable Management**

- Create class schedules
- Assign teachers to periods
- Room allocation
- Break/lunch periods
- Teacher schedule view
- Student schedule view

### 4. **Fee Management System**

- Fee structure creation
- Multiple fee components (tuition, transport, library, etc.)
- Payment recording
- Receipt generation
- Discount application
- Overdue tracking
- Payment reports

### 5. **Event Calendar**

- School-wide events
- Holiday management
- Exam scheduling
- Meeting planning
- Target audience selection
- Recurring events
- Event reminders

### 6. **Library Management**

- Book catalog management
- ISBN tracking
- Issue/return system
- Due date management
- Fine calculation
- Overdue notifications
- Library statistics

### 7. **Messaging System**

- User-to-user messaging
- Message categories
- Priority levels
- Read receipts
- Message search
- Conversation threads

### 8. **Report Card Generation**

- Comprehensive report cards
- Term-wise reports
- PDF generation
- Attendance summary
- Grade calculation
- Teacher remarks
- Downloadable format

### 9. **Enhanced User Profiles**

- Profile picture upload
- Personal information management
- Password change
- Notification preferences
- Theme customization
- Contact details

## 🚀 Getting Started

### Prerequisites

```bash
Node.js (v14+)
MongoDB (v4.4+)
npm or yarn
```

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd SMS
```

2. **Backend Setup**

```bash
cd backend
npm install
```

3. **Create backend .env file**

```env
MONGO_URL=mongodb://localhost:27017/school
JWT_SECRET=your_secret_key_here
PORT=5000
```

4. **Frontend Setup**

```bash
cd frontend
npm install
```

5. **Create frontend .env file**

```env
REACT_APP_BASE_URL=http://localhost:5000
```

6. **Start Backend**

```bash
cd backend
npm start
```

7. **Start Frontend**

```bash
cd frontend
npm start
```

8. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Frontend Pages

### Public Pages

- `/` - Homepage
- `/choose` - User role selection
- `/Adminlogin` - Admin login
- `/Studentlogin` - Student login
- `/Teacherlogin` - Teacher login
- `/Parentlogin` - Parent login ✨ NEW
- `/Adminregister` - Admin registration
- `/Parentregister` - Parent registration ✨ NEW

### Admin Pages

- `/Admin/dashboard` - Admin home
- `/Admin/profile` - Admin profile
- `/Admin/classes` - Class management
- `/Admin/subjects` - Subject management
- `/Admin/students` - Student management
- `/Admin/teachers` - Teacher management
- `/Admin/notices` - Notice management
- `/Admin/complaints` - View complaints
- `/Admin/fees` - Fee management ✨ NEW
- `/Admin/timetable` - Timetable management ✨ NEW
- `/Admin/events` - Event management ✨ NEW
- `/Admin/library` - Library management ✨ NEW

### Teacher Pages

- `/Teacher/dashboard` - Teacher home
- `/Teacher/profile` - Teacher profile
- `/Teacher/class` - View assigned class
- `/Teacher/assignments` - Assignment management ✨ NEW
- `/Teacher/messages` - Messages ✨ NEW

### Student Pages

- `/Student/dashboard` - Student home
- `/Student/profile` - Student profile
- `/Student/subjects` - View subjects
- `/Student/attendance` - View attendance
- `/Student/assignments` - View & submit assignments ✨ NEW
- `/Student/timetable` - View schedule ✨ NEW
- `/Student/fees` - View fee status ✨ NEW
- `/Student/complain` - Submit complaint

### Parent Pages ✨ NEW

- `/Parent/dashboard` - Parent home
- `/Parent/profile` - Parent profile
- `/Parent/children` - View children list
- `/Parent/child/:id` - View child performance
- `/Parent/messages` - Messages

## 🎨 Technology Stack

### Frontend

- React 18
- Material-UI (MUI)
- Redux Toolkit
- React Router v6
- Axios
- Recharts (for data visualization)
- Styled Components

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt
- Express Validator
- Helmet (security)
- Rate Limiting
- CORS

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting (5 requests per 15 minutes for login)
- XSS protection
- NoSQL injection prevention
- Secure HTTP headers
- Role-based access control

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@schoolmanagement.com or open an issue in the repository.

---

**Built with ❤️ for modern education management**
