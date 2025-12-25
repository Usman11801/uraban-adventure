"use client";
import Slider from "react-slick";
import Link from "next/link";
import { sliderProps } from "@/utility/sliderprops";

const HotDeals = ({ deals = [] }) => {
  if (!deals || deals.length === 0) {
    return null;
  }

  return (
    <Slider {...sliderProps.hotDeals} className="hot-deals-active">
      {deals.map((deal) => (
        <div key={deal.id} className="destination-item style-four">
          <div className="image">
            <img src={deal.image} alt={deal.title} />
            {deal.discount && (
              <span className="badge">{deal.discount}% Off</span>
            )}
          </div>
          <div className="content">
            <span className="location">
              <i className="fal fa-map-marker-alt" /> {deal.location}
            </span>
            <h5>
              <Link href={deal.link || "#"}>{deal.title}</Link>
            </h5>
            <div className="ratting">
              {Array.from({ length: deal.rating || 5 }, (_, i) => (
                <i key={i} className="fas fa-star" />
              ))}
            </div>
            <div className="price">
              <span>${deal.price}</span>
              {deal.originalPrice && (
                <span className="original-price">${deal.originalPrice}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default HotDeals;

