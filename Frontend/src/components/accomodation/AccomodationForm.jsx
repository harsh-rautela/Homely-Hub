import React, { useState } from "react";
import ImagesUploading from "./ImagesUploading";
import { getAiDescription } from "../../ai/aiDescription";
import { useForm } from "@tanstack/react-form";
import { AddressField } from "./AddressField";
import AmenitiesField from "./AmenitiesField";
import {
  createAccomodation,
  getAllAccomodation,
} from "../../store/Accomodation/Accomodation-action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Section = ({ icon, title, hint, children }) => (
  <section className="accf-card">
    <div className="accf-sec">
      <span className="material-symbols-outlined">{icon}</span>
      <h2>{title}</h2>
      {hint && <span className="accf-hint">{hint}</span>}
    </div>
    {children}
  </section>
);

const AccomodationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.accomodation);
  const [aiLoading, setAiLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      propertyType: undefined,
      roomType: undefined,
      extraInfo: undefined,
      images: [],
      amenities: [],
     address: {
  area: "",
  city: "",
  state: "",
  pincode: "",
},
      checkIn: undefined,
      checkOut: undefined,
      maximumGuest: 0,
      price: "",
    },
onSubmit: async ({ value }) => {
  try {
    console.log(value);

     dispatch(
      createAccomodation({
        propertyName: value.name,
        description: value.description,
        propertyType: value.propertyType,
        roomType: value.roomType,
        extraInfo: value.extraInfo,
        images: value.images,
        address: value.address,
        amenities: value.amenities,
        checkInTime: value.checkIn,
        checkOutTime: value.checkOut,
        maximumGuest: value.maximumGuest,
        price: value.price,
      })
    );

    // Fetch the latest accommodations from backend
     dispatch(getAllAccomodation());

    toast.success("New Property Created Successfully");

    // Now open My Accommodations with updated data
    navigate("/accomodation");
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message
    );

    console.error(error);
  }
},
  });

  const handleAiDescription = async (field) => {
    const values = form.state.values;

    if (!values.name) {
      toast.error("Please add a title first");
      return;
    }

    setAiLoading(true);
    try {
      const description = await getAiDescription(values);
      field.handleChange(description);
      toast.success("Description added");
    } catch (error) {
      toast.error("Could not generate a description");
      console.error(error);
    }
    setAiLoading(false);
  };

  return (
    <div className="accf-page">
      <header className="accf-hero">
        <h1>
          <span className="material-symbols-outlined">home_work</span>
          List your place
        </h1>
        <p>
          Fill in the details below
        </p>
      </header>

      <form
        className="accf-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Section icon="title" title="Title" hint="Short and catchy">
          <form.Field name="name">
            {(field) => (
              <input
                className="accf-input"
                type="text"
                placeholder="Sunny cottage near the beach"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
        </Section>

        <Section icon="location_on" title="Address">
          <AddressField form={form} />
        </Section>

        <Section icon="photo_library" title="Photos" hint="At least 6">
          <form.Field name="images">
            {(field) => <ImagesUploading field={field} />}
          </form.Field>
        </Section>

        <Section icon="home" title="Property">
          <div className="accf-grid-2">
            <div className="accf-field">
              <label>Property type</label>
              <form.Field name="propertyType">
                {(field) => (
                  <select
                    className="accf-input"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="House">House</option>
                    <option value="Flat">Flat</option>
                    <option value="Guest House">Guest House</option>
                    <option value="Hotel">Hotel</option>
                  </select>
                )}
              </form.Field>
            </div>

            <div className="accf-field">
              <label>Room type</label>
              <form.Field name="roomType">
                {(field) => (
                  <select
                    className="accf-input"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="Anytype">Anytype</option>
                    <option value="Entire Home">Entire Home</option>
                    <option value="Room">Room</option>
                  </select>
                )}
              </form.Field>
            </div>
          </div>
        </Section>

        <Section icon="checklist" title="Amenities" hint="Pick what you offer">
          <AmenitiesField form={form} />
        </Section>

        <Section icon="gavel" title="House rules" hint="Optional">
          <form.Field name="extraInfo">
            {(field) => (
              <textarea
                className="accf-input accf-textarea"
                rows="3"
                placeholder="Check-in after 1pm, no smoking indoors..."
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
        </Section>

        <Section icon="description" title="Description">
          <form.Field name="description">
            {(field) => (
              <>
                <div className="accf-desc-row">
                  <span className="accf-hint">
                    Tell guests what makes your place special
                  </span>

                  <button
                    type="button"
                    className="accf-ai"
                    disabled={aiLoading}
                    onClick={() => handleAiDescription(field)}
                  >
                    <span className="material-symbols-outlined">
                      auto_awesome
                    </span>
                    {aiLoading ? "Writing..." : "Write with AI"}
                  </button>
                </div>
                <textarea
                  className="accf-input accf-textarea"
                  rows="5"
                  placeholder="Write a few lines, or let AI do it for you"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>
        </Section>

        <Section icon="event" title="Stay details" hint="24 hour format">
          <div className="accf-grid-4">
            <div className="accf-field">
              <label>Check-in</label>
              <form.Field name="checkIn">
                {(field) => (
                  <input
                    className="accf-input"
                    type="time"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </div>

            <div className="accf-field">
              <label>Check-out</label>
              <form.Field name="checkOut">
                {(field) => (
                  <input
                    className="accf-input"
                    type="time"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </div>

            <div className="accf-field">
              <label>Guests</label>
              <form.Field name="maximumGuest">
                {(field) => (
                  <input
                    className="accf-input"
                    type="number"
                    placeholder="2"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </div>

            <div className="accf-field">
              <label>Price / night</label>
              <form.Field name="price">
                {(field) => (
                  <input
                    className="accf-input"
                    type="number"
                    placeholder="2000"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </div>
          </div>
        </Section>

        <button className="accf-save" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Publish listing"}
        </button>
      </form>
    </div>
  );
};

export default AccomodationForm;
