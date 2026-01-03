import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import ChooseUser from "./pages/ChooseUser";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentRegisterPage from "./pages/parent/ParentRegisterPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

const App = () => {
  const { currentRole, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("App.js - State updated:", {
      currentRole,
      hasUser: !!currentUser,
      userId: currentUser?._id,
      userName: currentUser?.name,
    });
  }, [currentRole, currentUser]);

  console.log("App.js rendering with currentRole:", currentRole);

  return (
    <Router>
      {(currentRole === null || currentRole === undefined) && (
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/choose" element={<ChooseUser />} />

          <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
          <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
          <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />
          <Route path="/Parentlogin" element={<LoginPage role="Parent" />} />

          <Route path="/Adminregister" element={<AdminRegisterPage />} />
          <Route path="/Parentregister" element={<ParentRegisterPage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}

      {currentRole === "Admin" && (
        <>
          <AdminDashboard />
        </>
      )}

      {currentRole === "Student" && (
        <>
          <StudentDashboard />
        </>
      )}

      {currentRole === "Teacher" && (
        <>
          <TeacherDashboard />
        </>
      )}

      {currentRole === "Parent" && (
        <>
          <ParentDashboard />
        </>
      )}
    </Router>
  );
};

export default App;
