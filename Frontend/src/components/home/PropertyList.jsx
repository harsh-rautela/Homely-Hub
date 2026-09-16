import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "../../css/Home.css";
import {
  STATIC_PROPERTIES,
  STATIC_TOTAL_PROPERTIES,
} from "../../data/staticData";
import {useDispatch,useSelector} from "react-redux"
import {propertyAction} from "../../store/Property/property-slice"
import {getAllProperties} from "../../store/Property/property-action"
const Card = ({ id, image, name, address, price }) => {
  return (
    <figure className="property">
      <Link to={`/propertylist/${id}`}>
        <img src={image} alt="Propertyimg" />
      </Link>
      <h4>{name}</h4>
      <figcaption>
        <main className="propertydetails">
          <h5>{name}</h5>

          <h6>
            <span className="material-symbols-outlined houseicon">
              home_pin
            </span>
            {address}
          </h6>
          <p>
            <span className="price"> ₹{price}</span> per night
          </p>
        </main>
      </figcaption>
    </figure>
  );
};

const PropertyList = () => {
  const [currentPage, setCurrentPage] = useState({ page: 1 });
  
  // STATIC: was `useSelector((state) => state.properties)`.
  // TODO: replace with your own fetch logic.
  // const [properties] = useState(STATIC_PROPERTIES);
  // const [totalProperties] = useState(STATIC_TOTAL_PROPERTIES);
   const dispatch = useDispatch();
   const {properties,totalProperties} = useSelector(state=>state.property)
  const lastPage = Math.ceil(totalProperties / 12);

  const propertyListRef = useRef(null);

  useEffect(() => {
    // TODO: fetch the properties for `currentPage` here and set them above.
    const fetchProperties = async (page)=>{
          console.log("inside fetch")
      dispatch(propertyAction.updateSearchParams({page:page}));
      dispatch(getAllProperties())
    };
    console.log("inside useeffct")
    fetchProperties(currentPage);
  }, [currentPage,dispatch]);

  useEffect(() => {
    if (propertyListRef.current) {
      gsap.fromTo(
        propertyListRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [properties]);

  return (
    <>
      {properties.length === 0 ? (
        <p className={"not_found"}>Property not found</p>
      ) : (
        <div className="propertylist" ref={propertyListRef}>
          {properties.map((property) => (
            <Card
              key={property._id}
              id={property._id}
              image={property.images[0].url}
              name={property.propertyName}
              address={`${property.address.city}, ${property.address.state} ${property.address.pincode}`}
              price={property.price}
              slug={property.slug}
            />
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          className="previous_btn"
          onClick={() => setCurrentPage((prev) => ({ page: prev.page - 1 }))}
          disabled={currentPage.page === 1}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>

        <button
          className="next_btn"
          onClick={() => setCurrentPage((prev) => ({ page: prev.page + 1 }))}
          disabled={properties.length < 12 || currentPage.page === lastPage}
        >
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
      </div>
    </>
  );
};

export default PropertyList;
