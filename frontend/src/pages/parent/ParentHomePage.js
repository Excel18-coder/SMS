import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import EventIcon from "@mui/icons-material/Event";
import MessageIcon from "@mui/icons-material/Message";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import styled from "styled-components";

const ParentHomePage = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: "flex", flexDirection: "column" }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {currentUser?.name}!
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Monitor your children's academic progress and stay connected with
              the school
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StyledPaper>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <ChildCareIcon sx={{ fontSize: 40, color: "#7f56da", mr: 2 }} />
              <div>
                <Typography variant="h6">Children</Typography>
                <Typography variant="h4">
                  {currentUser?.children?.length || 0}
                </Typography>
              </div>
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StyledPaper>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <MessageIcon sx={{ fontSize: 40, color: "#2196f3", mr: 2 }} />
              <div>
                <Typography variant="h6">Messages</Typography>
                <Typography variant="h4">0</Typography>
              </div>
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StyledPaper>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EventIcon sx={{ fontSize: 40, color: "#4caf50", mr: 2 }} />
              <div>
                <Typography variant="h6">Events</Typography>
                <Typography variant="h4">0</Typography>
              </div>
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StyledPaper>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AccountBalanceIcon
                sx={{ fontSize: 40, color: "#ff9800", mr: 2 }}
              />
              <div>
                <Typography variant="h6">Fees</Typography>
                <Typography variant="h4">Pending</Typography>
              </div>
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • View your children's attendance and performance
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Check fee payment status
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Send messages to teachers
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • View upcoming school events
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ParentHomePage;

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 120px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
