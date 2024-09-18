import React, { useState } from "react";
import { TextField, Button, Typography, Box } from '@mui/material';
import "./auth.css";
import api from "../../api/api";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError,setAuthError] = useState("")
  const dispatch = useDispatch()

  let logObj;

  const handleLogin = async (e) => {
    e.preventDefault();

    logObj = {
      email: email,
      password: password
    }

    try {
      const response = await api.post("/user/login", logObj);
      if (response.data.message === "Success") {
        dispatch(setUser(response.data.data.user))
        onLogin();
      } else {
        setAuthError(response.data.message);
      }
    } catch (error) {
      console.error("Login Error", error);
      setAuthError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <Box className="auth-form">
        <Typography variant="h4" gutterBottom>
          Welcome Back!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please enter your credentials to log in to your account.
        </Typography>
        {authError && (
          <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
            {authError}
          </Typography>
        )}
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

export default Login;
