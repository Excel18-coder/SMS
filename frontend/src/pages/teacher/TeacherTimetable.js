import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popup from "../../components/Popup";
import { getAllTimetables } from "../../redux/timetableRelated/timetableHandle";

const TeacherTimetable = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { timetablesList, loading, error, response } = useSelector(
    (state) => state.timetable
  );
  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    if (currentUser && currentUser.teachSclass?._id) {
      dispatch(getAllTimetables(currentUser.teachSclass._id, "Sclass"));
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

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getTimetableByDay = (day) => {
    if (!Array.isArray(timetablesList)) return [];
    return timetablesList
      .filter((item) => item.day === day)
      .sort((a, b) => {
        const timeA = a.startTime || "";
        const timeB = b.startTime || "";
        return timeA.localeCompare(timeB);
      });
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return dayNames[today];
  };

  const currentDay = getCurrentDay();

  const isMyClass = (slot) => {
    return slot.teacher?._id === currentUser?._id;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <ScheduleIcon sx={{ mr: 2, fontSize: 40 }} />
        <Typography variant="h4">
          My Timetable - {currentUser?.teachSclass?.sclassName}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {days.map((day) => {
            const daySchedule = getTimetableByDay(day);
            const isToday = day === currentDay;
            const myClasses = daySchedule.filter((slot) => isMyClass(slot));

            if (myClasses.length === 0) return null;

            return (
              <Paper key={day} sx={{ mb: 3, p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {day}
                  </Typography>
                  {isToday && (
                    <Chip label="Today" color="primary" size="small" />
                  )}
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Time</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Subject</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Room</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {myClasses.map((slot) => (
                        <TableRow
                          key={slot._id}
                          sx={{ bgcolor: "action.hover" }}>
                          <TableCell>
                            {slot.startTime} - {slot.endTime}
                          </TableCell>
                          <TableCell>
                            {slot.subName?.subName || "N/A"}
                          </TableCell>
                          <TableCell>{slot.room || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            );
          })}

          {!Array.isArray(timetablesList) || timetablesList.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <ScheduleIcon
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="textSecondary">
                No timetable available
              </Typography>
            </Paper>
          ) : null}
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

export default TeacherTimetable;
