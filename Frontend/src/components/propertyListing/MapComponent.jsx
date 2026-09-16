import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const properNames = {
  himachalpradesh: "Himachal Pradesh",
  tamilnadu: "Tamil Nadu",
  westbengal: "West Bengal",
  madhyapradesh: "Madhya Pradesh",
  andhrapradesh: "Andhra Pradesh",
  uttarpradesh: "Uttar Pradesh",
  alleppey: "Alappuzha",
  pondicherry: "Puducherry",
};

const MapComponent = ({ address }) => {
  const city = properNames[address.city] || address.city;
  const state = properNames[address.state] || address.state;
  const place = `${address.area}, ${city}, ${state}`;

  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const searchTexts = [
      `${address.area}, ${city}, ${state}, India`,
      `${address.area}, ${city}, India`,
      `${city}, ${state}, India`,
    ];

    const fetchCoordinates = async () => {
      try {
        for (const text of searchTexts) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(
              text
            )}`
          );
          const data = await response.json();

          if (!isMounted) return;

          if (data.length > 0) {
            setCoordinates([Number(data[0].lat), Number(data[0].lon)]);
            setLoading(false);
            return;
          }
        }

        if (isMounted) {
          setCoordinates([]);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching geocoding data:", error);
          setError("Map is not available right now");
          setLoading(false);
        }
      }
    };
    fetchCoordinates();

    return () => {
      isMounted = false;
    };
  }, [address.area, city, state]);

  return (
    <div>
      {loading && <p>Loading map...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && coordinates.length === 0 && (
        <p>Map is not available for this location</p>
      )}
      {coordinates.length > 0 && (
        <MapContainer
          key={coordinates.join(",")}
          center={coordinates}
          zoom={14}
          style={{ height: "320px", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coordinates}>
            <Popup>{place}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};
export default MapComponent;
