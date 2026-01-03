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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popup from "../../../components/Popup";

const AddFee = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [studentId, setStudentId] = useState("");
  const [classId, setClassId] = useState("");
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [dueDate, setDueDate] = useState(new Date());

  const [feeStructure, setFeeStructure] = useState({
    tuitionFee: 0,
    transportFee: 0,
    libraryFee: 0,
    labFee: 0,
    sportsFee: 0,
    otherFees: 0,
  });

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (classId) {
      fetchStudents(classId);
    }
  }, [classId]);

  const fetchClasses = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/SclassList/${currentUser.school._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setClasses(data.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchStudents = async (classId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/Sclass/Students/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleFeeChange = (field, value) => {
    setFeeStructure({
      ...feeStructure,
      [field]: parseFloat(value) || 0,
    });
  };

  const calculateTotal = () => {
    return Object.values(feeStructure).reduce((sum, val) => sum + val, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId || !classId) {
      setMessage("Please select student and class");
      setShowPopup(true);
      return;
    }

    const totalFee = calculateTotal();
    if (totalFee <= 0) {
      setMessage("Please enter fee amounts");
      setShowPopup(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/FeeCreate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            student: studentId,
            school: currentUser.school._id,
            class: classId,
            academicYear,
            feeStructure,
            totalFee,
            paidAmount: 0,
            remainingAmount: totalFee,
            dueDate,
            status: "Pending",
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage("Fee record created successfully");
        setShowPopup(true);
        setTimeout(() => {
          navigate("/Admin/fees");
        }, 1500);
      } else {
        setMessage(data.message || "Error creating fee record");
        setShowPopup(true);
      }
    } catch (error) {
      setMessage("Error creating fee record");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Fee Record
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
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
                label="Student"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={!classId}>
                {students.map((student) => (
                  <MenuItem key={student._id} value={student._id}>
                    {student.name} - {student.rollNum}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Academic Year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={(newValue) => setDueDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Fee Structure
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Tuition Fee"
                value={feeStructure.tuitionFee}
                onChange={(e) => handleFeeChange("tuitionFee", e.target.value)}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Transport Fee"
                value={feeStructure.transportFee}
                onChange={(e) =>
                  handleFeeChange("transportFee", e.target.value)
                }
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Library Fee"
                value={feeStructure.libraryFee}
                onChange={(e) => handleFeeChange("libraryFee", e.target.value)}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Lab Fee"
                value={feeStructure.labFee}
                onChange={(e) => handleFeeChange("labFee", e.target.value)}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Sports Fee"
                value={feeStructure.sportsFee}
                onChange={(e) => handleFeeChange("sportsFee", e.target.value)}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Other Fees"
                value={feeStructure.otherFees}
                onChange={(e) => handleFeeChange("otherFees", e.target.value)}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                }}>
                <Typography variant="h6">
                  Total Fee: ${calculateTotal().toFixed(2)}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/Admin/fees")}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Create Fee Record"
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

export default AddFee;
