import {userAction} from "./user-slice"
import {axiosInstance} from "../../utils/axios"

// signUp

export const getSignup = (user)=> async (dispatch)=>{
    try  {
        dispatch(userAction.getSignupRequest());
        const {data}=await axiosInstance.post("/v1/rent/user/signup",user);
        dispatch(userAction.getSignUpDetails(data.user))
    } catch(error){
        dispatch(userAction.getError(error.response.data.message))

    }
}

export const getLogin = (user)=>async(dispatch)=>{
    try {
        dispatch(userAction.getLoginRequest())
        const {data}= await axiosInstance.post("/v1/rent/user/login",user);
        dispatch(userAction.getLoginDetails(data?.user))
    } catch(error){
        console.log(error)
        dispatch(userAction.getError(error.response.data.message))
    }
}

export const currentUser = ()=>async(dispatch)=>{
    try {
        dispatch(userAction.getCurrentRequest())
        const {data}= await axiosInstance.get("/v1/rent/user/me");
        dispatch(userAction.getCurrentUser(data?.user))
    } catch(error){
        dispatch(userAction.getLogout(null))
    }
}


export const updateUser = (updateUser)=> async(dispatch)=>{
    try {
        dispatch(userAction.getUpdateUserRequest())
        const response = await axiosInstance.patch("/v1/rent/user/updateMe",updateUser)
        const {data}=await axiosInstance.get("/v1/rent/user/me")
        dispatch(userAction.getCurrentUser(data.user))
    } catch(error){
        dispatch(userAction.getError(error.response.data.message))

    }
}

export const forgotPassword = (email)=> async(dispatch)=>{
    try {
        await axiosInstance.post("/v1/rent/user/forgotPassword",{email})
    } catch(error){
        dispatch(userAction.getError(error.response.data.message))

    }
}

export const resetPassword = (rePassword,token)=> async(dispatch)=>{
    try {
        await axiosInstance.patch(`/1/rent/user/resetPassword/${token}`,rePassword)

    } catch(error){
        dispatch(userAction.getError(error.response.data.message))

    }
}

export const updatePassword = (passwords)=> async(dispatch)=>{
    try {
        dispatch(userAction.getPasswordRequest());
        await axiosInstance.patch("/v1/rent/user/updateMyPassword",passwords)
        dispatch(userAction.getPasswordSuccess(true))
    } catch(error){
        dispatch(userAction.getError(error.response.data.message))

    }
}


export const logout = ()=> async(dispatch)=>{
    try {
        await axiosInstance.get("/v1/rent/user/logout")
        dispatch(userAction.getLogout(null))
    } catch(error){
        dispatch(userAction.getError(error.response.data.message))

    }
}