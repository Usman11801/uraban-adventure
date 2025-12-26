"use client";
import RaveloAccordion from "@/components/RaveloAccordion";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import toursData from "../desert-resort-list/toursData.json";
import Booking from "@/components/Booking";
import Addons from "@/components/Addons";
import OrderDetail from "@/components/OrderDetail";
import Gallery from "@/components/slider/Gallery";
import ReviewsSection from "@/components/ReviewsSection";
import { useCart } from "@/context/CartContext";

const page = () => {
  const [id, setId] = useState(null);
  const [tour, setTour] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({});
  const { addToCart } = useCart();

  const scrollToBooking = () => {
    const bookingSection = document.querySelector(".widget-booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryString = window.location.search;
      const params = new URLSearchParams(queryString);
      const id = params.get("id");
      if (id) {
        const numericId = parseInt(id, 10);
        setId(numericId);

        const foundTour = toursData.tours.find((tour) => tour.id === numericId);
        setTour(foundTour);
        console.log("Tour:", foundTour);
      }
    }
  }, []);

  // Get all available images
  const heroImages = tour ? [
    tour.image || tour.image1,
    tour.image1,
    tour.image2,
    tour.image3,
    tour.image4,
    tour.image5,
  ].filter((img, index, arr) => img && arr.indexOf(img) === index) : [];

  // Auto-rotate images every 2 seconds
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  const [active, setActive] = useState("collapse0");

  const faqItem = [
    {
      id: 1,
      title: "1. Do I get picked from hotel when I book a Desert Resort Tour?",
      answer:
        "Yes we shall pick you from your hotel / residence for Desert Resort Tours. And there is no additional charges for Pick it's included in the Price .",
    },
    {
      id: 2,
      title: "2. How long is the Desert Resort Tour?",
      answer:
        "Desert Resort Tours typically last 4 to 8 hours depending on the package selected.",
    },
    {
      id: 3,
      title: "3. Can I customize my Desert Resort Tour?",
      answer: "Yes, desert resort tours can be customized according to your preferences and interests.",
    },
    {
      id: 4,
      title: "4. What is included in the Desert Resort Tour?",
      answer:
        "Desert resort tours include hotel pickup and drop-off, professional guide, and all activities mentioned in the package.",
    },
    {
      id: 6,
      title:
        "6. What is the maximum number of people who can go on a Desert Resort Tour?",
      answer:
        "There is no limit to that as we can arrange for groups of any size.",
    },
  ];
  const [active2, setActive2] = useState("collapse0");
  return (
    <ReveloLayout>
      {/* Hero Image with Title */}
      {tour && heroImages.length > 0 && (
        <section className="tour-hero-section" style={{
          position: 'relative',
          width: '100%',
          height: '30vh',
          minHeight: '300px',
          overflow: 'hidden'
        }}>
          {heroImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={tour.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                opacity: index === currentImageIndex ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                zIndex: index === currentImageIndex ? 1 : 0
              }}
            />
          ))}
          {/* Title overlay - always visible */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
            padding: '40px 30px 30px',
            color: '#fff',
            zIndex: 10
          }}>
          <div className="container">
              <h1 style={{
                fontSize: '42px',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '10px',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>
                {tour.title}
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0" style={{ background: 'transparent', padding: 0 }}>
                  <li className="breadcrumb-item">
                    <Link href="/" style={{ color: '#fff' }}>Home</Link>
                  </li>
                  <li className="breadcrumb-item active" style={{ color: '#fff' }}>Tour Details</li>
                </ol>
              </nav>
          </div>
        </div>
      </section>
      )}
      {/* Booking Section - Right after hero image */}
          {tour && (
        <section className="booking-section-main pt-50 pb-50" style={{ background: 'var(--lighter-color)' }}>
          <div className="container">
            {/* Booking Form */}
            <div className="widget-booking-wrapper mb-30" id="booking-section">
              <Booking 
                tour={tour} 
                onBookingChange={setBookingData}
                onBuyNow={async () => {
                  if (bookingData && bookingData.selectedDate) {
                    const bookingSection = document.querySelector(".widget-booking form");
                    if (bookingSection) {
                      bookingSection.requestSubmit();
                    }
                  }
                }}
                onAddToCart={() => {
                  if (bookingData && bookingData.selectedDate) {
                    addToCart({
                      tourId: tour.id,
                      tourTitle: tour.title,
                      tourImage: tour.image || tour.image1,
                      ...bookingData,
                      selectedAddons,
                      totalAmount: (parseFloat(bookingData.totalAmount || 0) + Object.keys(selectedAddons).reduce((sum, id) => {
                        const addon = selectedAddons[id];
                        return sum + ((addon?.adult || 0) * (addon?.adultPrice || 0)) + ((addon?.child || 0) * (addon?.childPrice || 0));
                      }, 0)).toFixed(2)
                    });
                    alert("Package added to cart!");
                  } else {
                    alert("Please select a date first");
                  }
                }}
              />
        </div>
            
            {/* Content Section with Addons and Order Detail */}
            <div className="row">
              <div className="col-lg-8">
                {/* Addons Section */}
                <Addons tour={tour} onAddonsChange={setSelectedAddons} />
      </div>
              <div className="col-lg-4">
                <OrderDetail 
                  tour={tour}
                  bookingData={bookingData}
                  selectedAddons={selectedAddons}
                  onBuyNow={async () => {
                    if (bookingData && bookingData.selectedDate) {
                      const bookingSection = document.querySelector(".widget-booking form");
                      if (bookingSection) {
                        bookingSection.requestSubmit();
                      }
                    }
                  }}
                  onAddToCart={() => {
                    if (bookingData && bookingData.selectedDate) {
                      addToCart({
                        tourId: tour.id,
                        tourTitle: tour.title,
                        tourImage: tour.image || tour.image1,
                        ...bookingData,
                        selectedAddons,
                        totalAmount: (parseFloat(bookingData.totalAmount || 0) + Object.keys(selectedAddons).reduce((sum, id) => {
                          const addon = selectedAddons[id];
                          return sum + ((addon?.adult || 0) * (addon?.adultPrice || 0)) + ((addon?.child || 0) * (addon?.childPrice || 0));
                        }, 0)).toFixed(2)
                      });
                      alert("Package added to cart!");
                    } else {
                      alert("Please select a date first");
                    }
                  }}
                />
              </div>
            </div>
        </div>
      </section>
      )}
      {/* Tour Details Area start */}
      <section className="tour-details-page pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="tour-details-content">
                <h3>Explore Tours</h3>
                <p>{tour?.description2}</p>
                <div className="row pb-55">
                  <div className="">
                    <div className="tour-include-exclude mt-30">
                      <h5>Package Inclusions</h5>
                      <ul className="list-style-one check mt-25">
                        {tour?.inclusions &&
                          Object.entries(tour.inclusions).map(
                            ([key, value], index) => (
                              <li key={index}>
                                <i className="far fa-check" />
                                {value}
                              </li>
                            )
                          )}
                        {tour?.pick && !tour?.inclusions &&
                          Object.entries(tour.pick).map(
                            ([key, value], index) => (
                              <li key={index}>
                                <i className="far fa-check" />
                                {value}
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row pb-55">
                  <div className="">
                    <div className="tour-include-exclude mt-30">
                      <h5>Additional Information</h5>
                      <ul className="list-style-one check mt-25">
                        {tour?.additional_info &&
                          Object.entries(tour.additional_info).map(
                            ([key, value], index) => {
                              if (Array.isArray(value)) {
                                return value.map((item, i) => (
                                  <li key={`${index}-${i}`}>
                                    <i className="far fa-check" />
                                    {item}
                                  </li>
                                ));
                              }
                              return (
                                <li key={index}>
                                  <i className="far fa-check" />
                                  {value}
                                </li>
                              );
                            }
                          )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <h3>Itinerary</h3>
              <Accordion
                className="accordion-two mt-25 mb-60"
                defaultActiveKey={active}
              >
                {faqItem.map((data, i) => (
                  <RaveloAccordion
                    title={data.title}
                    answer={data.answer}
                    key={data.id}
                    event={`collapse${i}`}
                    onClick={() =>
                      setActive(active == `collapse${i}` ? "" : `collapse${i}`)
                    }
                    active={active}
                  />
                ))}
              </Accordion>
              <h3>Maps</h3>
              <div className="tour-map mt-30 mb-50">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d28917.758162586367!2d55.270783!3d25.204849!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1706508986625!5m2!1sen!2sbd"
                  style={{ border: 0, width: "100%" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <h3>Clients Reviews</h3>
              <div className="clients-reviews bgc-black mt-30 mb-60">
                <div className="left">
                  <b>4.8</b>
                  <span>(586 reviews)</span>
                  <div className="ratting">
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star-half-alt" />
                  </div>
                </div>
                <div className="right">
                  <div className="ratting-item">
                    <span className="title">Services</span>
                    <span className="line">
                      <span style={{ width: "80%" }} />
                    </span>
                    <div className="ratting">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star-half-alt" />
                    </div>
                  </div>
                  <div className="ratting-item">
                    <span className="title">Guides</span>
                    <span className="line">
                      <span style={{ width: "70%" }} />
                    </span>
                    <div className="ratting">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star-half-alt" />
                    </div>
                  </div>
                  <div className="ratting-item">
                    <span className="title">Price</span>
                    <span className="line">
                      <span style={{ width: "80%" }} />
                    </span>
                    <div className="ratting">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star-half-alt" />
                    </div>
                  </div>
                  <div className="ratting-item">
                    <span className="title">Safety</span>
                    <span className="line">
                      <span style={{ width: "80%" }} />
                    </span>
                    <div className="ratting">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star-half-alt" />
                    </div>
                  </div>
                  <div className="ratting-item">
                    <span className="title">Foods</span>
                    <span className="line">
                      <span style={{ width: "80%" }} />
                    </span>
                    <div className="ratting">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star-half-alt" />
                    </div>
                  </div>
                  <div className="ratting-item">
                    <span className="title">Hotels</span>
                    <span className="line">
                      <span style={{ width: "80%" }} />
                    </span>
                    <div className="ratting">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star-half-alt" />
                    </div>
                  </div>
                </div>
              </div>
              <ReviewsSection tour={tour} />
            </div>
          </div>
        </div>
      </section>
      {/* Tour Details Area end */}
      {/* Newsletter Area start */}
      {/* <Subscribe /> */}
      {/* Newsletter Area end */}
    </ReveloLayout>
  );
};
export default page;
