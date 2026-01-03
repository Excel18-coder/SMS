import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import EventIcon from "@mui/icons-material/Event";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MailIcon from "@mui/icons-material/Mail";
import PaymentIcon from "@mui/icons-material/Payment";
import ScheduleIcon from "@mui/icons-material/Schedule";

const StudentSideBar = () => {
  const location = useLocation();
  return (
    <>
      <React.Fragment>
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <HomeIcon
              color={
                location.pathname === ("/" || "/Student/dashboard")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/subjects">
          <ListItemIcon>
            <AssignmentIcon
              color={
                location.pathname.startsWith("/Student/subjects")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Subjects" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/attendance">
          <ListItemIcon>
            <ClassOutlinedIcon
              color={
                location.pathname.startsWith("/Student/attendance")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Attendance" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/assignments">
          <ListItemIcon>
            <AssignmentIcon
              color={
                location.pathname.startsWith("/Student/assignments")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Assignments" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/timetable">
          <ListItemIcon>
            <ScheduleIcon
              color={
                location.pathname.startsWith("/Student/timetable")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Timetable" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/fees">
          <ListItemIcon>
            <PaymentIcon
              color={
                location.pathname.startsWith("/Student/fees")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Fees" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/library">
          <ListItemIcon>
            <LibraryBooksIcon
              color={
                location.pathname.startsWith("/Student/library")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Library" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/events">
          <ListItemIcon>
            <EventIcon
              color={
                location.pathname.startsWith("/Student/events")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Events" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/messages">
          <ListItemIcon>
            <MailIcon
              color={
                location.pathname.startsWith("/Student/messages")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Messages" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/complain">
          <ListItemIcon>
            <AnnouncementOutlinedIcon
              color={
                location.pathname.startsWith("/Student/complain")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Submit Complain" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Student/complainlist">
          <ListItemIcon>
            <ListAltIcon
              color={
                location.pathname.startsWith("/Student/complainlist")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="My Complains" />
        </ListItemButton>
      </React.Fragment>
      <Divider sx={{ my: 1 }} />
      <React.Fragment>
        <ListSubheader component="div" inset>
          User
        </ListSubheader>
        <ListItemButton component={Link} to="/Student/profile">
          <ListItemIcon>
            <AccountCircleOutlinedIcon
              color={
                location.pathname.startsWith("/Student/profile")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton component={Link} to="/logout">
          <ListItemIcon>
            <ExitToAppIcon
              color={
                location.pathname.startsWith("/logout") ? "primary" : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </React.Fragment>
    </>
  );
};

export default StudentSideBar;
