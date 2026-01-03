import {
  Box,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserDetails } from "../../redux/userRelated/userHandle";

const ChildPerformance = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userDetails, loading } = useSelector((state) => state.user);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    dispatch(getUserDetails(id, "Student"));
  }, [dispatch, id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {userDetails?.name}'s Performance
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Roll Number: {userDetails?.rollNum} | Class:{" "}
          {userDetails?.sclassName?.sclassName}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Attendance" />
            <Tab label="Exam Results" />
            <Tab label="Assignments" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Attendance Records
            </Typography>
            {userDetails?.attendance && userDetails.attendance.length > 0 ? (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {userDetails.attendance.map((record, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="body1">
                        Subject: {record.subName?.subName || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Date: {new Date(record.date).toLocaleDateString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={
                          record.status === "Present"
                            ? "success.main"
                            : "error.main"
                        }>
                        Status: {record.status}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                No attendance records available
              </Typography>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Exam Results
            </Typography>
            {userDetails?.examResult && userDetails.examResult.length > 0 ? (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {userDetails.examResult.map((result, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6">
                        {result.subName?.subName || "N/A"}
                      </Typography>
                      <Typography variant="body1">
                        Marks: {result.marksObtained} /{" "}
                        {result.totalMarks || 100}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Percentage:{" "}
                        {(
                          (result.marksObtained / (result.totalMarks || 100)) *
                          100
                        ).toFixed(2)}
                        %
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                No exam results available
              </Typography>
            )}
          </Box>
        )}

        {tabValue === 2 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Assignments
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Assignment tracking will be available soon
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ChildPerformance;
