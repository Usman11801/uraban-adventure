"use client";

import { sliderProps } from "@/utility/sliderprops";
import Link from "next/link";
import Slider from "react-slick";
import { useRef } from "react";

const TourSlider = ({ title, tours = [] }) => {
  const sliderRef = useRef(null);

  if (!tours || tours.length === 0) {
    return null;
  }

  const tourSliderSettings = {
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
    <section className="tour-slider-section rel z-1" style={{ background: '#fff', paddingTop: '50px', paddingBottom: '50px' }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="section-title" style={{ padding: '0 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '0', color: '#1C231F', fontFamily: 'var(--heading-font)' }}>{title}</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  style={{
                    background: '#fff',
                    border: '2px solid #E9E9E9',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: '#484848',
                    fontSize: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--primary-color)';
                    e.target.style.borderColor = 'var(--primary-color)';
                    e.target.style.color = '#fff';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.borderColor = '#E9E9E9';
                    e.target.style.color = '#484848';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  style={{
                    background: '#fff',
                    border: '2px solid #E9E9E9',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: '#484848',
                    fontSize: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--primary-color)';
                    e.target.style.borderColor = 'var(--primary-color)';
                    e.target.style.color = '#fff';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#fff';
                    e.target.style.borderColor = '#E9E9E9';
                    e.target.style.color = '#484848';
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
            <Slider {...tourSliderSettings} className="tour-slider-active" ref={sliderRef}>
              {tours.map((tour, index) => {
                const discount = tour.discount || null;
                const originalPrice = tour.originalPrice || null;
                const currentPrice = tour.price || 0;
                const rating = tour.rating || 5;
                const reviews = tour.reviews || 0;

                return (
                  <div key={tour.id || index} className="tour-slider-item" style={{ padding: '0 10px' }}>
                    <div className="destination-item style-two tour-card" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'all 0.3s ease', background: '#fff' }}>
                      <div className="image" style={{ position: 'relative', width: '100%' }}>
                        {discount && (
                          <div
                            className="discount-badge"
                            style={{
                              position: 'absolute',
                              top: '12px',
                              left: '12px',
                              background: 'var(--secondary-color)',
                              color: '#fff',
                              padding: '8px 14px',
                              borderRadius: '30px',
                              fontSize: '13px',
                              fontWeight: '700',
                              zIndex: 2,
                              boxShadow: '0 4px 12px rgba(247, 146, 30, 0.4)',
                              letterSpacing: '0.5px'
                            }}
                          >
                            -{discount}% OFF
                          </div>
                        )}
                        <img
                          src={tour.image}
                          alt={tour.title}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover',
                          }}
                        />
                        <Link
                          href={
                            tour.link
                              ? tour.link
                              : {
                                  pathname: "/top-tour-details",
                                  query: { id: tour.id },
                                }
                          }
                          className="book-now-btn"
                          style={{
                            position: 'absolute',
                            bottom: '15px',
                            right: '15px',
                            background: 'var(--secondary-color)',
                            color: '#fff',
                            padding: '12px 24px',
                            borderRadius: '30px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '14px',
                            zIndex: 2,
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(247, 146, 30, 0.3)',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'var(--primary-color)';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 16px rgba(99, 171, 69, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'var(--secondary-color)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(247, 146, 30, 0.3)';
                          }}
                        >
                          Book Now
                        </Link>
                      </div>
                      <div className="content" style={{ padding: '20px' }}>
                        <h6 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '600', lineHeight: '1.4' }}>
                          <Link
                            href={
                              tour.link
                                ? tour.link
                                : {
                                    pathname: "/top-tour-details",
                                    query: { id: tour.id },
                                  }
                            }
                            style={{ color: '#1C231F', textDecoration: 'none', transition: 'color 0.3s ease' }}
                            onMouseEnter={(e) => {
                              e.target.style.color = 'var(--primary-color)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = '#1C231F';
                            }}
                          >
                            {tour.title}
                          </Link>
                        </h6>
                        <div
                          className="rating"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                          }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className="fas fa-star"
                              style={{
                                color: i < rating ? '#ffc107' : '#ddd',
                                fontSize: '14px',
                                marginRight: '2px',
                              }}
                            />
                          ))}
                          <span style={{ marginLeft: '5px', fontSize: '14px', color: '#666' }}>
                            ({reviews})
                          </span>
                        </div>
                        <div className="price" style={{ fontSize: '22px', fontWeight: '700', color: 'var(--primary-color)', marginTop: '8px' }}>
                          AED {currentPrice}
                          {originalPrice && (
                            <span
                              style={{
                                marginLeft: '12px',
                                fontSize: '16px',
                                color: '#999',
                                textDecoration: 'line-through',
                                fontWeight: '400',
                              }}
                            >
                              AED {originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourSlider;

