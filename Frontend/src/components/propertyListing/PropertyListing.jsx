import React, { useEffect, useState } from "react";
import "../../css/PropertyListing.css";
import "../../css/PropertyListing.css";
import PropertyImg from "./PropertyImg";
import PaymentForm from "./PaymentForm";
import PropertyAmenities from "./PropertyAmenities";
import PropertMapInfo from "./PropertyMapInfo";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import {getPropertyDetails} from "../../store/PropertyDetails/propertyDetails-action"
import {useDispatch,useSelector} from "react-redux"
import {
  STATIC_PROPERTIES,
  STATIC_PROPERTY_DETAILS,
} from "../../data/staticData";

const PropertyListing = () => {
  const { id } = useParams();

  // STATIC: was `useSelector((state) => state.propertydetails)`.
  // TODO: replace with your own fetch logic.
  
 const dispatch=useDispatch()
  const {propertydetails,loading} = useSelector(state=>state.propertyDetails)

  useEffect(() => {
    dispatch(getPropertyDetails(id))
  }, [id,dispatch]);

  if (loading || !propertydetails)
    return (
      <div className="row justify-content-around mt-5">
        <LoadingSpinner />
      </div>
    );

  const {
    propertyName,
    address,
    description,
    images,
    amenities,
    maximumGuest,
    price,
    currentBookings,
  } = propertydetails;

  return (
    <div className="property-container">
      <p className="property-header">{propertyName}</p>
      <h6 className="property-location">
        <span className="material-symbols-outlined">house</span>
        <span className="location">{`${address?.area}, ${address?.city}, ${address?.state}`}</span>
      </h6>
      <PropertyImg images={images} />
      <div className="middle-container row">
        <div className="des-and-amenities col-md-8 col-sm-12 col-12">
          <h2 className="property-description-header">Description</h2>
          <p className="property-description">
            {description} <br></br>
            <br></br>Max number of guests: {maximumGuest}
          </p>
          <hr></hr>
          <PropertyAmenities amenities={amenities} />
        </div>
        <div className="property-payment col-md-4 col-sm-12 col-12">
          <PaymentForm
            propertyId={id}
            price={price}
            propertyName={propertyName}
            address={address}
            maximumGuest={maximumGuest}
            currentBookings={currentBookings}
          />
        </div>
      </div>
      <hr></hr>
      <div className="property-map">
        <div className="map-image-exinfo-container row">
          <PropertMapInfo address={address} />
        </div>
      </div>
    </div>
  );
};

export default PropertyListing;
