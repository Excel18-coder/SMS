import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
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
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popup from "../../components/Popup";
import { getAllBooks } from "../../redux/libraryRelated/libraryHandle";

const StudentLibrary = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { booksList, loading, error, response } = useSelector(
    (state) => state.library
  );
  const [showPopup, setShowPopup] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    if (currentUser && currentUser.school) {
      dispatch(getAllBooks(currentUser.school._id, "School"));
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

  const filteredBooks = Array.isArray(booksList)
    ? booksList.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getAvailabilityChip = (available, totalCopies) => {
    if (available > 0) {
      return (
        <Chip
          label={`Available (${available}/${totalCopies})`}
          color="success"
          size="small"
        />
      );
    }
    return <Chip label="Not Available" color="error" size="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Library Books
        </Typography>

        <TextField
          fullWidth
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {filteredBooks.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Title</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Author</strong>
                      </TableCell>
                      <TableCell>
                        <strong>ISBN</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Category</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Availability</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Location</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBooks.map((book) => (
                      <TableRow key={book._id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.isbn}</TableCell>
                        <TableCell>{book.category}</TableCell>
                        <TableCell>
                          {getAvailabilityChip(
                            book.availableCopies,
                            book.totalCopies
                          )}
                        </TableCell>
                        <TableCell>{book.shelfLocation || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  {searchTerm
                    ? "No books match your search"
                    : "No books available"}
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

export default StudentLibrary;
