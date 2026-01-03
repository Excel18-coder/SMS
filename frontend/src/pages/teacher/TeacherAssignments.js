import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
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
import { format } from "date-fns";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/Popup";
import { getAllAssignments } from "../../redux/assignmentRelated/assignmentHandle";

const TeacherAssignments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { assignmentsList, loading, error, response } = useSelector(
    (state) => state.assignment
  );
  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    if (currentUser && currentUser.teachSubject?._id) {
      dispatch(getAllAssignments(currentUser.teachSubject._id, "Subject"));
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

  const getStatusChip = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    return <Chip label="Active" color="success" size="small" />;
  };

  const getSubmissionStats = (assignment) => {
    const submitted =
      assignment.submissions?.filter((s) => s.submitted).length || 0;
    const total = assignment.totalStudents || 0;
    return `${submitted}/${total}`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}>
          <Typography variant="h4">My Assignments</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/Teacher/assignments/add")}>
            Create Assignment
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {Array.isArray(assignmentsList) && assignmentsList.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Title</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Class</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Description</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Due Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Submissions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignmentsList.map((assignment) => (
                      <TableRow key={assignment._id}>
                        <TableCell>{assignment.title}</TableCell>
                        <TableCell>
                          {assignment.sclassName?.sclassName || "N/A"}
                        </TableCell>
                        <TableCell>{assignment.description}</TableCell>
                        <TableCell>
                          {assignment.dueDate
                            ? format(
                                new Date(assignment.dueDate),
                                "MMM dd, yyyy"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {getStatusChip(assignment.dueDate)}
                        </TableCell>
                        <TableCell>{getSubmissionStats(assignment)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  No assignments created yet
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/Teacher/assignments/add")}
                  sx={{ mt: 2 }}>
                  Create Your First Assignment
                </Button>
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

export default TeacherAssignments;
