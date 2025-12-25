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
        right: "20px",
        zIndex: 1000,
      }}
    >
      <i className="fab fa-whatsapp fa-lg"></i>
    </a>
  );
};

export default FloatingWhatsApp;