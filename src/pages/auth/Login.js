import React, { useState } from "react";
import { TextField, Button, Typography, Box } from '@mui/material';
import "./auth.css";

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(); // Add actual login logic
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
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            size="small"
            onChange={(e) => setUsername(e.target.value)}
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
