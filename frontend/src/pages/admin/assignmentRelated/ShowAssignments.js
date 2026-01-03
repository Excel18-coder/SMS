import { Add, Delete, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popup from "../../../components/Popup";
import { deleteAssignment } from "../../../redux/assignmentRelated/assignmentHandle";
import api from "../../../utils/api";

const ShowAssignments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      // Fetch all classes first
      const classResponse = await api.get(
        `/SclassList/${currentUser.school._id}`
      );
      if (classResponse.data.success) {
        const allAssignments = [];
        for (const cls of classResponse.data.data) {
          try {
            const response = await api.get(`/Assignments/${cls._id}`);
            if (response.data.success && response.data.data) {
              allAssignments.push(...response.data.data);
            }
          } catch (error) {
            // Skip if no assignments for this class
            console.log(`No assignments for class ${cls.sclassName}`);
          }
        }
        setAssignments(allAssignments);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setMessage("Error fetching assignments");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      const result = await dispatch(deleteAssignment(id));
      if (result.success) {
        setMessage("Assignment deleted successfully");
        setShowPopup(true);
        fetchAssignments(); // Refresh the list
      } else {
        setMessage(result.message || "Error deleting assignment");
        setShowPopup(true);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Closed":
        return "default";
      case "Draft":
        return "warning";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
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
        <Typography variant="h4">Assignments</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/Admin/assignments/add")}>
          Create Assignment
        </Button>
      </Box>

      {assignments.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            No assignments found
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/Admin/assignments/add")}>
            Create First Assignment
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Max Marks</TableCell>
                <TableCell>Submissions</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment._id}>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{assignment.subject?.subName}</TableCell>
                  <TableCell>{assignment.class?.sclassName}</TableCell>
                  <TableCell>
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{assignment.maxMarks}</TableCell>
                  <TableCell>{assignment.submissions?.length || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={assignment.status}
                      color={getStatusColor(assignment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigate(`/Admin/assignments/${assignment._id}`)
                      }>
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(assignment._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Container>
  );
};

export default ShowAssignments;
