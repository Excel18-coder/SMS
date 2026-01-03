import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    Container, 
    Grid, 
    Paper, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    MenuItem,
    CircularProgress
} from '@mui/material';
import Popup from '../../../components/Popup';

const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'Mathematics', 'History', 'Literature', 'Reference', 'Biography', 'Other'];

const AddBook = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [isbn, setIsbn] = useState('');
    const [category, setCategory] = useState('Other');
    const [publisher, setPublisher] = useState('');
    const [publishYear, setPublishYear] = useState('');
    const [totalCopies, setTotalCopies] = useState(1);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !author || !isbn) {
            setMessage('Please fill all required fields');
            setShowPopup(true);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/LibraryBook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title,
                    author,
                    isbn,
                    category,
                    publisher,
                    publishYear,
                    totalCopies: parseInt(totalCopies),
                    availableCopies: parseInt(totalCopies),
                    school: currentUser.school._id,
                    location,
                    description
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessage('Book added successfully');
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/Admin/library');
                }, 1500);
            } else {
                setMessage(data.message || 'Error adding book');
                setShowPopup(true);
            }
        } catch (error) {
            setMessage('Error adding book');
            setShowPopup(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Add Book to Library
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Book Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="ISBN"
                                value={isbn}
                                onChange={(e) => setIsbn(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {CATEGORIES.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Publisher"
                                value={publisher}
                                onChange={(e) => setPublisher(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Publish Year"
                                value={publishYear}
                                onChange={(e) => setPublishYear(e.target.value)}
                                InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                label="Total Copies"
                                value={totalCopies}
                                onChange={(e) => setTotalCopies(e.target.value)}
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Location (Shelf/Section)"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/Admin/library')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Add Book'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default AddBook;
