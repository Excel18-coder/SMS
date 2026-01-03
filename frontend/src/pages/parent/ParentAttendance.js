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
import { getStudentById } from "../../redux/studentRelated/studentHandle";

const ParentAttendance = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // student id
  const { studentDetails, loading, error, response } = useSelector(
    (state) => state.student
  );
  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    if (id) {
      dispatch(getStudentById(id, "Student"));
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

  const getStatusChip = (status) => {
    return status === "Present" ? (
      <Chip label="Present" color="success" size="small" />
    ) : (
      <Chip label="Absent" color="error" size="small" />
    );
  };

  const calculateAttendancePercentage = () => {
    if (
      !studentDetails ||
      !Array.isArray(studentDetails.attendance) ||
      studentDetails.attendance.length === 0
    ) {
      return 0;
    }
    const presentCount = studentDetails.attendance.filter(
      (att) => att.status === "Present"
    ).length;
    return ((presentCount / studentDetails.attendance.length) * 100).toFixed(2);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Child's Attendance
        </Typography>

        {studentDetails && (
          <Box sx={{ mb: 3, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
            <Typography variant="h6">
              Overall Attendance: {calculateAttendancePercentage()}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Records: {studentDetails.attendance?.length || 0}
            </Typography>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {studentDetails &&
            Array.isArray(studentDetails.attendance) &&
            studentDetails.attendance.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Subject</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentDetails.attendance
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {record.date
                              ? format(new Date(record.date), "MMM dd, yyyy")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {record.subName?.subName || "N/A"}
                          </TableCell>
                          <TableCell>{getStatusChip(record.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  No attendance records found
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

export default ParentAttendance;
