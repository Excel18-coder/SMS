import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
    Container, 
    Paper, 
    Typography, 
    Box,
    Button,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Chip,
    IconButton,
    Badge
} from '@mui/material';
import { Add, Delete, MarkEmailRead } from '@mui/icons-material';
import Popup from '../../../components/Popup';

const ShowMessages = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    
    const [activeTab, setActiveTab] = useState(0);
    const [inboxMessages, setInboxMessages] = useState([]);
    const [sentMessages, setSentMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchMessages();
        fetchUnreadCount();
    }, []);

    const fetchMessages = async () => {
        try {
            // Fetch inbox
            const inboxResponse = await fetch(
                `${process.env.REACT_APP_BASE_URL}/MessagesInbox/${currentUser._id}/${currentUser.role}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            const inboxData = await inboxResponse.json();
            if (inboxData.success) {
                setInboxMessages(inboxData.data);
            }

            // Fetch sent
            const sentResponse = await fetch(
                `${process.env.REACT_APP_BASE_URL}/MessagesSent/${currentUser._id}/${currentUser.role}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            const sentData = await sentResponse.json();
            if (sentData.success) {
                setSentMessages(sentData.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessage('Error fetching messages');
            setShowPopup(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/MessagesUnreadCount/${currentUser._id}/${currentUser.role}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            const data = await response.json();
            if (data.success) {
                setUnreadCount(data.count);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const handleMarkAsRead = async (messageId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/MessageRead/${messageId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                fetchMessages();
                fetchUnreadCount();
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleDelete = async (messageId) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/Message/${messageId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setMessage('Message deleted');
                    setShowPopup(true);
                    fetchMessages();
                }
            } catch (error) {
                setMessage('Error deleting message');
                setShowPopup(true);
            }
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Urgent': return 'error';
            case 'High': return 'warning';
            case 'Normal': return 'info';
            case 'Low': return 'default';
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

    const messages = activeTab === 0 ? inboxMessages : sentMessages;

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 3 }}>
                <Typography variant="h4">
                    Messages
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/Admin/messages/compose')}
                >
                    Compose
                </Button>
            </Box>

            <Paper sx={{ mb: 2 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab 
                        label={
                            <Badge badgeContent={unreadCount} color="error">
                                Inbox
                            </Badge>
                        } 
                    />
                    <Tab label="Sent" />
                </Tabs>
            </Paper>

            {messages.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        No messages
                    </Typography>
                </Paper>
            ) : (
                <Paper>
                    <List>
                        {messages.map((msg, index) => (
                            <React.Fragment key={msg._id}>
                                <ListItem
                                    sx={{
                                        bgcolor: msg.isRead ? 'transparent' : 'action.hover',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'action.selected' }
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: msg.isRead ? 'normal' : 'bold' }}>
                                                    {msg.subject}
                                                </Typography>
                                                <Chip 
                                                    label={msg.priority} 
                                                    size="small" 
                                                    color={getPriorityColor(msg.priority)}
                                                />
                                                <Chip 
                                                    label={msg.category} 
                                                    size="small" 
                                                    variant="outlined"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="textSecondary">
                                                    {activeTab === 0 
                                                        ? `From: ${msg.sender?.name}` 
                                                        : `To: ${msg.recipient?.name}`
                                                    }
                                                </Typography>
                                                <Typography variant="body2">
                                                    {msg.message.substring(0, 100)}...
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {new Date(msg.createdAt).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                    <Box>
                                        {!msg.isRead && activeTab === 0 && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleMarkAsRead(msg._id)}
                                            >
                                                <MarkEmailRead />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(msg._id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                                {index < messages.length - 1 && <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e0e0e0' }} />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ShowMessages;
