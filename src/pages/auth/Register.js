import React, { useState } from "react";
import { TextField, Button, Typography, Box } from '@mui/material';
import "./auth.css"; 
import supabase from "../../config/SupabaseClient";

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Create registration object with user details
    const regObj = {
      name: name,
      username: username,
      email: email,
      password: password, // Ensure you handle password securely
    };
  
    try {
      // Insert user into the Supabase 'User' table
      const { data, error } = await supabase
        .from('User')
        .insert([regObj]);
  
      if (error) {
        throw new Error(error.message); // Handle error appropriately
      }
        onRegister(); 
        onSwitchToLogin(); 
        console.log("RegData: ",data)

      
    } catch (error) {
      console.error("Registration error:", error.message);
      // Optionally display an error message to the user
    }
  };
  

  return (
    <div className="auth-container">
      <Box className="auth-form">
        <Typography variant="h4" gutterBottom>
          Create Your Account
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please fill in the information below to create a new account.
        </Typography>
        <form onSubmit={handleRegister}>
          
        <TextField label="Full Name" variant="outlined" fullWidth margin="normal" value={name} size="small" onChange={(e) => setName(e.target.value)} required />

        <TextField label="Email" type="email" variant="outlined" fullWidth margin="normal" value={email} size="small" onChange={(e) => setEmail(e.target.value)} required />

        <TextField label="Username" variant="outlined" fullWidth margin="normal" value={username} size="small" onChange={(e) => setUsername(e.target.value)} required />

        <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} size="small" onChange={(e) => setPassword(e.target.value)} required />

        <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2 }} className="auth-button">Register</Button>

        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Button color="primary" onClick={onSwitchToLogin}>
            Log In
          </Button>
        </Typography>
      </Box>
    </div>
  );
};

export default Register;
