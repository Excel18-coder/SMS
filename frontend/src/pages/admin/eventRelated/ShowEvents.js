import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    Container, 
    Paper, 
    Typography, 
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Chip,
    IconButton
} from '@mui/material';
import { Add, Delete, Edit, Event as EventIcon } from '@mui/icons-material';
import Popup from '../../../components/Popup';

const ShowEvents = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/EventsSchool/${currentUser.school._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setMessage('Error fetching events');
            setShowPopup(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/Event/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setMessage('Event deleted successfully');
                    setShowPopup(true);
                    fetchEvents();
                }
            } catch (error) {
                setMessage('Error deleting event');
                setShowPopup(true);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled': return 'info';
            case 'Ongoing': return 'warning';
            case 'Completed': return 'success';
            case 'Cancelled': return 'error';
            default: return 'default';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Holiday': return 'success';
            case 'Exam': return 'error';
            case 'Meeting': return 'info';
            case 'Sports': return 'warning';
            case 'Cultural': return 'secondary';
            default: return 'default';
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
                    Events Calendar
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/Admin/events/add')}
                >
                    Create Event
                </Button>
            </Box>

            {events.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        No events found
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/Admin/events/add')}
                    >
                        Create First Event
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {events.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Chip 
                                            label={event.type} 
                                            color={getTypeColor(event.type)}
                                            size="small"
                                        />
                                        <Chip 
                                            label={event.status} 
                                            color={getStatusColor(event.status)}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="h6" gutterBottom>
                                        {event.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        {event.description.substring(0, 100)}...
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            📅 {new Date(event.startDate).toLocaleDateString()}
                                        </Typography>
                                        {event.location && (
                                            <Typography variant="body2" color="textSecondary">
                                                📍 {event.location}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {event.targetAudience?.map((audience) => (
                                            <Chip
                                                key={audience}
                                                label={audience}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(event._id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ShowEvents;
