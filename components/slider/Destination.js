"use client";
import Slider from "react-slick";
import Link from "next/link";
import { sliderProps } from "@/utility/sliderprops";

const Destination = ({ destinations = [] }) => {
  if (!destinations || destinations.length === 0) {
    return null;
  }

  return (
    <Slider {...sliderProps.destination} className="destination-active">
      {destinations.map((destination) => (
        <div key={destination.id} className="destination-item">
          <div className="image">
            <img src={destination.image} alt={destination.title} />
          </div>
          <div className="content">
            <span className="location">
              <i className="fal fa-map-marker-alt" /> {destination.location}
            </span>
            <h5>
              <Link href={destination.link || "#"}>{destination.title}</Link>
            </h5>
            <div className="ratting">
              {Array.from({ length: destination.rating || 5 }, (_, i) => (
                <i key={i} className="fas fa-star" />
              ))}
            </div>
            <div className="price">
              <span>${destination.price}</span>/person
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Destination;

