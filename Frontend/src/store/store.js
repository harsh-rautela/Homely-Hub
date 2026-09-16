import { configureStore } from "@reduxjs/toolkit";
import propertySlice from "./Property/property-slice";
import propertyDetailsSlice from "./PropertyDetails/propertyDetails-slice";
import userSlice from "./User/user-slice";
import bookingSlice from "./Booking/booking-slice";
import accomodationSlice from "../store/Accomodation/Accomodation-slice"
const store = configureStore({
    reducer:{
        property:propertySlice.reducer,
        propertyDetails:propertyDetailsSlice.reducer,
        user:userSlice.reducer,
        booking:bookingSlice.reducer,
        accomodation:accomodationSlice.reducer
    }
})
export default store 