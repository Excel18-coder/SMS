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
import ChildPerformance from "./ChildPerformance";
import ChildrenList from "./ChildrenList";
import ParentAssignments from "./ParentAssignments";
import ParentAttendance from "./ParentAttendance";
import ParentEvents from "./ParentEvents";
import ParentFees from "./ParentFees";
import ParentHomePage from "./ParentHomePage";
import ParentMessages from "./ParentMessages";
import ParentProfile from "./ParentProfile";
import ParentSideBar from "./ParentSideBar";
import ParentTimetable from "./ParentTimetable";

const ParentDashboard = () => {
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
              Parent Dashboard
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
            <ParentSideBar />
          </List>
        </Drawer>
        <Box component="main" sx={styles.boxStyled}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<ParentHomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/Parent/dashboard" element={<ParentHomePage />} />
            <Route path="/Parent/profile" element={<ParentProfile />} />
            <Route path="/Parent/children" element={<ChildrenList />} />
            <Route path="/Parent/child/:id" element={<ChildPerformance />} />
            <Route path="/Parent/child/:id/fees" element={<ParentFees />} />
            <Route
              path="/Parent/child/:id/assignments"
              element={<ParentAssignments />}
            />
            <Route
              path="/Parent/child/:id/attendance"
              element={<ParentAttendance />}
            />
            <Route
              path="/Parent/child/:id/timetable"
              element={<ParentTimetable />}
            />
            <Route path="/Parent/events" element={<ParentEvents />} />
            <Route path="/Parent/messages" element={<ParentMessages />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};

export default ParentDashboard;

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
