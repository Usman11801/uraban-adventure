"use client";

import { sliderProps } from "@/utility/sliderprops";
import Link from "next/link";
import Slider from "react-slick";
import { useRef } from "react";
import SectionTitle from "@/components/SectionTitle";

const CategorySlider = ({ title, categories = [] }) => {
  const sliderRef = useRef(null);

  if (!categories || categories.length === 0) {
    return null;
  }

  const categorySliderSettings = {
    infinite: true,
    speed: 400,
    arrows: false,
    dots: false,
    focusOnSelect: true,
    autoplay: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

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
            <Slider {...categorySliderSettings} className="category-slider-active" ref={sliderRef}>
              {categories.map((category, index) => (
                <div key={category.id || index} className="category-slider-item" style={{ padding: '0 5px' }}>
                  <div
                    className="destination-item"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    data-aos-duration={1500}
                    data-aos-offset={50}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <div className="image" style={{ position: 'relative', width: '100%' }}>
                      <div className="ratting">
                        <i className="fas fa-star" /> {category.rating || 4.8}
                      </div>
                      <img src={category.image} alt={category.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                    </div>
                    <div className="content">
                      <span className="location">
                        <i className="fal fa-map-marker-alt" /> {category.location || "UAE"}
                      </span>
                      <h5>
                        <Link href={category.link || '#'}>
                          {category.title}
                        </Link>
                      </h5>
                      <span className="time">Urban Adventure tourism</span>
                    </div>
                    <div className="destination-footer">
                      <Link
                        href={category.link || '#'}
                        className="read-more"
                      >
                        Check more details <i className="fal fa-angle-right" />
                      </Link>
                    </div>
                  </div>
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

