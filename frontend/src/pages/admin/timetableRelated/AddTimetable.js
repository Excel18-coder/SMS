import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popup from "../../../components/Popup";
import api from "../../../utils/api";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const PERIOD_TYPES = ["Class", "Break", "Lunch", "Assembly"];

const AddTimetable = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [classId, setClassId] = useState("");
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [term, setTerm] = useState("1");
  const [schedule, setSchedule] = useState({});

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (classId) {
      fetchSubjects(classId);
      initializeSchedule();
    }
  }, [classId]);

  const fetchClasses = async () => {
    try {
      const response = await api.get(`/SclassList/${currentUser.school._id}`);
      if (response.data.success) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchSubjects = async (classId) => {
    try {
      const response = await api.get(`/ClassSubjects/${classId}`);
      if (response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get(`/Teachers/${currentUser.school._id}`);
      if (response.data.success) {
        setTeachers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const initializeSchedule = () => {
    const newSchedule = {};
    DAYS.forEach((day) => {
      newSchedule[day] = [
        {
          periodNumber: 1,
          startTime: "09:00",
          endTime: "09:45",
          type: "Class",
          subject: "",
          teacher: "",
          room: "",
        },
      ];
    });
    setSchedule(newSchedule);
  };

  const addPeriod = (day) => {
    const periods = schedule[day];
    const lastPeriod = periods[periods.length - 1];
    const newPeriod = {
      periodNumber: lastPeriod.periodNumber + 1,
      startTime: lastPeriod.endTime,
      endTime: "",
      type: "Class",
      subject: "",
      teacher: "",
      room: "",
    };
    setSchedule({
      ...schedule,
      [day]: [...periods, newPeriod],
    });
  };

  const removePeriod = (day, index) => {
    const periods = schedule[day].filter((_, i) => i !== index);
    setSchedule({
      ...schedule,
      [day]: periods,
    });
  };

  const updatePeriod = (day, index, field, value) => {
    const periods = [...schedule[day]];
    periods[index] = { ...periods[index], [field]: value };
    setSchedule({
      ...schedule,
      [day]: periods,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!classId) {
      setMessage("Please select a class");
      setShowPopup(true);
      return;
    }

    setLoading(true);
    try {
      const scheduleArray = Object.keys(schedule).map((day) => ({
        day,
        periods: schedule[day],
      }));

      const response = await api.post("/TimetableCreate", {
        class: classId,
        schedule: scheduleArray,
        academicYear,
        term,
        school: currentUser.school._id,
        isActive: true,
      });

      if (response.data.success) {
        setMessage("Timetable created successfully");
        setShowPopup(true);
        setTimeout(() => {
          navigate("/Admin/timetables");
        }, 1500);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating timetable");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Timetable
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                select
                label="Class"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}>
                {classes.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id}>
                    {cls.sclassName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Academic Year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                select
                label="Term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}>
                <MenuItem value="1">Term 1</MenuItem>
                <MenuItem value="2">Term 2</MenuItem>
                <MenuItem value="3">Term 3</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {classId && (
            <Box sx={{ mt: 4 }}>
              {DAYS.map((day) => (
                <Box key={day} sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}>
                    <Typography variant="h6">{day}</Typography>
                    <Button
                      size="small"
                      startIcon={<Add />}
                      onClick={() => addPeriod(day)}>
                      Add Period
                    </Button>
                  </Box>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Period</TableCell>
                          <TableCell>Start Time</TableCell>
                          <TableCell>End Time</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Subject</TableCell>
                          <TableCell>Teacher</TableCell>
                          <TableCell>Room</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {schedule[day]?.map((period, index) => (
                          <TableRow key={index}>
                            <TableCell>{period.periodNumber}</TableCell>
                            <TableCell>
                              <TextField
                                type="time"
                                size="small"
                                value={period.startTime}
                                onChange={(e) =>
                                  updatePeriod(
                                    day,
                                    index,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="time"
                                size="small"
                                value={period.endTime}
                                onChange={(e) =>
                                  updatePeriod(
                                    day,
                                    index,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                select
                                size="small"
                                value={period.type}
                                onChange={(e) =>
                                  updatePeriod(
                                    day,
                                    index,
                                    "type",
                                    e.target.value
                                  )
                                }
                                sx={{ minWidth: 100 }}>
                                {PERIOD_TYPES.map((type) => (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </TableCell>
                            <TableCell>
                              <TextField
                                select
                                size="small"
                                value={period.subject}
                                onChange={(e) =>
                                  updatePeriod(
                                    day,
                                    index,
                                    "subject",
                                    e.target.value
                                  )
                                }
                                disabled={period.type !== "Class"}
                                sx={{ minWidth: 120 }}>
                                {subjects.map((sub) => (
                                  <MenuItem key={sub._id} value={sub._id}>
                                    {sub.subName}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </TableCell>
                            <TableCell>
                              <TextField
                                select
                                size="small"
                                value={period.teacher}
                                onChange={(e) =>
                                  updatePeriod(
                                    day,
                                    index,
                                    "teacher",
                                    e.target.value
                                  )
                                }
                                disabled={period.type !== "Class"}
                                sx={{ minWidth: 120 }}>
                                {teachers.map((teacher) => (
                                  <MenuItem
                                    key={teacher._id}
                                    value={teacher._id}>
                                    {teacher.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                value={period.room}
                                onChange={(e) =>
                                  updatePeriod(
                                    day,
                                    index,
                                    "room",
                                    e.target.value
                                  )
                                }
                                sx={{ width: 80 }}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removePeriod(day, index)}>
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))}
            </Box>
          )}

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/Admin/timetables")}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !classId}>
              {loading ? <CircularProgress size={24} /> : "Create Timetable"}
            </Button>
          </Box>
        </Box>
      </Paper>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Container>
  );
};

export default AddTimetable;
