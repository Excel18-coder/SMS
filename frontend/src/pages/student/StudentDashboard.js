import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AccountMenu from "../../components/AccountMenu";
import { AppBar, Drawer } from "../../components/styles";
import Logout from "../Logout";
import StudentAssignments from "./StudentAssignments";
import StudentComplain from "./StudentComplain";
import StudentComplainList from "./StudentComplainList";
import StudentEvents from "./StudentEvents";
import StudentFees from "./StudentFees";
import StudentHomePage from "./StudentHomePage";
import StudentLibrary from "./StudentLibrary";
import StudentMessages from "./StudentMessages";
import StudentProfile from "./StudentProfile";
import StudentSideBar from "./StudentSideBar";
import StudentSubjects from "./StudentSubjects";
import StudentTimetable from "./StudentTimetable";
import ViewStdAttendance from "./ViewStdAttendance";

const StudentDashboard = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar open={open} position="absolute">
          <Toolbar sx={{ pr: "24px" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}>
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}>
              Student Dashboard
            </Typography>
            <AccountMenu />
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          sx={open ? styles.drawerStyled : styles.hideDrawer}>
          <Toolbar sx={styles.toolBarStyled}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <StudentSideBar />
          </List>
        </Drawer>
        <Box component="main" sx={styles.boxStyled}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<StudentHomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/Student/dashboard" element={<StudentHomePage />} />
            <Route path="/Student/profile" element={<StudentProfile />} />

            <Route path="/Student/subjects" element={<StudentSubjects />} />
            <Route path="/Student/attendance" element={<ViewStdAttendance />} />
            <Route
              path="/Student/assignments"
              element={<StudentAssignments />}
            />
            <Route path="/Student/timetable" element={<StudentTimetable />} />
            <Route path="/Student/fees" element={<StudentFees />} />
            <Route path="/Student/library" element={<StudentLibrary />} />
            <Route path="/Student/events" element={<StudentEvents />} />
            <Route path="/Student/messages" element={<StudentMessages />} />
            <Route path="/Student/complain" element={<StudentComplain />} />
            <Route
              path="/Student/complainlist"
              element={<StudentComplainList />}
            />

            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};

export default StudentDashboard;

const styles = {
  boxStyled: {
    backgroundColor: (theme) =>
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[900],
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  toolBarStyled: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    px: [1],
  },
  drawerStyled: {
    display: "flex",
  },
  hideDrawer: {
    display: "flex",
    "@media (max-width: 600px)": {
      display: "none",
    },
  },
};
