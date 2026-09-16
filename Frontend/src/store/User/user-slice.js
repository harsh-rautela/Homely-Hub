import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        isAuthenticated:false,
        loading:false,
        user:null,
        errors:null,
        success:false
    },
    reducers:{
        getSignupRequest:(state)=>{
            state.loading=true;
        },
        getSignUpDetails:(state,action)=>{
            state.user=action.payload;
            state.isAuthenticated=true;
            state.loading=false;
        },
        getLoginRequest:(state)=>{
            state.loading=true;
        },
        getLoginDetails:(state,action)=>{
            state.user = action.payload;
            state.isAuthenticated=true;
            state.loading=false;
        },
        getError:(state,action)=>{
            state.errors=action.payload
            state.loading=false;
        },
        getCurrentRequest:(state)=>{
            state.loading=true;
        },
        getUpdateUserRequest:(state,action)=>{
            state.loading=true;
        },
        getCurrentUser:(state,action)=>{
            state.user = action.payload;
            state.isAuthenticated=true;
            state.loading=false;
        },
        getLogoutRequest:(state)=>{
            state.loading=true;
        },
        getLogout:(state,action)=>{
            state.user = action.payload;
            state.isAuthenticated=false;
            state.loading=false;
        },
        getPasswordRequest:(state,action)=>{
            state.loading=true;
        },
        getPasswordSuccess:(state,action)=>{
            state.success=action.payload;
            state.loading=false
        },
        clearErrors:(state)=>{
            state.errors=null;
        }
    }
})

export const userAction = userSlice.actions;
export default userSlice
