import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import styled from "styled-components";

const ParentProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Information
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">
                Name
              </Typography>
              <Typography variant="h6">{currentUser?.name}</Typography>
            </InfoBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="h6">{currentUser?.email}</Typography>
            </InfoBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">
                Phone
              </Typography>
              <Typography variant="h6">
                {currentUser?.phone || "N/A"}
              </Typography>
            </InfoBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">
                Number of Children
              </Typography>
              <Typography variant="h6">
                {currentUser?.children?.length || 0}
              </Typography>
            </InfoBox>
          </Grid>
          <Grid item xs={12}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">
                Address
              </Typography>
              <Typography variant="h6">
                {currentUser?.address || "N/A"}
              </Typography>
            </InfoBox>
          </Grid>
          <Grid item xs={12}>
            <InfoBox>
              <Typography variant="subtitle2" color="textSecondary">
                School
              </Typography>
              <Typography variant="h6">
                {currentUser?.school?.schoolName || "N/A"}
              </Typography>
            </InfoBox>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ParentProfile;

const InfoBox = styled(Box)`
  padding: 12px;
  border-left: 3px solid #7f56da;
  background-color: #f5f5f5;
  border-radius: 4px;
`;
