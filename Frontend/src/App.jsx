import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PropertyList from "./components/home/PropertyList";
import PropertyListing from "./components/propertyListing/PropertyListing";
import Main from "./components/home/Main";
import Accomodation from "./components/accomodation/Accomodation";
import Login from "./components/user/Login";
import Signup from "./components/user/Signup";
import Profile from "./components/user/Profile";
import EditProfile from "./components/user/EditProfile";
import MyBookings from "./components/myBookings/MyBookings";
import BookingDetails from "./components/myBookings/BookingDetails";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import AccomodationForm from "./components/accomodation/AccomodationForm";
import ForgetPassword from "./components/user/ForgetPassword";
import ResetPassword from "./components/user/ResetPassword";
import UpdatePassword from "./components/user/UpdatePassword";
import Payment from "./components/payment/Payment";
import NotFound from "./components/NotFound";
import AiTripPlanner from "./components/aiTripPlanner/AiTripPlanner";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { userAction } from "./store/User/user-slice";
import { currentUser } from "./store/User/user-action";
function App() {
  
 const {user,errors}=useSelector(state=>state.user)
 const dispatch=useDispatch()

 useEffect(()=>{
  if(errors){
    dispatch(userAction.clearErrors())
  }
 },[errors,dispatch])
 useEffect(()=>{
  dispatch(currentUser())
 },[dispatch])
  return (
    <div className="App">
      <Toaster position="bottom-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<PropertyList />} />
            <Route path="propertylist/:id" element={<PropertyListing />} />

            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="editprofile"
              element={user ? <EditProfile /> : <Navigate to="/login" />}
            />

            <Route path="ai-trip-planner" element={<AiTripPlanner />} />

            <Route path="accomodation" element={<Accomodation />} />
            <Route path="accomodationform" element={<AccomodationForm />} />

            <Route path="user/forgotPassword" element={<ForgetPassword />} />
            <Route
              path="user/resetPassword/:token"
              element={<ResetPassword />}
            />
            <Route
              path="user/updatepassword"
              element={user ? <UpdatePassword /> : <Navigate to="/login" />}
            />

            <Route
              path="user/mybookings"
              element={user ? <MyBookings /> : <Navigate to="/login" />}
            />
            <Route
              path="user/mybookings/:bookingId"
              element={user ? <BookingDetails /> : <Navigate to="/login" />}
            />

            <Route
              path="payment/:propertyId"
              element={user ? <Payment /> : <Navigate to="/login" />}
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
