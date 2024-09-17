// src/features/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isloggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // setUsername(state, action) {
    //   state.username = action.payload;
    // },
    setIsLoggedIn:(state,{payload})=>{
        state.isloggedIn = payload
    },
    setLogOut(state) {
      state.isloggedIn = false;
    },
  },
});

export const {  setIsLoggedIn } = userSlice.actions;
export const {  setLogOut } = userSlice.actions;
export const getIsLoggedIn = (state)=>state.user.isloggedIn
export const getLogout = (state)=> state.user.isloggedIn
export default userSlice.reducer;
