import React, { useState, useEffect } from 'react';
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

const ComposeMessage = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    
    const [recipientType, setRecipientType] = useState('Student');
    const [recipientId, setRecipientId] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [category, setCategory] = useState('General');
    
    const [recipients, setRecipients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        fetchRecipients();
    }, [recipientType]);

    const fetchRecipients = async () => {
        try {
            let endpoint = '';
            if (recipientType === 'Student') {
                endpoint = `/Students/${currentUser.school._id}`;
            } else if (recipientType === 'Teacher') {
                endpoint = `/Teachers/${currentUser.school._id}`;
            } else if (recipientType === 'Parent') {
                endpoint = `/Parents/${currentUser.school._id}`;
            }

            if (endpoint) {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}${endpoint}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setRecipients(data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching recipients:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!recipientId || !subject || !message) {
            setPopupMessage('Please fill all required fields');
            setShowPopup(true);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/MessageSend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    sender: currentUser._id,
                    senderModel: currentUser.role,
                    recipient: recipientId,
                    recipientModel: recipientType,
                    school: currentUser.school._id,
                    subject,
                    message,
                    priority,
                    category
                })
            });

            const data = await response.json();
            if (data.success) {
                setPopupMessage('Message sent successfully');
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/Admin/messages');
                }, 1500);
            } else {
                setPopupMessage(data.message || 'Error sending message');
                setShowPopup(true);
            }
        } catch (error) {
            setPopupMessage('Error sending message');
            setShowPopup(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Compose Message
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Recipient Type"
                                value={recipientType}
                                onChange={(e) => {
                                    setRecipientType(e.target.value);
                                    setRecipientId('');
                                }}
                            >
                                <MenuItem value="Student">Student</MenuItem>
                                <MenuItem value="Teacher">Teacher</MenuItem>
                                <MenuItem value="Parent">Parent</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Recipient"
                                value={recipientId}
                                onChange={(e) => setRecipientId(e.target.value)}
                            >
                                {recipients.map((recipient) => (
                                    <MenuItem key={recipient._id} value={recipient._id}>
                                        {recipient.name} {recipient.rollNum ? `- ${recipient.rollNum}` : ''}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Normal">Normal</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Urgent">Urgent</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <MenuItem value="Academic">Academic</MenuItem>
                                <MenuItem value="Attendance">Attendance</MenuItem>
                                <MenuItem value="Fees">Fees</MenuItem>
                                <MenuItem value="Discipline">Discipline</MenuItem>
                                <MenuItem value="General">General</MenuItem>
                                <MenuItem value="Event">Event</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={8}
                                label="Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/Admin/messages')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Send Message'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            <Popup message={popupMessage} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ComposeMessage;
