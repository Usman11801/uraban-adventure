"use client";

import { sliderProps } from "@/utility/sliderprops";
import Link from "next/link";
import Slider from "react-slick";
import { useRef, useMemo } from "react";
import SectionTitle from "@/components/SectionTitle";

const CategorySlider = ({ title, categories = [] }) => {
  const sliderRef = useRef(null);

  if (!categories || categories.length === 0) {
    return null;
  }

  const categoriesLength = categories.length;

  // Memoize slider settings to prevent recreation on every render
  const categorySliderSettings = useMemo(() => ({
    infinite: true,
    speed: 400,
    arrows: false,
    dots: false,
    focusOnSelect: true,
    autoplay: categoriesLength > 1, // Enable autoplay if more than 1 category
    autoplaySpeed: 2000, // Auto slide every 2 seconds
    pauseOnHover: false, // Don't pause on hover - continuous auto slide
    slidesToShow: 5,
    slidesToScroll: 1, // Scroll one item at a time for smooth transition
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          autoplay: categoriesLength > 1,
          autoplaySpeed: 2000,
          pauseOnHover: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          autoplay: categoriesLength > 1,
          autoplaySpeed: 2000,
          pauseOnHover: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          autoplay: categoriesLength > 1,
          autoplaySpeed: 2000,
          pauseOnHover: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          autoplay: categoriesLength > 1,
          autoplaySpeed: 2000,
          pauseOnHover: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          autoplay: categoriesLength > 1,
          autoplaySpeed: 2000,
          pauseOnHover: false,
        },
      },
    ],
  }), [categoriesLength]);

  return (
    <section className="destinations-area bgc-black pt-100 pb-70 rel z-1">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div
              className="section-title text-white text-center counter-text-wrap mb-70"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}
            >
              <div style={{ flex: '1', minWidth: '200px' }}>
                <SectionTitle
                  title={title}
                  countValue={34500}
                  subtitle1={"One site"}
                  subtitle2={"most popular experience you'll remember"}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: '#fff',
                    fontSize: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--secondary-color)';
                    e.target.style.borderColor = 'var(--secondary-color)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: '#fff',
                    fontSize: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--secondary-color)';
                    e.target.style.borderColor = 'var(--secondary-color)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12" style={{ position: 'relative' }}>
            <Slider 
              {...categorySliderSettings} 
              className="category-slider-active" 
              ref={sliderRef}
            >
              {categories.map((category, index) => (
                <div key={category.id || index} className="category-slider-item" style={{ padding: '0 5px' }}>
                  <Link
                    href={category.link || '#'}
                    style={{ textDecoration: 'none', display: 'block', width: '100%', height: '100%' }}
                  >
                  <div
                    className="destination-item"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    data-aos-duration={1500}
                    data-aos-offset={50}
                      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    <div className="image" style={{ position: 'relative', width: '100%' }}>
                      <div className="ratting">
                        <i className="fas fa-star" /> {category.rating || 4.8}
                      </div>
                        <img src={category.image} alt={category.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    </div>
                      <div className="content" style={{ padding: '12px' }}>
                        <span className="location" style={{ fontSize: '13px', color: '#fff' }}>
                        <i className="fal fa-map-marker-alt" /> {category.location || "UAE"}
                      </span>
                        <h5 style={{ marginTop: '8px', marginBottom: '5px', fontSize: '16px', color: '#fff' }}>
                          {category.title}
                      </h5>
                        <span className="time" style={{ fontSize: '12px', color: '#fff' }}>Urban Adventure tourism</span>
                      </div>
                    </div>
                      </Link>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;

