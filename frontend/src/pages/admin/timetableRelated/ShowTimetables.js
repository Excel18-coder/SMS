import { Add, Delete, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popup from "../../../components/Popup";
import api from "../../../utils/api";

const ShowTimetables = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      // For admin users, the school ID is their own ID
      const schoolId = currentUser.school?._id || currentUser._id;
      const response = await api.get(
        `/SchoolTimetables/${schoolId}`
      );
      if (response.data.success) {
        setTimetables(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching timetables:", error);
      setMessage("Error fetching timetables");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this timetable?")) {
      try {
        const response = await api.delete(`/Timetable/${id}`);
        if (response.data.success) {
          setMessage("Timetable deleted successfully");
          setShowPopup(true);
          fetchTimetables();
        }
      } catch (error) {
        setMessage(error.response?.data?.message || "Error deleting timetable");
        setShowPopup(true);
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          mt: 3,
        }}>
        <Typography variant="h4">Timetables</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/Admin/timetables/add")}>
          Create Timetable
        </Button>
      </Box>

      {timetables.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            No timetables found
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/Admin/timetables/add")}>
            Create First Timetable
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {timetables.map((timetable) => (
            <Grid item xs={12} sm={6} md={4} key={timetable._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {timetable.class?.sclassName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom>
                    Academic Year: {timetable.academicYear}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom>
                    Term: {timetable.term}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={timetable.isActive ? "Active" : "Inactive"}
                      color={timetable.isActive ? "success" : "default"}
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() =>
                      navigate(`/Admin/timetables/${timetable._id}`)
                    }>
                    View
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(timetable._id)}>
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Container>
  );
};

export default ShowTimetables;
