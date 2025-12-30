import React from "react";

const FloatingCall = ({ phoneNumber = "+971528067631" }) => {
  return (
    <a
      href={`tel:${phoneNumber}`}
      className="btn btn-primary position-fixed rounded-circle d-flex justify-content-center align-items-center"
      style={{
        width: "60px",
        height: "60px",
        bottom: "90px",
        right: "20px",
        zIndex: 1000,
        backgroundColor: "#007bff",
        border: "none",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      }}
    >
      <i className="fas fa-phone fa-lg" style={{ color: "#fff" }}></i>
    </a>
  );
};

export default FloatingCall;

