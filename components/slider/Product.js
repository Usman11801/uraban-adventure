"use client";
import Slider from "react-slick";
import Link from "next/link";
import { sliderProps } from "@/utility/sliderprops";

const Product = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Slider {...sliderProps.product} className="product-slider">
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <div className="image">
            <img src={product.image} alt={product.title} />
            {product.badge && <span className="badge">{product.badge}</span>}
          </div>
          <div className="content">
            <h5>
              <Link href={product.link || "#"}>{product.title}</Link>
            </h5>
            <div className="price">
              <span>${product.price}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Product;

