"use client";

import { sliderProps } from "@/utility/sliderprops";
import Link from "next/link";
import Slider from "react-slick";
import { useRef, useMemo } from "react";

const TourSlider = ({ title, tours = [] }) => {
  const sliderRef = useRef(null);

  if (!tours || tours.length === 0) {
    return null;
  }

  const toursLength = tours.length;

  // Memoize slider settings to prevent recreation on every render
  const tourSliderSettings = useMemo(() => ({
    infinite: toursLength > 1,
    speed: 400,
    arrows: false,
    dots: false,
    focusOnSelect: true,
    autoplay: toursLength > 1,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          infinite: toursLength > 1,
          autoplay: toursLength > 1,
          autoplaySpeed: 2000,
          pauseOnHover: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          infinite: toursLength > 1,
          autoplay: toursLength > 1,
          autoplaySpeed: 2000,
          pauseOnHover: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          infinite: toursLength > 1,
          autoplay: toursLength > 1,
          autoplaySpeed: 2000,
          pauseOnHover: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          infinite: toursLength > 1,
          autoplay: toursLength > 1,
          autoplaySpeed: 2000,
          pauseOnHover: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          infinite: toursLength > 1,
          autoplay: toursLength > 1,
          autoplaySpeed: 2000,
          pauseOnHover: false,
        },
      },
    ],
  }), [toursLength]);

  return (
    <section 
      className="tour-slider-section rel z-1" 
      style={{ background: '#fff', paddingTop: '20px', paddingBottom: '20px' }}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="section-title" style={{ padding: '0 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
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
                    color: '#484848',
                    fontSize: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
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
                    color: '#484848',
                    fontSize: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
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
              {...tourSliderSettings} 
              className="tour-slider-active" 
              ref={sliderRef}
            >
              {tours.map((tour, index) => {
                const discount = tour.discount || null;
                const originalPrice = tour.originalPrice || null;
                const currentPrice = tour.price || 0;
                const rating = tour.rating || 5;
                const reviews = tour.reviews || 0;
                
                // Ensure image URL is properly formatted
                let imageUrl = tour.image || tour.image1 || '/assets/images/default-tour.jpg';
                
                // If image is a relative path without leading slash, add it
                if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
                  imageUrl = '/' + imageUrl;
                }
                
                // If image is empty or null, use default
                if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') {
                  imageUrl = '/assets/images/default-tour.jpg';
                }

                return (
                  <div key={tour.id || index} className="tour-slider-item" style={{ padding: '0 5px' }}>
                    <div 
                      className="destination-item"
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
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
                          src={imageUrl}
                          alt={tour.title || tour.name}
                          style={{
                            width: '100%',
                                  height: '200px',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            // Fallback to default image if image fails to load
                            if (e.target.src !== '/assets/images/default-tour.jpg') {
                              e.target.src = '/assets/images/default-tour.jpg';
                            }
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
                            bottom: '10px',
                            right: '10px',
                            background: 'var(--secondary-color)',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '25px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '12px',
                            zIndex: 2,
                            boxShadow: '0 4px 12px rgba(247, 146, 30, 0.3)',
                          }}
                        >
                          Book Now
                        </Link>
                      </div>
                      <div className="content" style={{ padding: '15px' }}>
                        <h6 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '600', lineHeight: '1.4' }}>
                          <Link
                            href={
                              tour.link
                                ? tour.link
                                : {
                                    pathname: "/top-tour-details",
                                    query: { id: tour.id },
                                  }
                            }
                            style={{ color: '#1C231F', textDecoration: 'none' }}
                          >
                            {tour.title}
                          </Link>
                        </h6>
                        <div
                          className="rating"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className="fas fa-star"
                              style={{
                                color: i < rating ? '#ffc107' : '#ddd',
                                fontSize: '12px',
                                marginRight: '2px',
                              }}
                            />
                          ))}
                          <span style={{ marginLeft: '5px', fontSize: '12px', color: '#666' }}>
                            ({reviews})
                          </span>
                        </div>
                        <div className="price" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary-color)', marginTop: '5px' }}>
                          AED {currentPrice}
                          {originalPrice && (
                            <span
                              style={{
                                marginLeft: '8px',
                                fontSize: '14px',
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

