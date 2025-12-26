"use client";

import Banner from "@/components/Banner";
import SectionTitle from "@/components/SectionTitle";
import Product from "@/components/slider/Product";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useState, useEffect } from "react";

const page = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryString = window.location.search;
      const params = new URLSearchParams(queryString);
      const id = params.get("id");
      setProduct({
        id: id || 1,
        title: "Travel Guide Book",
        image: "assets/images/shop/product1.png",
        price: 29.99,
        originalPrice: 39.99,
        description: "Comprehensive travel guide with maps and tips.",
      });
    }
  }, []);

  if (!product) return null;

  return (
    <ReveloLayout>
      <Banner pageTitle={"Product Details"} />
      <section className="product-details-area py-100 rel z-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="product-image">
                <img src={product.image} alt={product.title} />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="product-content">
                <h2>{product.title}</h2>
                <div className="price">
                  <span>${product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">${product.originalPrice}</span>
                  )}
                </div>
                <p>{product.description}</p>
                <button className="theme-btn bgc-secondary">
                  <span data-hover="Add to Cart">Add to Cart</span>
                  <i className="fal fa-arrow-right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Subscribe />
    </ReveloLayout>
  );
};

export default page;

