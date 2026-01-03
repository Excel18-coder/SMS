import AddIcon from "@mui/icons-material/Add";
import MailIcon from "@mui/icons-material/Mail";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popup";
import { getAllMessages } from "../../redux/messageRelated/messageHandle";

const TeacherMessages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { messagesList, loading, error, response } = useSelector(
    (state) => state.message
  );
  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    if (currentUser && currentUser._id) {
      dispatch(getAllMessages(currentUser._id, "Teacher"));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (response) {
      setMessage(response);
      setShowPopup(true);
    }
    if (error) {
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [response, error]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <MailIcon sx={{ mr: 2, fontSize: 30 }} />
            <Typography variant="h4">My Messages</Typography>
            {Array.isArray(messagesList) && messagesList.length > 0 && (
              <Badge
                badgeContent={messagesList.length}
                color="primary"
                sx={{ ml: 2 }}>
                <div />
              </Badge>
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/Teacher/messages/compose")}>
            Compose
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {Array.isArray(messagesList) && messagesList.length > 0 ? (
              <List>
                {messagesList.map((msg, index) => (
                  <React.Fragment key={msg._id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        bgcolor: msg.read ? "transparent" : "action.hover",
                        borderRadius: 1,
                        mb: 1,
                      }}>
                      <ListItemText
                        primary={
                          <Typography variant="h6" component="div">
                            {msg.subject}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "block", mb: 1 }}
                              component="span"
                              variant="body2"
                              color="text.primary">
                              From: {msg.sender?.name || "Administration"}
                            </Typography>
                            <Typography
                              sx={{ display: "block", mb: 1 }}
                              component="span"
                              variant="body1">
                              {msg.message}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary">
                              {msg.date
                                ? format(
                                    new Date(msg.date),
                                    "MMM dd, yyyy hh:mm a"
                                  )
                                : "N/A"}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < messagesList.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <MailIcon
                  sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="textSecondary">
                  No messages yet
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Container>
  );
};

export default TeacherMessages;
