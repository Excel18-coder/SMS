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
import { format } from "date-fns";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Popup from "../../components/Popup";
import { getAllAssignments } from "../../redux/assignmentRelated/assignmentHandle";

const ParentAssignments = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // student id
  const { assignmentsList, loading, error, response } = useSelector(
    (state) => state.assignment
  );
  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    if (id) {
      dispatch(getAllAssignments(id, "Student"));
    }
  }, [id, dispatch]);

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

  const getStatusChip = (dueDate, submitted) => {
    if (submitted) {
      return <Chip label="Submitted" color="success" size="small" />;
    }
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) {
      return <Chip label="Overdue" color="error" size="small" />;
    }
    return <Chip label="Pending" color="warning" size="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Child's Assignments
        </Typography>

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
                        <strong>Subject</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Title</strong>
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
                        <strong>Grade</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignmentsList.map((assignment) => (
                      <TableRow key={assignment._id}>
                        <TableCell>
                          {assignment.subName?.subName || "N/A"}
                        </TableCell>
                        <TableCell>{assignment.title}</TableCell>
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
                          {getStatusChip(
                            assignment.dueDate,
                            assignment.submitted
                          )}
                        </TableCell>
                        <TableCell>
                          {assignment.grade || "Not graded"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  No assignments found
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

export default ParentAssignments;
