# 🎓 School Management System

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Security](https://img.shields.io/badge/security-high-brightgreen.svg)
![Status](https://img.shields.io/badge/status-production--ready-success.svg)

**A comprehensive, secure MERN stack application for managing school operations**

[Features](#features) • [Installation](#installation) • [Security](#security) • [API Docs](#api-documentation) • [Contributing](#contributing)

</div>

---

## 📋 Overview

The School Management System is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It streamlines school administration, class organization, attendance tracking, and communication between students, teachers, and administrators.

### 🆕 Version 2.0 - Major Security Update

This version includes **critical security enhancements**:

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation on all endpoints
- ✅ Rate limiting protection
- ✅ XSS and NoSQL injection prevention
- ✅ Role-based access control (RBAC)
- ✅ Secure HTTP headers with Helmet
- ✅ Centralized error handling

---

## ✨ Features

### 👥 User Management

- **Three User Roles**: Admin, Teacher, and Student with distinct permissions
- **Secure Authentication**: JWT-based token authentication
- **Role-Based Access Control**: Protected routes based on user roles
- **Password Security**: Bcrypt hashing for all passwords

### 👨‍💼 Admin Dashboard

- Add and manage students and teachers
- Create and organize classes and subjects
- Manage user accounts and system settings
- View comprehensive analytics and reports
- Post notices and announcements
- Handle student complaints

### 👨‍🏫 Teacher Features

- Take attendance for classes
- Assess student performance with marks and feedback
- View class schedules and student lists
- Track own attendance
- Communicate with students

### 👨‍🎓 Student Features

- View attendance records
- Check exam marks and performance
- Access class schedules and subjects
- Submit complaints
- View notices and announcements
- Visualize performance through interactive charts

### 🔒 Security Features

- JWT token authentication
- Password encryption
- Input validation and sanitization
- Rate limiting (5 login attempts per 15 minutes)
- XSS protection
- NoSQL injection prevention
- Secure HTTP headers
- CORS configuration

### 📊 Data Visualization

- Interactive charts for performance tracking
- Attendance statistics
- Performance trends over time

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Helmet** - Security headers
- **Express Validator** - Input validation

---

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/school-management-system.git
cd school-management-system
```

2. **Install Backend Dependencies**

```bash
cd backend
npm install
```

3. **Configure Backend Environment**

Create `backend/.env`:

```env
MONGO_URL=mongodb://127.0.0.1:27017/smsproject
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANT:** Change `JWT_SECRET` to a strong, unique value!

4. **Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

5. **Configure Frontend Environment**

Create `frontend/.env`:

```env
REACT_APP_BASE_URL=http://localhost:5000
REACT_APP_NAME=School Management System
REACT_APP_VERSION=2.0.0
```

6. **Start MongoDB**

```bash
mongod
```

7. **Start Backend Server**

```bash
cd backend
npm run dev
```

Backend runs at `http://localhost:5000`

8. **Start Frontend**

```bash
cd frontend
npm start
```

Frontend runs at `http://localhost:3000`

---

## 🔐 Security

### Authentication Flow

1. User registers/logs in → Receives JWT token
2. Token stored in localStorage
3. Token automatically attached to all API requests
4. Backend validates token on protected routes
5. Token expires after 7 days (configurable)

### Password Requirements

- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

### Rate Limiting

- General routes: 100 requests per 15 minutes
- Login routes: 5 attempts per 15 minutes
- Automatic IP blocking on excessive requests

### Protected Routes

All routes except login/register require valid JWT token:

```
Authorization: Bearer <your-token-here>
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000
```

### Public Endpoints

#### Register Admin

```http
POST /AdminReg
Content-Type: application/json

{
  "name": "John Doe",
  "email": "admin@school.com",
  "password": "Admin123",
  "schoolName": "Test School"
}
```

#### Login Admin

```http
POST /AdminLogin
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "Admin123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "name": "John Doe",
  "email": "admin@school.com",
  "role": "Admin"
}
```

### Protected Endpoints

All protected endpoints require Authorization header:

```http
Authorization: Bearer <token>
```

#### Get Admin Details

```http
GET /Admin/:id
Authorization: Bearer <token>
```

#### Register Student (Admin only)

```http
POST /StudentReg
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Jane Student",
  "rollNum": 101,
  "password": "Student123",
  "sclassName": "class-id",
  "adminID": "admin-id"
}
```

#### Get Students List (Admin/Teacher)

```http
GET /Students/:schoolId
Authorization: Bearer <token>
```

See full API documentation in `/docs` folder.

---

## 🗂️ Project Structure

```
SMS/
├── backend/
│   ├── controllers/         # Request handlers
│   │   ├── admin-controller.js
│   │   ├── student_controller.js
│   │   ├── teacher-controller.js
│   │   ├── class-controller.js
│   │   ├── subject-controller.js
│   │   ├── notice-controller.js
│   │   └── complain-controller.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── validators.js    # Input validation
│   │   └── errorHandler.js  # Error handling
│   ├── models/              # Database schemas
│   │   ├── adminSchema.js
│   │   ├── studentSchema.js
│   │   ├── teacherSchema.js
│   │   ├── sclassSchema.js
│   │   ├── subjectSchema.js
│   │   ├── noticeSchema.js
│   │   └── complainSchema.js
│   ├── routes/              # API routes
│   │   └── route.js
│   ├── .env                 # Environment variables
│   ├── index.js             # Entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/          # Images, icons
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   │   ├── admin/
│   │   │   ├── student/
│   │   │   └── teacher/
│   │   ├── redux/           # State management
│   │   │   ├── store.js
│   │   │   ├── userRelated/
│   │   │   ├── studentRelated/
│   │   │   ├── teacherRelated/
│   │   │   └── ...
│   │   ├── utils/           # Utilities
│   │   │   └── api.js       # Axios instance
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
├── .env.example             # Environment template
├── README.md
├── INSTALLATION_GUIDE.md    # Detailed setup guide
├── PROJECT_ASSESSMENT.md    # Quality assessment
└── SECURITY_IMPLEMENTATION.md  # Security guide
```

---

## 🧪 Testing

### Manual Testing

1. **Health Check**

```bash
curl http://localhost:5000/health
```

2. **Register Admin**

```bash
curl -X POST http://localhost:5000/AdminReg \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"Admin123","schoolName":"Test"}'
```

3. **Login**

```bash
curl -X POST http://localhost:5000/AdminLogin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123"}'
```

---

## 🚀 Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables
4. Deploy

### Frontend Deployment (Netlify/Vercel)

1. Build the app: `npm run build`
2. Deploy the `build` folder
3. Set `REACT_APP_BASE_URL` to your backend URL

See [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) for detailed instructions.

---

## 📊 Database Schema

### Admin

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  schoolName: String (unique),
  role: String (default: "Admin")
}
```

### Student

```javascript
{
  name: String,
  rollNum: Number,
  password: String (hashed),
  sclassName: ObjectId (ref: 'sclass'),
  school: ObjectId (ref: 'admin'),
  role: String (default: "Student"),
  examResult: [{
    subName: ObjectId,
    marksObtained: Number
  }],
  attendance: [{
    date: Date,
    status: String (Present/Absent)
  }]
}
```

### Teacher

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  school: ObjectId (ref: 'admin'),
  teachSubject: ObjectId (ref: 'subject'),
  teachSclass: ObjectId (ref: 'sclass'),
  role: String (default: "Teacher"),
  attendance: [{
    date: Date,
    presentCount: String,
    absentCount: String
  }]
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 🐛 Known Issues

1. Delete functionality is currently disabled for safety
2. Some legacy code commented out (will be removed in future versions)

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Authors

- Original Creator: [Yogndrr](https://github.com/Yogndrr)
- Security Updates: v2.0 Enhancement Team

---

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- MongoDB team for excellent documentation
- React community for endless resources
- All contributors and users

---

## 📞 Support

For support, email support@yourschool.com or open an issue on GitHub.

---

## 🔄 Version History

### Version 2.0.0 (Current - January 2026)

- ✅ Added JWT authentication
- ✅ Implemented password hashing for all users
- ✅ Added input validation
- ✅ Implemented rate limiting
- ✅ Added XSS and NoSQL injection protection
- ✅ Centralized error handling
- ✅ Enhanced API response structure
- ✅ Improved security headers

### Version 1.0.0

- Initial release
- Basic CRUD operations
- User roles implementation
- Attendance tracking
- Performance assessment

---

## 📚 Additional Documentation

- [Installation Guide](INSTALLATION_GUIDE.md) - Detailed setup instructions
- [Security Guide](SECURITY_IMPLEMENTATION.md) - Security best practices
- [Project Assessment](PROJECT_ASSESSMENT.md) - Quality and security analysis
- [Implementation Checklist](IMPLEMENTATION_CHECKLIST.md) - Development roadmap

---

<div align="center">

**Made with ❤️ for better education management**

[⬆ Back to Top](#-school-management-system)

</div>
