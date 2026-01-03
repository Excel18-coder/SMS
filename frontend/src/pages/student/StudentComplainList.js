import {
  Box,
  Chip,
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
import Popup from "../../components/Popup";
import { getAllComplains } from "../../redux/complainRelated/complainHandle";

const StudentComplainList = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { complainsList, loading, error, response } = useSelector(
    (state) => state.complain
  );
  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    if (currentUser && currentUser._id) {
      dispatch(getAllComplains(currentUser._id, "Student"));
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

  const getStatusChip = (status) => {
    const statusColors = {
      Pending: "warning",
      "In Progress": "info",
      Resolved: "success",
      Rejected: "error",
    };
    return (
      <Chip
        label={status}
        color={statusColors[status] || "default"}
        size="small"
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Complaints
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {Array.isArray(complainsList) && complainsList.length > 0 ? (
              <List>
                {complainsList.map((complain, index) => (
                  <React.Fragment key={complain._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}>
                            <Typography variant="h6">
                              {complain.complaint}
                            </Typography>
                            {getStatusChip(complain.status || "Pending")}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              sx={{ display: "block", mt: 1 }}
                              component="span"
                              variant="caption"
                              color="text.secondary">
                              Submitted:{" "}
                              {complain.date
                                ? format(
                                    new Date(complain.date),
                                    "MMM dd, yyyy"
                                  )
                                : "N/A"}
                            </Typography>
                            {complain.response && (
                              <Typography
                                sx={{
                                  display: "block",
                                  mt: 1,
                                  p: 1,
                                  bgcolor: "action.hover",
                                  borderRadius: 1,
                                }}
                                component="span"
                                variant="body2">
                                <strong>Response:</strong> {complain.response}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < complainsList.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  No complaints submitted
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

export default StudentComplainList;
