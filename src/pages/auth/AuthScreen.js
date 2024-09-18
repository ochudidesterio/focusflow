import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import {  setIsLoggedIn } from '../../redux/userSlice';
import Login from "./Login";
import Register from "./Register";


const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuth = () => {
      setIsLogin(!isLogin);
    };
    const dispatch = useDispatch()
    const handleLogin = () => {
      dispatch(setIsLoggedIn(true));
    };
  
    return isLogin ? (
      <Login onLogin={handleLogin} onSwitchToRegister={toggleAuth} />
    ) : (
      <Register onRegister={() => alert("Registered!")} onSwitchToLogin={toggleAuth} />
    );
  };


export default AuthScreen