import React, { useEffect } from "react";
import "../../css/Accomodation.css";
import ProgressSteps from "../ProgressSteps";
import MyAccomodation from "./MyAccomodation";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllAccomodation } from "../../store/Accomodation/Accomodation-action";
import LoadingSpinner from "../LoadingSpinner";

const Accomodation = () => {
  const dispatch = useDispatch();

  const { accomodation, loading } = useSelector((state) => state.accomodation);

  useEffect(() => {
    dispatch(getAllAccomodation());
  }, [dispatch]);

  return (
    <>
      <ProgressSteps accomodation />
      <div className="accom-container">
        <Link to="/accomodationform">
          <button className="add-new-place">+ Add new place</button>
        </Link>
        {loading && <LoadingSpinner />}
        {accomodation.length === 0 && !loading && (
          <p>Accomodation not available</p>
        )}
        {accomodation.length > 0 && !loading && (
          <MyAccomodation accomodation={accomodation} loading={loading} />
        )}
      </div>
    </>
  );
};

export default Accomodation;
