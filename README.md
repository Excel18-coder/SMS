<h1 align="center">
    SCHOOL MANAGEMENT SYSTEM
</h1>

<h3 align="center">
A comprehensive school management solution for modern educational institutions
</h3>

<p align="center">
  <strong>Developed by Excel</strong>
</p>

---

# About

This School Management System is a full-stack web application built by **Excel** using the MERN stack (MongoDB, Express.js, React.js, Node.js). The system provides a complete solution for managing school operations, including student enrollment, teacher management, attendance tracking, performance assessment, fee management, library operations, and much more.

## Key Features

### 👥 Multi-Role System

- **Admin:** Complete control over system management, user creation, and configurations
- **Teacher:** Manage classes, track attendance, assign grades, and communicate with students
- **Student:** View schedules, check grades, access assignments, and communicate with teachers
- **Parent:** Monitor child's academic progress and communicate with teachers

### 📚 Academic Management

- Class and subject management
- Timetable scheduling
- Assignment creation and submission
- Performance tracking with detailed reports
- Interactive data visualization (charts and graphs)

### 📊 Administrative Features

- Student enrollment and management
- Teacher onboarding and management
- Attendance tracking system
- Fee management and payment tracking
- Notice board and announcements
- Event management calendar

### 📖 Additional Features

- Library book management and tracking
- Complaint/feedback system
- Internal messaging system
- Real-time notifications
- Comprehensive reporting tools
- Secure authentication and authorization

## 🛠️ Technologies Used

**Frontend:**

- React.js
- Material UI
- Redux (State Management)

**Backend:**

- Node.js
- Express.js

**Database:**

- MongoDB

---

# 🚀 Installation & Setup

## Prerequisites

- Node.js installed on your system
- MongoDB installed locally or MongoDB Atlas account

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd SMS
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
MONGO_URL=mongodb://127.0.0.1/smsproject
SECRET_KEY=your_secret_key_here
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:

```env
REACT_APP_BASE_URL=http://localhost:5000
```

Start the frontend application:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

---

# 📦 MongoDB Configuration

## Option 1: Local MongoDB

1. Download and install MongoDB Community Server from [mongodb.com](https://mongodb.com/try/download/community)
2. Install MongoDB Compass from [mongodb.com/compass](https://mongodb.com/try/download/compass)
3. Start MongoDB service:

```bash
mongod
```

4. Connect via Compass using:

```
mongodb://127.0.0.1:27017/smsproject
```

Use this connection string in your backend `.env` file as `MONGO_URL`

## Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a new cluster
3. Go to Database → Connect → Connect your application
4. Copy the connection string:

```
mongodb+srv://<username>:<password>@<cluster-url>/smsproject?retryWrites=true&w=majority
```

5. Replace `<username>`, `<password>`, and `<cluster-url>` with your credentials
6. Use this as your `MONGO_URL` in the backend `.env` file

---

# 📱 Usage

After starting both servers:

1. Open your browser and navigate to `http://localhost:3000`
2. Choose your user role (Admin/Teacher/Student/Parent)
3. Login with your credentials
4. Explore the features available for your role

**Default Admin Credentials** (if seeded):

- Email: admin@example.com
- Password: admin123

---

# 📂 Project Structure

```
SMS/
├── backend/
│   ├── controllers/       # Business logic for each module
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication & validation
│   └── index.js          # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components (Admin/Teacher/Student)
│   │   ├── redux/        # State management
│   │   └── utils/        # Helper functions & API calls
│   └── public/
│
└── README.md
```

---

# 🚀 Deployment

## Backend Deployment (Render)

1. Push your code to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Connect your repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`
5. Add environment variables:
   - `MONGO_URL`
   - `SECRET_KEY`

## Frontend Deployment (Netlify)

1. Push your code to GitHub
2. Create a new site on [Netlify](https://netlify.com)
3. Connect your repository
4. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `build`
   - Base Directory: `frontend`
5. Add environment variable:
   - `REACT_APP_BASE_URL`: Your backend URL

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

**Excel**

For questions, suggestions, or contributions, feel free to reach out!

---

# 🙏 Acknowledgments

Built with passion using the MERN stack to provide a comprehensive solution for modern educational institutions.

---

**Made with ❤️ by Excel**
