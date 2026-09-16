import {axiosInstance} from "../../utils/axios"
import {setBookingDetails,setBookings} from "./booking-slice"

export const fetchBookingDetails =(bookingId)=>async(dispatch)=>{
    try {
        const response = await axiosInstance.get(`/v1/rent/user/booking/${bookingId}`)
        dispatch(setBookingDetails(response.data?.bookings))
    } catch(error){
        
    }
}
export const fetchUserBookings =()=>async(dispatch)=>{
    try {
        const response = await axiosInstance.get(`/v1/rent/user/booking`)
        console.log(response)
        dispatch(setBookings(response.data.bookings))
    } catch(error){
        
    }
}