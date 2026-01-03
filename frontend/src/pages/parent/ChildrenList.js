import ChildCareIcon from "@mui/icons-material/ChildCare";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChildrenList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const children = currentUser?.children || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Children
        </Typography>
        {children.length === 0 ? (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 3 }}>
            No children linked to your account. Please contact the school
            administrator to link your children.
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {children.map((child) => (
              <Grid item xs={12} sm={6} md={4} key={child._id}>
                <Card>
                  <CardContent>
                    <ChildCareIcon
                      sx={{ fontSize: 48, color: "#7f56da", mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {child.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Roll Number: {child.rollNum}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Class: {child.sclassName?.sclassName}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/Parent/child/${child._id}`)}>
                      View Performance
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default ChildrenList;
