import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        color: "#212529",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "4rem", margin: "0" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", margin: "1rem 0" }}>Page Not Found</h2>
      <p style={{ fontSize: "1rem", maxWidth: "400px", lineHeight: "1.5" }}>
        Oops! The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        style={{
          marginTop: "1.5rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#0e8b53",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "0.5rem",
          transition: "background-color 0.3s ease",
        }}
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
