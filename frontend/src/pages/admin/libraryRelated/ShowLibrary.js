import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    Container, 
    Paper, 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Button,
    Chip,
    IconButton,
    Box,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Add, Delete, Edit, BookmarkAdd } from '@mui/icons-material';
import Popup from '../../../components/Popup';

const ShowLibrary = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    
    const [books, setBooks] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    
    const [issueDialog, setIssueDialog] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [borrowerType, setBorrowerType] = useState('Student');
    const [borrowerId, setBorrowerId] = useState('');

    useEffect(() => {
        fetchBooks();
        fetchStudents();
        fetchTeachers();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/LibraryBooks/${currentUser.school._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setBooks(data.data);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            setMessage('Error fetching books');
            setShowPopup(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/Students/${currentUser.school._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setStudents(data.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/Teachers/${currentUser.school._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setTeachers(data.data);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/LibraryBook/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setMessage('Book deleted successfully');
                    setShowPopup(true);
                    fetchBooks();
                } else {
                    setMessage(data.message || 'Error deleting book');
                    setShowPopup(true);
                }
            } catch (error) {
                setMessage('Error deleting book');
                setShowPopup(true);
            }
        }
    };

    const handleOpenIssue = (book) => {
        setSelectedBook(book);
        setIssueDialog(true);
    };

    const handleIssueBook = async () => {
        if (!borrowerId) {
            setMessage('Please select a borrower');
            setShowPopup(true);
            return;
        }

        try {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14); // 2 weeks

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/LibraryIssue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    book: selectedBook._id,
                    borrower: borrowerId,
                    borrowerModel: borrowerType,
                    school: currentUser.school._id,
                    dueDate,
                    issuedBy: currentUser._id
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessage('Book issued successfully');
                setShowPopup(true);
                setIssueDialog(false);
                fetchBooks();
            } else {
                setMessage(data.message || 'Error issuing book');
                setShowPopup(true);
            }
        } catch (error) {
            setMessage('Error issuing book');
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 3 }}>
                <Typography variant="h4">
                    Library Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/Admin/library/add')}
                >
                    Add Book
                </Button>
            </Box>

            {books.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        No books found
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/Admin/library/add')}
                    >
                        Add First Book
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>ISBN</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Total Copies</TableCell>
                                <TableCell>Available</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books.map((book) => (
                                <TableRow key={book._id}>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{book.isbn}</TableCell>
                                    <TableCell>
                                        <Chip label={book.category} size="small" />
                                    </TableCell>
                                    <TableCell>{book.totalCopies}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={book.availableCopies} 
                                            color={book.availableCopies > 0 ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{book.location || '-'}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleOpenIssue(book)}
                                            disabled={book.availableCopies === 0}
                                        >
                                            <BookmarkAdd />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(book._id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={issueDialog} onClose={() => setIssueDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Issue Book</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Book: {selectedBook?.title}
                        </Typography>
                        <TextField
                            fullWidth
                            select
                            label="Borrower Type"
                            value={borrowerType}
                            onChange={(e) => {
                                setBorrowerType(e.target.value);
                                setBorrowerId('');
                            }}
                            sx={{ mb: 2, mt: 2 }}
                        >
                            <MenuItem value="Student">Student</MenuItem>
                            <MenuItem value="Teacher">Teacher</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            select
                            label={borrowerType}
                            value={borrowerId}
                            onChange={(e) => setBorrowerId(e.target.value)}
                        >
                            {borrowerType === 'Student' 
                                ? students.map((student) => (
                                    <MenuItem key={student._id} value={student._id}>
                                        {student.name} - {student.rollNum}
                                    </MenuItem>
                                ))
                                : teachers.map((teacher) => (
                                    <MenuItem key={teacher._id} value={teacher._id}>
                                        {teacher.name}
                                    </MenuItem>
                                ))
                            }
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIssueDialog(false)}>Cancel</Button>
                    <Button onClick={handleIssueBook} variant="contained">
                        Issue Book
                    </Button>
                </DialogActions>
            </Dialog>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ShowLibrary;
