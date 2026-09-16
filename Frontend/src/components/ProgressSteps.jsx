import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../css/ProgressSteps.css";

const ProgressSteps = () => {
  const location = useLocation();

  return (
    <div className="checkout-progress d-flex justify-content-center mt-5">
      <NavLink
        to="/profile"
        className={`progress-button ${
          location.pathname === "/profile" ? "active-button" : ""
        }`}
      >
        <div className="triangle-left"></div>
        My Profile
        <div className="triangle-right"></div>
      </NavLink>

      <NavLink
        to="/user/mybookings"
        className={`progress-button ${
          location.pathname === "/user/mybookings" ? "active-button" : ""
        }`}
      >
        <div className="triangle-left"></div>
        My Bookings
        <div className="triangle-right"></div>
      </NavLink>

      <NavLink
        to="/accomodation"
        className={`progress-button ${
          location.pathname === "/accomodation" ? "active-button" : ""
        }`}
      >
        <div className="triangle-left"></div>
        My Accommodations
        <div className="triangle-right"></div>
      </NavLink>
    </div>
  );
};

export default ProgressSteps;
