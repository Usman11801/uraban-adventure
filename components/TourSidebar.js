"use client";
import Link from "next/link";
import Slider from "rc-slider";
import { useState } from "react";

const TourSidebar = () => {
  const [value, setValue] = useState([10, 30]);
  return (
    <div className="col-lg-3 col-md-6 col-sm-10 rmb-75">
      <div className="shop-sidebar mb-30">
        <div className="widget widget-search">
          <h4 className="widget-title">Search</h4>
          <form className="search-form">
            <input
              type="text"
              placeholder="Search here..."
              required=""
            />
            <button type="submit">
              <i className="far fa-search" />
            </button>
          </form>
        </div>
        <div className="widget widget-price">
          <h4 className="widget-title">Price Range</h4>
          <div className="price-range">
            <Slider
              range
              min={0}
              max={1000}
              value={value}
              onChange={setValue}
            />
            <div className="price-input">
              <span>${value[0]}</span>
              <span>${value[1]}</span>
            </div>
          </div>
        </div>
        <div className="widget widget-category">
          <h4 className="widget-title">Category</h4>
          <ul className="list-style-one">
            <li>
              <Link href="#">Desert Safari</Link>
            </li>
            <li>
              <Link href="#">City Tour</Link>
            </li>
            <li>
              <Link href="#">Desert Resort</Link>
            </li>
            <li>
              <Link href="#">Theme Park</Link>
            </li>
            <li>
              <Link href="#">Buggy & Quad Bikes</Link>
            </li>
          </ul>
        </div>
        <div className="widget widget-tags">
          <h4 className="widget-title">Popular Tags</h4>
          <div className="tags">
            <Link href="#">Adventure</Link>
            <Link href="#">Beach</Link>
            <Link href="#">Desert</Link>
            <Link href="#">Family</Link>
            <Link href="#">Luxury</Link>
            <Link href="#">Nature</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourSidebar;

