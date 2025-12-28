"use client";
import RaveloAccordion from "@/components/RaveloAccordion";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
// Removed static JSON import - now fetching from DB
import Booking from "@/components/Booking";
import Addons from "@/components/Addons";
import OrderDetail from "@/components/OrderDetail";
import Gallery from "@/components/slider/Gallery";
import ReviewsSection from "@/components/ReviewsSection";
import BookingForm from "@/components/BookingForm";
import Loader from "@/components/Loader";
import { useCart } from "@/context/CartContext";

const page = () => {
  const [id, setId] = useState(null);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  const { addToCart } = useCart();

  const scrollToBooking = () => {
    const bookingSection = document.querySelector(".widget-booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchPackage = async () => {
      if (typeof window !== "undefined") {
        setLoading(true);
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const slug = params.get("slug");
        const id = params.get("id");
        
        // Set maximum timeout - show page after 1.5 seconds even if data not loaded
        const timeoutId = setTimeout(() => {
          setLoading(false);
        }, 1500);
        
        try {
          if (slug) {
            // Fetch by slug (preferred method)
            const response = await fetch(`/api/packages/${slug}`);
            const data = await response.json();
            if (data.package) {
              setTour(data.package);
              setId(data.package.id);
              console.log("Tour fetched by slug:", data.package);
            } else {
              console.error("Package not found with slug:", slug);
            }
          } else if (id) {
            // Fallback: fetch by id if slug not provided
            setId(id);
            
            const response = await fetch(`/api/packages/by-id/${id}`);
            const data = await response.json();
            if (data.package) {
              setTour(data.package);
              console.log("Tour fetched by id:", data.package);
            } else {
              console.error("Package not found with id:", id);
            }
          }
        } catch (error) {
          console.error("Error fetching package:", error);
        } finally {
          clearTimeout(timeoutId);
          // Hide loader after minimum 300ms to prevent flicker
          setTimeout(() => {
            setLoading(false);
          }, 300);
        }
      }
    };

    fetchPackage();
  }, []);

  // Get all available images - top-tour uses single image field, but we'll support multiple if available
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

  // Get itinerary from tour data (from DB) - now supports array of {question, answer} objects
  const getItineraryItems = () => {
    if (!tour?.itinerary) return [];
    
    // If itinerary is an array, use it directly (new format: [{question, answer}])
    if (Array.isArray(tour.itinerary)) {
      return tour.itinerary
        .filter(item => item && (item.question || item.title) && (item.answer || item.description || item.content))
        .map((item, index) => ({
          id: item.id || index + 1,
          title: item.question || item.title || `Question ${index + 1}`,
          answer: item.answer || item.description || item.content || ''
        }));
    }
    
    // If itinerary is an object, convert to array format (legacy support)
    if (typeof tour.itinerary === 'object') {
      return Object.entries(tour.itinerary)
        .filter(([key, value]) => value && (typeof value === 'object' ? (value.title || value.question) : true))
        .map(([key, value], index) => ({
          id: index + 1,
          title: typeof value === 'object' ? (value.question || value.title || key) : key,
          answer: typeof value === 'object' ? (value.answer || value.description || value.content || '') : String(value)
        }));
    }
    
    return [];
  };

  const faqItem = getItineraryItems();
  const [active2, setActive2] = useState("collapse0");

  // Calculate grand total including addons
  const calculateGrandTotal = () => {
    if (!bookingData) return 0;
    const baseTotal = parseFloat(bookingData.totalAmount || 0);
    const addonsTotal = Object.keys(selectedAddons).reduce((sum, id) => {
      const addon = selectedAddons[id];
      if (addon && addon.selected) {
        return sum + ((addon.adult || 0) * (addon.adultPrice || 0)) + ((addon.child || 0) * (addon.childPrice || 0));
      }
      return sum;
    }, 0);
    return baseTotal + addonsTotal;
  };

  // Prepare cart item for BookingForm (single item array)
  const getCartItemForBooking = () => {
    if (!bookingData || !tour) return null;
    
    return {
      id: `temp-${Date.now()}`,
      tourId: tour.id,
      tourTitle: tour.name || tour.title,
      tourImage: tour.image || tour.image1,
      ...bookingData,
      selectedAddons,
      totalAmount: calculateGrandTotal().toFixed(2)
    };
  };

  // Handle Buy Now - open booking form modal
  const handleBuyNow = () => {
    if (!bookingData || !bookingData.selectedDate) {
      alert("Please select a date first");
      return;
    }
    if (!tour) {
      alert("Tour information is not available. Please refresh the page.");
      return;
    }
    setPaymentType("stripe");
    setShowBookingForm(true);
  };

  // Handle booking form success
  const handleBookingSuccess = (result) => {
    setShowBookingForm(false);
    
    if (result.type === "stripe") {
      // Redirect to Stripe checkout
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        alert("Failed to create payment session. Please try again.");
      }
    }
  };

  if (loading) {
    return <Loader message="Loading tour details..." />;
  }

  if (!tour) {
    return (
      <ReveloLayout>
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Tour Not Found</h2>
          <p style={{ marginTop: '20px', color: 'var(--base-color)' }}>
            The tour you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/" className="theme-btn bgc-secondary" style={{ marginTop: '30px', display: 'inline-block' }}>
            <span data-hover="Go Home">Go Home</span>
            <i className="fal fa-arrow-right" />
          </Link>
        </div>
      </ReveloLayout>
    );
  }

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
              alt={tour.name || tour.title || 'Tour image'}
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
                {tour.name || tour.title}
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
                onBuyNow={handleBuyNow}
                onAddToCart={() => {
                  if (bookingData && bookingData.selectedDate) {
                    addToCart({
                      tourId: tour.id,
                      tourTitle: tour.name || tour.title,
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
                  onBuyNow={handleBuyNow}
                  onAddToCart={() => {
                    if (bookingData && bookingData.selectedDate) {
                      addToCart({
                        tourId: tour.id,
                        tourTitle: tour.name || tour.title,
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
                        {tour?.inclusions ? (
                          // If inclusions is an array, map directly
                          Array.isArray(tour.inclusions) ? (
                            tour.inclusions.map((item, index) => (
                              <li key={index}>
                                <i className="far fa-check" />
                                {typeof item === 'string' ? item : (item.name || item.title || item)}
                              </li>
                            ))
                          ) : (
                            // If inclusions is an object, convert to array
                            Object.entries(tour.inclusions).map(([key, value], index) => (
                              <li key={index}>
                                <i className="far fa-check" />
                                {typeof value === 'string' ? value : (value.name || value.title || key)}
                              </li>
                            ))
                          )
                        ) : (
                          <li>No inclusions specified.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                {tour?.excluded && Array.isArray(tour.excluded) && tour.excluded.length > 0 && (
                  <div className="row pb-55">
                    <div className="">
                      <div className="tour-include-exclude mt-30">
                        <h5>Excluded</h5>
                        <ul className="list-style-one check mt-25">
                          {tour.excluded.map((item, index) => (
                            <li key={index}>
                              <i className="far fa-times" style={{ color: '#ef4444' }} />
                              {typeof item === 'string' ? item : (item.name || item.title || item)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <div className="row pb-55">
                  <div className="">
                    <div className="tour-include-exclude mt-30">
                      <h5>Additional Information</h5>
                      <ul className="list-style-one check mt-25">
                        {tour?.additional_info ? (
                          // If additional_info is an array, map directly
                          Array.isArray(tour.additional_info) ? (
                            tour.additional_info.map((item, index) => (
                              <li key={index}>
                                <i className="far fa-check" />
                                {typeof item === 'string' ? item : (item.name || item.title || item)}
                              </li>
                            ))
                          ) : (
                            // If additional_info is an object, convert to array
                            Object.entries(tour.additional_info).map(([key, value], index) => {
                              if (Array.isArray(value)) {
                                return value.map((item, i) => (
                                  <li key={`${index}-${i}`}>
                                    <i className="far fa-check" />
                                    {typeof item === 'string' ? item : (item.name || item.title || item)}
                                  </li>
                                ));
                              }
                              return (
                                <li key={index}>
                                  <i className="far fa-check" />
                                  {typeof value === 'string' ? value : (value.name || value.title || key)}
                                </li>
                              );
                            })
                          )
                        ) : (
                          <li>No additional information available.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {faqItem.length > 0 && (
                <>
                  <h3>Itinerary</h3>
                  <Accordion
                    className="accordion-two mt-25 mb-60"
                    defaultActiveKey={active}
                  >
                    {faqItem.map((data, i) => (
                      <RaveloAccordion
                        title={data.title}
                        answer={data.answer}
                        key={data.id || i}
                        event={`collapse${i}`}
                        onClick={() =>
                          setActive(active == `collapse${i}` ? "" : `collapse${i}`)
                        }
                        active={active}
                      />
                    ))}
                  </Accordion>
                </>
              )}
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

      {/* Booking Form Modal */}
      {showBookingForm && bookingData && tour && getCartItemForBooking() && (
        <BookingForm
          cartItems={[getCartItemForBooking()]}
          grandTotal={calculateGrandTotal()}
          onClose={() => {
            setShowBookingForm(false);
            setPaymentType(null);
          }}
          paymentType={paymentType}
          onSuccess={handleBookingSuccess}
        />
      )}
    </ReveloLayout>
  );
};
export default page;
