import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popup from "../../components/Popup";
import { getAllEvents } from "../../redux/eventRelated/eventHandle";

const ParentEvents = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { eventsList, loading, error, response } = useSelector(
    (state) => state.event
  );
  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    if (
      currentUser &&
      currentUser.children &&
      currentUser.children[0]?.school
    ) {
      dispatch(getAllEvents(currentUser.children[0].school._id, "School"));
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

  const getEventStatus = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    if (event.toDateString() === today.toDateString()) {
      return { label: "Today", color: "success" };
    } else if (event > today) {
      return { label: "Upcoming", color: "info" };
    } else {
      return { label: "Past", color: "default" };
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <EventIcon sx={{ mr: 2, fontSize: 40 }} />
        <Typography variant="h4">School Events</Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {Array.isArray(eventsList) && eventsList.length > 0 ? (
            <Grid container spacing={3}>
              {eventsList.map((event) => {
                const status = getEventStatus(event.date);
                return (
                  <Grid item xs={12} md={6} key={event._id}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                          }}>
                          <Typography variant="h6" component="div">
                            {event.title}
                          </Typography>
                          <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph>
                          {event.description}
                        </Typography>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <EventIcon
                            sx={{ mr: 1, fontSize: 18 }}
                            color="action"
                          />
                          <Typography variant="body2">
                            {event.date
                              ? format(
                                  new Date(event.date),
                                  "EEEE, MMMM dd, yyyy"
                                )
                              : "N/A"}
                          </Typography>
                        </Box>

                        {event.time && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}>
                            <AccessTimeIcon
                              sx={{ mr: 1, fontSize: 18 }}
                              color="action"
                            />
                            <Typography variant="body2">
                              {event.time}
                            </Typography>
                          </Box>
                        )}

                        {event.location && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LocationOnIcon
                              sx={{ mr: 1, fontSize: 18 }}
                              color="action"
                            />
                            <Typography variant="body2">
                              {event.location}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <EventIcon
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="textSecondary">
                No events scheduled
              </Typography>
            </Paper>
          )}
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Container>
  );
};

export default ParentEvents;
