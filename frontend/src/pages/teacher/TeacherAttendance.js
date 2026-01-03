import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popup";
import {
  getClassStudents,
  updateStudentFields,
} from "../../redux/studentRelated/studentHandle";
import { getAllTimetables } from "../../redux/timetableRelated/timetableHandle";

const TeacherAttendance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { studentsList, loading, error, response } = useSelector(
    (state) => state.student
  );
  const { timetablesList } = useSelector((state) => state.timetable);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    if (currentUser && currentUser.teachSclass) {
      dispatch(getClassStudents(currentUser.teachSclass._id));
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

  useEffect(() => {
    // Initialize attendance state
    if (Array.isArray(studentsList)) {
      const initialAttendance = {};
      studentsList.forEach((student) => {
        initialAttendance[student._id] = true; // Default to present
      });
      setAttendance(initialAttendance);
    }
  }, [studentsList]);

  const handleAttendanceChange = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSubmit = () => {
    const attendanceData = Object.entries(attendance).map(
      ([studentId, present]) => ({
        studentId,
        status: present ? "Present" : "Absent",
        date: selectedDate,
        subject: selectedSubject,
      })
    );

    // Submit attendance for all students
    attendanceData.forEach((record) => {
      const fields = {
        attendance: [
          {
            date: record.date,
            status: record.status,
            subName: record.subject,
          },
        ],
      };
      dispatch(
        updateStudentFields(record.studentId, fields, "StudentAttendance")
      );
    });

    setMessage("Attendance submitted successfully!");
    setShowPopup(true);
  };

  const presentCount = Object.values(attendance).filter(
    (val) => val === true
  ).length;
  const absentCount = Object.values(attendance).filter(
    (val) => val === false
  ).length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Mark Attendance
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Date</InputLabel>
            <Select
              value={selectedDate}
              label="Date"
              onChange={(e) => setSelectedDate(e.target.value)}>
              <MenuItem value={format(new Date(), "yyyy-MM-dd")}>
                Today - {format(new Date(), "MMM dd, yyyy")}
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              label="Subject"
              onChange={(e) => setSelectedSubject(e.target.value)}>
              {currentUser?.teachSubject && (
                <MenuItem value={currentUser.teachSubject._id}>
                  {currentUser.teachSubject.subName}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
          <Typography variant="body1">
            <strong>Present:</strong> {presentCount} | <strong>Absent:</strong>{" "}
            {absentCount} | <strong>Total:</strong> {presentCount + absentCount}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {Array.isArray(studentsList) && studentsList.length > 0 ? (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Roll No</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Present</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentsList.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell>{student.rollNum}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            <Checkbox
                              checked={attendance[student._id] || false}
                              onChange={() =>
                                handleAttendanceChange(student._id)
                              }
                              color="primary"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box
                  sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!selectedSubject}>
                    Submit Attendance
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  No students found in your class
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

export default TeacherAttendance;
