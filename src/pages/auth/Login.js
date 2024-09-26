import React, { useState } from "react";
import { TextField, Button, Typography, Box } from '@mui/material';
import "./auth.css";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import supabase from "../../config/SupabaseClient";

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

  const login = async (e) => {
    e.preventDefault();
  
    // Create login object with email and password entered by the user.
    logObj = {
      email: email,
      password: password
    }
  
    try {
      // Query the 'User' table with matching email and password from logObj
      const { data, error } = await supabase
        .from('User')
        .select()
        .eq('email', logObj.email)
        .eq('password', logObj.password); 
  
      if (error) {
        throw error;
      }
  
      if (data.length > 0) {
        // User found, proceed with login
        console.log('Login successful', data[0]);
        dispatch(setUser(data[0]))
        onLogin()
      } else {
        // No matching user
        setAuthError("Invalid email or password.");
      }
  
    } catch (error) {
      setAuthError("An error occurred. Please try again.");
      console.error(error.message);
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
        <form onSubmit={login}>
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

