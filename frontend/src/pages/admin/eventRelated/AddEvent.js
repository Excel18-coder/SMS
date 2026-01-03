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
    FormControlLabel,
    Checkbox,
    Chip,
    CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Popup from '../../../components/Popup';

const EVENT_TYPES = ['Holiday', 'Exam', 'Meeting', 'Sports', 'Cultural', 'PTA', 'Other'];
const TARGET_AUDIENCES = ['All', 'Students', 'Teachers', 'Parents', 'Admin'];

const AddEvent = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Other');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [location, setLocation] = useState('');
    const [targetAudience, setTargetAudience] = useState(['All']);
    
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const handleAudienceToggle = (audience) => {
        if (audience === 'All') {
            setTargetAudience(['All']);
        } else {
            const filtered = targetAudience.filter(a => a !== 'All');
            if (filtered.includes(audience)) {
                const newAudience = filtered.filter(a => a !== audience);
                setTargetAudience(newAudience.length > 0 ? newAudience : ['All']);
            } else {
                setTargetAudience([...filtered, audience]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !description) {
            setMessage('Please fill all required fields');
            setShowPopup(true);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/EventCreate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    type,
                    startDate,
                    endDate,
                    location,
                    school: currentUser.school._id,
                    targetAudience,
                    organizer: currentUser._id,
                    status: 'Scheduled'
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessage('Event created successfully');
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/Admin/events');
                }, 1500);
            } else {
                setMessage(data.message || 'Error creating event');
                setShowPopup(true);
            }
        } catch (error) {
            setMessage('Error creating event');
            setShowPopup(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Create Event
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Event Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Event Type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                {EVENT_TYPES.map((t) => (
                                    <MenuItem key={t} value={t}>
                                        {t}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Start Date & Time"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="End Date & Time"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Target Audience
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {TARGET_AUDIENCES.map((audience) => (
                                    <Chip
                                        key={audience}
                                        label={audience}
                                        onClick={() => handleAudienceToggle(audience)}
                                        color={targetAudience.includes(audience) ? 'primary' : 'default'}
                                        variant={targetAudience.includes(audience) ? 'filled' : 'outlined'}
                                    />
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/Admin/events')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Create Event'}
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

export default AddEvent;
