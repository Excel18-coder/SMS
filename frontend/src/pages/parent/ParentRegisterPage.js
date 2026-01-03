import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import bgpic from "../../assets/designlogin.jpg";
import { LightPurpleButton } from "../../components/buttonStyles";
import Popup from "../../components/Popup";
import { registerUser } from "../../redux/userRelated/userHandle";

const defaultTheme = createTheme();

const ParentRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [nameError, setNameError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");
    const phone = data.get("phone");
    const address = data.get("address");
    const adminID = data.get("adminID");

    if (!name || !email || !password || !phone) {
      if (!name) setNameError(true);
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      if (!phone) setPhoneError(true);
      return;
    }

    const fields = { name, email, password, phone, address, school: adminID };
    setLoader(true);
    dispatch(registerUser(fields, "Parent"));
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === "email") setEmailError(false);
    if (name === "password") setPasswordError(false);
    if (name === "phone") setPhoneError(false);
    if (name === "name") setNameError(false);
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Parent") {
        navigate("/Parent/dashboard");
      }
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, currentRole, navigate, error, response, currentUser]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
              Parent Registration
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
              Register as a parent to monitor your child's progress
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                error={nameError}
                helperText={nameError && "Name is required"}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={emailError}
                helperText={emailError && "Email is required"}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                autoComplete="tel"
                error={phoneError}
                helperText={phoneError && "Phone is required"}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                fullWidth
                id="address"
                label="Address"
                name="address"
                autoComplete="address"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={toggle ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                error={passwordError}
                helperText={passwordError && "Password is required"}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setToggle(!toggle)}>
                        {toggle ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="adminID"
                label="School Admin ID"
                id="adminID"
                helperText="Enter the School Admin ID provided by your school"
              />
              <LightPurpleButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register"
                )}
              </LightPurpleButton>
              <Grid container>
                <Grid item>
                  Already have an account?
                  <StyledLink to="/Parentlogin">{" Login"}</StyledLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${bgpic})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </ThemeProvider>
  );
};

export default ParentRegisterPage;

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;
