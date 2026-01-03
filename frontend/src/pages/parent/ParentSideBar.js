import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import EventIcon from "@mui/icons-material/Event";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";

const ParentSideBar = () => {
  const location = useLocation();

  return (
    <>
      <React.Fragment>
        <ListItemButton component={Link} to="/Parent/dashboard">
          <ListItemIcon>
            <HomeIcon
              color={
                location.pathname === "/Parent/dashboard"
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Parent/children">
          <ListItemIcon>
            <ChildCareIcon
              color={
                location.pathname.startsWith("/Parent/children")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="My Children" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Parent/events">
          <ListItemIcon>
            <EventIcon
              color={
                location.pathname.startsWith("/Parent/events")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Events" />
        </ListItemButton>
        <ListItemButton component={Link} to="/Parent/messages">
          <ListItemIcon>
            <MessageIcon
              color={
                location.pathname.startsWith("/Parent/messages")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Messages" />
        </ListItemButton>
      </React.Fragment>
      <Divider sx={{ my: 1 }} />
      <React.Fragment>
        <ListSubheader component="div" inset>
          User
        </ListSubheader>
        <ListItemButton component={Link} to="/Parent/profile">
          <ListItemIcon>
            <AccountCircleOutlinedIcon
              color={
                location.pathname.startsWith("/Parent/profile")
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

export default ParentSideBar;
