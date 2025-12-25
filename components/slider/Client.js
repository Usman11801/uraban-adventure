"use client";
import Slider from "react-slick";
import { sliderProps } from "@/utility/sliderprops";

const Client = () => {
  const clients = [
    { id: 1, logo: "assets/images/client-logos/client-logo1.png" },
    { id: 2, logo: "assets/images/client-logos/client-logo2.png" },
    { id: 3, logo: "assets/images/client-logos/client-logo3.png" },
    { id: 4, logo: "assets/images/client-logos/client-logo4.png" },
    { id: 5, logo: "assets/images/client-logos/client-logo5.png" },
  ];

  return (
    <Slider {...sliderProps.client} className="client-logo-active">
      {clients.map((client) => (
        <div key={client.id} className="client-logo-item">
          <img src={client.logo} alt={`Client ${client.id}`} />
        </div>
      ))}
    </Slider>
  );
};

export default Client;

