import { compose, createSlice } from "@reduxjs/toolkit"

const initialState = {
    bookings:[],
    bookingDetails:{},
    loading:false
}

const bookingSlice = createSlice({
    name:"booking",
    initialState,
    reducers:{
        setBookingRequest:(state)=>{
            state.loading=true
        },
        setBookings:(state,action)=>{
            state.bookings=action.payload
            state.loading=false
        },
        addBookingDetails:(state,action)=>{
            state.bookings.push(action.payload)
        },  
        setBookingDetails:(state,action)=>{
            state.bookingDetails=action.payload
        }
    }
})

export const {setBookingRequest,setBookings,addBookingDetails,setBookingDetails}=bookingSlice.actions

export default bookingSlice