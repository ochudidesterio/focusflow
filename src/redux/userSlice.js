import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isloggedIn: false,
  loggedUser:{}
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoggedIn:(state,{payload})=>{
        state.isloggedIn = payload
    },
    setLogOut(state) {
      state.isloggedIn = false;
    },
    setUser:(state,{payload})=>{
      state.loggedUser = payload
    }
  },
});

export const {  setIsLoggedIn } = userSlice.actions;
export const {  setLogOut } = userSlice.actions;
export const {setUser} = userSlice.actions
export const getIsLoggedIn = (state)=>state.user.isloggedIn
export const getLogout = (state)=> state.user.isloggedIn
export const getUser = (state)=> state.user.loggedUser
export default userSlice.reducer;
