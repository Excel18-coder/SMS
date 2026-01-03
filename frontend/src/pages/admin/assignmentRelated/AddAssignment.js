import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popup from "../../../components/Popup";
import { createAssignment } from "../../../redux/assignmentRelated/assignmentHandle";
import api from "../../../utils/api";

const AddAssignment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const {
    loading,
    status,
    message: reduxMessage,
  } = useSelector((state) => state.assignment);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [classId, setClassId] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [maxMarks, setMaxMarks] = useState(100);

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (classId) {
      fetchSubjects(classId);
    } else {
      setSubjects([]);
      setSubject("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !subject || !classId) {
      setMessage("Please fill all required fields");
      setShowPopup(true);
      return;
    }

    const assignmentData = {
      title,
      description,
      subject,
      class: classId,
      teacher: currentUser._id,
      school: currentUser.school._id,
      dueDate,
      maxMarks: parseInt(maxMarks),
    };

    const result = await dispatch(createAssignment(assignmentData));

    if (result.success) {
      setMessage("Assignment created successfully!");
      setShowPopup(true);
      setTimeout(() => {
        navigate("/Admin/assignments");
      }, 1500);
    } else {
      setMessage(result.message || "Error creating assignment");
      setShowPopup(true);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Assignment
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Assignment Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={!classId}>
                {subjects.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.subName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={(newValue) => setDueDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Maximum Marks"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/Admin/assignments")}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Create Assignment"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
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

export default AddAssignment;
