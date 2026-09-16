import React from "react";
import MapComponent from "./MapComponent";

const PropertMapInfo = ({ address }) => {
  return (
    <>
      <div className="map-image-container col-md-6 col-sm-12 col-12">
        <h2 className="map-header">Where you'll be</h2>

        <MapComponent address={address} />
      </div>
      <div className="extra-info col-md-6 col-sm-12 col-12">
        <h2 className="extra-heading">Extra Info</h2>
        <p className="extra-description">
          -Check-in time is 1pm & Check-out time is 10 am. Early check-in or
          late checkout is permitted based on availability and prior intimation.
          *Based on availability, early checkin is permitted from 10am onwards.
          If you wish to check-in before 10am, an early checkin fee will be
          applicable. *Late checkout is permitted based on availability and a
          fee may be applicable based on checkout time. Please contact host
          regarding the same.
        </p>
      </div>
    </>
  );
};

export default PropertMapInfo;
