import { Add, Payment } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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

const ShowFees = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const classResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/SclassList/${currentUser.school._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const classData = await classResponse.json();

      if (classData.success) {
        const allFees = [];
        for (const cls of classData.data) {
          const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/FeesClass/${cls._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();
          if (data.success) {
            allFees.push(...data.data);
          }
        }
        setFees(allFees);
      }
    } catch (error) {
      console.error("Error fetching fees:", error);
      setMessage("Error fetching fees");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Partial":
        return "warning";
      case "Pending":
        return "info";
      case "Overdue":
        return "error";
      default:
        return "default";
    }
  };

  const handleOpenPayment = (fee) => {
    setSelectedFee(fee);
    setPaymentAmount(fee.remainingAmount);
    setPaymentDialog(true);
  };

  const handleAddPayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      setMessage("Please enter valid payment amount");
      setShowPopup(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/FeePayment/${selectedFee._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: parseFloat(paymentAmount),
            paymentMethod,
            transactionId,
            receivedBy: currentUser._id,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage("Payment recorded successfully");
        setShowPopup(true);
        setPaymentDialog(false);
        fetchFees();
      } else {
        setMessage(data.message || "Error recording payment");
        setShowPopup(true);
      }
    } catch (error) {
      setMessage("Error recording payment");
      setShowPopup(true);
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
        <Typography variant="h4">Fee Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/Admin/fees/add")}>
          Create Fee Record
        </Button>
      </Box>

      {fees.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            No fee records found
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/Admin/fees/add")}>
            Create First Fee Record
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Academic Year</TableCell>
                <TableCell>Total Fee</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Remaining</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee._id}>
                  <TableCell>{fee.student?.name}</TableCell>
                  <TableCell>{fee.class?.sclassName}</TableCell>
                  <TableCell>{fee.academicYear}</TableCell>
                  <TableCell>${fee.totalFee}</TableCell>
                  <TableCell>${fee.paidAmount}</TableCell>
                  <TableCell>${fee.remainingAmount}</TableCell>
                  <TableCell>
                    {new Date(fee.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={fee.status}
                      color={getStatusColor(fee.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenPayment(fee)}
                      disabled={fee.status === "Paid"}>
                      <Payment />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={paymentDialog}
        onClose={() => setPaymentDialog(false)}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>Add Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                inputProps: { min: 0, max: selectedFee?.remainingAmount },
              }}
            />
            <TextField
              fullWidth
              select
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              sx={{ mb: 2 }}
              SelectProps={{ native: true }}>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Online">Online</option>
              <option value="Card">Card</option>
            </TextField>
            <TextField
              fullWidth
              label="Transaction ID (Optional)"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPayment} variant="contained">
            Add Payment
          </Button>
        </DialogActions>
      </Dialog>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Container>
  );
};

export default ShowFees;
