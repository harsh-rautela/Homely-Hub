import React from "react";

const initialamenities = [
  { id: "wifi", value: "Wifi", checked: false, icon: "wifi" },
  {
    id: "kitchen",
    value: "Kitchen",
    checked: false,
    icon: "kitchen",
  },
  {
    id: "parking",
    value: "Free Parking",
    checked: false,
    icon: "garage_home",
  },
  {
    id: "washingmachine",
    value: "Washing Machine",
    icon: "local_laundry_service",
    checked: false,
  },
  { id: "tv", value: "Tv", checked: false, icon: "tv" },
  { id: "pool", value: "Pool", checked: false, icon: "pool" },
  { id: "ac", value: "Ac", checked: false, icon: "air" },
];

const AmenitiesField = ({ form }) => {
  return (
    <div className="perks-container">
      <h4 className="perks-header">Amenities</h4>
      <p className="form-paras">Select perks</p>

      <form.Field name="amenities">
        {(field) => (
          <div className="perks row">
            {initialamenities.map((amenity) => (
              <div
                key={amenity.id}
                className={`${amenity.id}-box checkbox-container col-sm-12 col-md-3 col-lg-2`}
              >
                <input
                  type="checkbox"
                  checked={field.state.value.some(
                    (item) => item.name === amenity.value
                  )}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const currentAmenities = field.state.value || [];

                    if (isChecked) {
                      field.handleChange([
                        ...currentAmenities,
                        { name: amenity.value, icon: amenity.icon },
                      ]);
                    } else {
                      field.handleChange(
                        currentAmenities.filter(
                          (item) => item.name !== amenity.value
                        )
                      );
                    }
                  }}
                />
                <span className="material-symbols-outlined">
                  {amenity.icon}
                </span>
                <span>{amenity.value}</span>
              </div>
            ))}
          </div>
        )}
      </form.Field>
    </div>
  );
};

export default AmenitiesField;
