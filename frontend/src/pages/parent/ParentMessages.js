import { Container, Paper, Typography } from "@mui/material";

const ParentMessages = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Messages
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 3 }}>
          Messaging system will be available soon. You'll be able to communicate
          with teachers and school administration.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ParentMessages;
