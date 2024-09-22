import React, { useState } from "react";
import { TextField, Button, Typography, Box } from '@mui/material';
import "./auth.css";
import api from "../../api/api";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";

// Login component that receives two props: onLogin (function to handle successful login) 
// and onSwitchToRegister (function to switch to the registration form).
const Login = ({ onLogin, onSwitchToRegister }) => {
  // State hooks to manage email and password input fields.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State hook to handle authentication error messages.
  const [authError, setAuthError] = useState("");
  
  // Hook to dispatch actions to the Redux store.
  const dispatch = useDispatch();

  // Object to hold login credentials.
  let logObj;

  // Function to handle the login form submission.
  const handleLogin = async (e) => {
    // Prevents the default form submission behavior (page reload).
    e.preventDefault();

    // Create login object with email and password entered by the user.
    logObj = {
      email: email,
      password: password
    }

    try {
      // Send login credentials to the API endpoint.
      const response = await api.post("/user/login", logObj);

      // If login is successful, dispatch the user data and call the onLogin function.
      if (response.data.message === "Success") {
        dispatch(setUser(response.data.data.user))
        onLogin();
      } else {
        // If login fails, set the error message returned from the API.
        setAuthError(response.data.message);
      }
    } catch (error) {
      // Log any errors that occur during the login request and display a generic error message.
      console.error("Login Error", error);
      setAuthError("An error occurred. Please try again.");
    }
  };

  // JSX for the login form.
  return (
    <div className="auth-container">
      <Box className="auth-form">
        {/* Title for the login form */}
        <Typography variant="h4" gutterBottom>
          Welcome Back!
        </Typography>
        {/* Prompt to enter credentials */}
        <Typography variant="body1" gutterBottom>
          Please enter your credentials to log in to your account.
        </Typography>
        {/* Display any authentication error messages */}
        {authError && (
          <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
            {authError}
          </Typography>
        )}
        {/* Login form */}
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            size="small"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            size="small"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Login button */}
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
            className="auth-button"
          >
            Login
          </Button>
        </form>
        {/* Link to switch to the registration form */}
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Button color="primary" onClick={onSwitchToRegister}>
            Register Here
          </Button>
        </Typography>
      </Box>
    </div>
  );
};

// Export the Login component as default.
export default Login;

