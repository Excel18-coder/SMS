import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
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
import Popup from "../../components/Popup";
import { getAllFees } from "../../redux/feeRelated/feeHandle";

const StudentFees = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { feesList, loading, error, response } = useSelector(
    (state) => state.fee
  );
  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");

  useEffect(() => {
    if (currentUser && currentUser._id) {
      dispatch(getAllFees(currentUser._id, "Student"));
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

  const calculateTotals = () => {
    if (!Array.isArray(feesList) || feesList.length === 0) {
      return { total: 0, paid: 0, pending: 0 };
    }
    const total = feesList.reduce((sum, fee) => sum + (fee.amount || 0), 0);
    const paid = feesList.reduce(
      (sum, fee) => (fee.status === "Paid" ? sum + (fee.amount || 0) : sum),
      0
    );
    const pending = total - paid;
    return { total, paid, pending };
  };

  const totals = calculateTotals();

  const getStatusChip = (status) => {
    const statusColors = {
      Paid: "success",
      Pending: "warning",
      Overdue: "error",
    };
    return (
      <Chip
        label={status}
        color={statusColors[status] || "default"}
        size="small"
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fee Records
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Fees
              </Typography>
              <Typography variant="h5">${totals.total.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "success.light" }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Paid
              </Typography>
              <Typography variant="h5">${totals.paid.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "warning.light" }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h5">${totals.pending.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {Array.isArray(feesList) && feesList.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Fee Type</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Amount</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Due Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Paid Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Payment Method</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feesList.map((fee) => (
                      <TableRow key={fee._id}>
                        <TableCell>{fee.feeType}</TableCell>
                        <TableCell>${fee.amount?.toFixed(2)}</TableCell>
                        <TableCell>
                          {fee.dueDate
                            ? format(new Date(fee.dueDate), "MMM dd, yyyy")
                            : "N/A"}
                        </TableCell>
                        <TableCell>{getStatusChip(fee.status)}</TableCell>
                        <TableCell>
                          {fee.paidDate
                            ? format(new Date(fee.paidDate), "MMM dd, yyyy")
                            : "N/A"}
                        </TableCell>
                        <TableCell>{fee.paymentMethod || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  No fee records found
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

export default StudentFees;
