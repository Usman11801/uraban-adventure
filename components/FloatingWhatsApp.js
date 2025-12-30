import React from "react";

const FloatingWhatsApp = ({encodedMessage}) => {

  return (
    <a
    href={`https://wa.me/+971528067631?text=${encodedMessage?encodedMessage:'Hey'}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-success position-fixed rounded-circle d-flex justify-content-center align-items-center"
      style={{
        width: "60px",
        height: "60px",
        bottom: "20px",
        left: "20px",
        zIndex: 9999,
        display: "flex",
        visibility: "visible",
        opacity: 1,
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = "scale(0.95)";
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <i className="fab fa-whatsapp fa-lg"></i>
    </a>
  );
};

export default FloatingWhatsApp;