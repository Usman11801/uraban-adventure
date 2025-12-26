"use client";

import { useState, useEffect } from "react";
import Counter from "@/components/Counter";
import SearchFilter from "@/components/SearchFilter";
import SectionTitle from "@/components/SectionTitle";
import Testimonial from "@/components/slider/Testimonial";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
// Removed static JSON imports - now fetching from DB
import Gallery from "@/components/slider/Gallery";
import TourSlider from "@/components/slider/TourSlider";
import CategorySlider from "@/components/slider/CategorySlider";

const page = () => {
  const [categoryTours, setCategoryTours] = useState([]); // Array of {category, tours}
  const [categories, setCategories] = useState([]);
  const [topTours, setTopTours] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndTours = async () => {
      try {
        // First, fetch all active categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        const activeCategories = (categoriesData.categories || []).filter(cat => cat.is_active);
        
        // Transform categories for CategorySlider
        const transformedCategories = activeCategories.map((cat, index) => ({
          id: cat.id,
          title: cat.name,
          image: cat.image || `assets/images/destinations/main${(index % 4) + 1}.jpg`,
          location: "UAE",
          rating: 4.8,
          price: 0,
            link: cat.slug ? (cat.slug.endsWith('-list') ? `/category/${cat.slug}` : `/category/${cat.slug}-list`) : '#',
        }));
        setCategories(transformedCategories);

        // Then, for each category, fetch its packages
        const categoryToursData = await Promise.all(
          activeCategories.map(async (category) => {
            try {
              const response = await fetch(`/api/packages?category_id=${category.id}&limit=8`);
              const data = await response.json();
              const packages = (data.packages || []).map((tour) => ({
                ...tour,
                id: tour.id,
                title: tour.name || 'Untitled Tour',
                name: tour.name,
                price: parseFloat(tour.discount_price || tour.base_price || 0),
                base_price: tour.base_price,
                discount_price: tour.discount_price,
                reviews: tour.total_reviews || 0,
                rating: parseInt(tour.rating || 5),
                originalPrice: tour.discount_price && tour.base_price ? parseFloat(tour.base_price) : null,
                discount: tour.badge ? parseInt(tour.badge.replace('% Off', '').replace('%', '')) : null,
                link: `/top-tour-details?slug=${tour.slug}`,
                image: tour.image || '/assets/images/default-tour.jpg',
              }));
              
              return {
                category,
                tours: packages,
              };
            } catch (error) {
              console.error(`Failed to fetch packages for category ${category.name}:`, error);
              return {
                category,
                tours: [],
              };
            }
          })
        );

        // Filter out categories with no tours
        setCategoryTours(categoryToursData.filter(item => item.tours.length > 0));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    const fetchFeaturedTours = async () => {
      try {
        // Fetch packages with badge "Featured" or "Popular" for Top Tours
        const topToursResponse = await fetch('/api/packages?limit=3');
        const topToursData = await topToursResponse.json();
        if (topToursData.packages) {
          const transformedTopTours = topToursData.packages.slice(0, 3).map((tour) => ({
            ...tour,
            id: tour.id,
            title: tour.name || 'Untitled Tour',
            name: tour.name,
            price: parseFloat(tour.discount_price || tour.base_price || 0),
            base_price: tour.base_price,
            discount_price: tour.discount_price,
            reviews: tour.total_reviews || 0,
            rating: parseInt(tour.rating || 5),
            originalPrice: tour.discount_price && tour.base_price ? parseFloat(tour.base_price) : null,
            discount: tour.badge ? parseInt(tour.badge.replace('% Off', '').replace('%', '')) : null,
            link: `/top-tour-details?slug=${tour.slug}`,
            image: tour.image || '/assets/images/default-tour.jpg',
          }));
          setTopTours(transformedTopTours);
        }

        // Fetch packages for Best Selling (can use different criteria)
        const bestSellingResponse = await fetch('/api/packages?limit=3');
        const bestSellingData = await bestSellingResponse.json();
        if (bestSellingData.packages) {
          const transformedBestSelling = bestSellingData.packages.slice(3, 6).map((tour) => ({
            ...tour,
            id: tour.id,
            title: tour.name || 'Untitled Tour',
            name: tour.name,
            price: parseFloat(tour.discount_price || tour.base_price || 0),
            base_price: tour.base_price,
            discount_price: tour.discount_price,
            reviews: tour.total_reviews || 0,
            rating: parseInt(tour.rating || 5),
            originalPrice: null,
            discount: null,
            link: `/top-tour-details?slug=${tour.slug}`,
            image: tour.image || '/assets/images/default-tour.jpg',
          }));
          setBestSelling(transformedBestSelling);
        }
      } catch (error) {
        console.error('Failed to fetch featured tours:', error);
      }
    };

    fetchCategoriesAndTours();
    fetchFeaturedTours();
  }, []);
  return (
    <div>
      <style jsx>{`
        .read-more {
          color: white !important;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .read-more:hover {
          color: #e0e0e0 !important;
          text-decoration: none;
        }

        .read-more i {
          color: inherit;
        }
      `}</style>
      <ReveloLayout header={1}>
        {/* Hero Area Start */}

        <section
          className="hero-area bgc-black rel z-2"
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            margin: 0,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <div
            className="container-fluid"
            style={{ padding: 0, margin: 0, width: "100%", maxWidth: "100%" }}
          >
            <Gallery
              images={[
                "assets/images/destinations/burj1.jpg",
                "assets/images/destinations/dubai1.jpg",
                "assets/images/destinations/main1.jpg",
                "assets/images/destinations/burj2.jpg",
                "assets/images/destinations/dubai2.jpg",
                "assets/images/destinations/main2.jpg",
                "assets/images/destinations/burj3.jpg",
                "assets/images/destinations/dubai3.jpg",
                "assets/images/destinations/main3.jpg",
                "assets/images/destinations/burj4.jpg",
                "assets/images/destinations/dubai4.jpg",
                "assets/images/destinations/main4.jpg",
                "assets/images/destinations/burj5.jpg",
                "assets/images/destinations/dubai5.jpg",
                "assets/images/destinations/sunrise.jpg",
                "assets/images/destinations/dubai6.jpg",
                "assets/images/destinations/morning.jpg",
                "assets/images/destinations/dubai7.jpg",
                "assets/images/destinations/evening.jpg",
              ]}
            />
          </div>
          {/* <SearchFilter /> */}
        </section>
        {/* Hero Area End */}

        {/* Categories Slider Section - Now Dynamic from DB */}
        {/* <CategorySlider
          title="Discover the Dubai with Urban Adventure tourism"
          categories={[
            {
              id: 1,
              title: "Desert Safari",
              image: "assets/images/destinations/main4.jpg",
              location: "UAE",
              rating: 4.8,
              price: 52.0,
              link: "tour-list",
            },
            {
              id: 2,
              title: "City Tour",
              image: "assets/images/destinations/main3.jpg",
              location: "UAE",
              rating: 4.8,
              price: 42.0,
              link: "sight-see-list",
            },
            {
              id: 3,
              title: "Desert Resort",
              image: "assets/images/destinations/main2.jpg",
              location: "UAE",
              rating: 4.8,
              price: 63.0,
              link: "desert-resort-list",
            },
            {
              id: 4,
              title: "Theme Park",
              image: "assets/images/destinations/main1.jpg",
              location: "UAE",
              rating: 4.8,
              price: 58.0,
              link: "theme-park-list",
            },
            {
              id: 5,
              title: "Buggy & Quad Bikes",
              image: "assets/images/destinations/bike1.jpg",
              location: "UAE",
              rating: 4.8,
              price: 200.0,
              link: "buggy-bike-list",
            },
            {
              id: 6,
              title: "Private Tour",
              image: "assets/images/destinations/private.png",
              location: "UAE",
              rating: 4.8,
              price: 300.0,
              link: "private-tour-list",
            },
            {
              id: 7,
              title: "Executive",
              image: "assets/images/destinations/dhabi1.jpg",
              location: "UAE",
              rating: 4.8,
              price: 400.0,
              link: "executive-tour-list",
            },
            {
              id: 8,
              title: "Combo Deals",
              image: "assets/images/destinations/main1.jpg",
              location: "UAE",
              rating: 4.8,
              price: 500.0,
              link: "combo-deal-list",
            },
            {
              id: 9,
              title: "Water Parks",
              image: "assets/images/destinations/main2.jpg",
              location: "UAE",
              rating: 4.8,
              price: 150.0,
              link: "water-park-list",
            },
            {
              id: 10,
              title: "Sky Tours",
              image: "assets/images/destinations/main3.jpg",
              location: "UAE",
              rating: 4.8,
              price: 250.0,
              link: "sky-tour-list",
            },
            {
              id: 11,
              title: "Sea Advantucher",
              image: "assets/images/destinations/main4.jpg",
              location: "UAE",
              rating: 4.8,
              price: 350.0,
              link: "sea-advantucher-list",
            },
            {
              id: 12,
              title: "Dhow Cruise",
              image: "assets/images/destinations/main1.jpg",
              location: "UAE",
              rating: 4.8,
              price: 200.0,
              link: "dhow-cruise-list",
            },
          ]}
        /> */}
        {categories.length > 0 && (
          <CategorySlider
            title="Discover the Dubai with Urban Adventure tourism"
            categories={categories}
          />
        )}

        {/* Top Tours Section */}
        {topTours.length > 0 && (
          <TourSlider
            title="Top Tours"
            tours={topTours}
          />
        )}

        {/* Best Selling Section */}
        {bestSelling.length > 0 && (
          <TourSlider
            title="BEST SELLING"
            tours={bestSelling}
          />
        )}

        {/* Category Sliders Start - Dynamic from Database */}
        {/* Render a slider for each category with its packages */}
        {categoryTours.map((item) => (
          item.tours.length > 0 && (
            <TourSlider 
              key={item.category.id} 
              title={item.category.name} 
              tours={item.tours} 
            />
          )
        ))}

        {/* Tickets Section - Show featured tours from first category if available */}
        {categoryTours.length > 0 && categoryTours[0].tours.length > 0 && (
          <TourSlider
            title="Tickets"
            tours={categoryTours[0].tours.slice(0, 6).map((tour) => ({
              ...tour,
              reviews: tour.reviews || 0,
              originalPrice: null,
              discount: null,
            }))}
          />
        )}

        {/* About Us Area start */}
        <section className="about-us-area py-100 rpb-90 rel z-1">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-5 col-lg-6">
                <div
                  className="about-us-content rmb-55"
                  data-aos="fade-left"
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div className="section-title mb-25">
                    <h2>
                      Travel with Confidence Top Reasons to Choose Our Agency
                    </h2>
                  </div>
                  <p>
                    We go above and beyond to make your travel dreams reality
                    hidden gems and must-see attractions
                  </p>
                  <div className="divider counter-text-wrap mt-45 mb-55">
                    <span>
                      We have{" "}
                      <span>
                        <span
                          className="count-text plus"
                          data-speed={3000}
                          data-stop={25}
                        >
                          <Counter end={25} />
                        </span>{" "}
                        Years
                      </span>{" "}
                      of experience
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="counter-item counter-text-wrap">
                        <span
                          className="count-text k-plus"
                          data-speed={3000}
                          data-stop={3}
                        >
                          <Counter end={3} />
                        </span>
                        <span className="counter-title">
                          Popular Destination
                        </span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="counter-item counter-text-wrap">
                        <span
                          className="count-text m-plus"
                          data-speed={3000}
                          data-stop={9}
                        >
                          <Counter end={9} />
                        </span>
                        <span className="counter-title">Satisfied Clients</span>
                      </div>
                    </div>
                  </div>
                  <Link href="tour-list" className="theme-btn mt-10 style-two">
                    <span data-hover="Explore Destinations">
                      Explore Destinations
                    </span>
                    <i className="fal fa-arrow-right" />
                  </Link>
                </div>
              </div>
              <div
                className="col-xl-7 col-lg-6"
                data-aos="fade-right"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="about-us-image">
                  <div className="shape">
                    <img src="assets/images/about/shape1.png" alt="Shape" />
                  </div>
                  <div className="shape">
                    <img src="assets/images/about/shape2.png" alt="Shape" />
                  </div>
                  <div className="shape">
                    <img src="assets/images/about/shape3.png" alt="Shape" />
                  </div>
                  <div className="shape">
                    <img src="assets/images/about/shape4.png" alt="Shape" />
                  </div>
                  <div className="shape">
                    <img src="assets/images/about/shape5.png" alt="Shape" />
                  </div>
                  <div className="shape">
                    <img src="assets/images/about/shape6.png" alt="Shape" />
                  </div>
                  <div className="shape">
                    <img src="assets/images/about/shape7.png" alt="Shape" />
                  </div>
                  <img src="assets/images/about/about.png" alt="About" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* About Us Area end */}
        {/* Popular Destinations Area start */}
        {/* <section className="popular-destinations-area rel z-1">
          <div className="container-fluid">
            <div className="popular-destinations-wrap br-20 bgc-lighter pt-100 pb-70">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <div
                    className="section-title text-center counter-text-wrap mb-70"
                    data-aos="fade-up"
                    data-aos-duration={1500}
                    data-aos-offset={50}
                  >
                    <SectionTitle
                      title={"Our Top Tours"}
                      subtitle2="most popular experience"
                    />
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="row justify-content-center">
                  {destinations2.map((destination, index) => (
                    <div key={index} className="col-xl-3 col-md-6">
                      <div
                        className="destination-item style-two"
                        data-aos="flip-up"
                        data-aos-delay={destination.aosDelay}
                        data-aos-duration={1500}
                        data-aos-offset={50}
                      >
                        <div className="image">
                          <a href="#" className="heart">
                            <i className="fas fa-heart" />
                          </a>
                          <img src={destination.image} alt="Destination" />
                        </div>
                        <div className="content">
                          <h6>
                            <Link
                              href={{
                                pathname: "/top-tour-details",
                                query: { id: destination?.id },
                              }}
                            >
                              {destination.title}
                            </Link>
                          </h6>
                          <p>Price</p>
                          <br />
                          <p>AED {destination.price}</p>
                          <br />
                          <Link
                            href={{
                              pathname: "/top-tour-details",
                              query: { id: destination?.id },
                            }}
                            // href={tour.link}
                            className="theme-btn style-two style-three"
                          >
                            <span data-hover="Book Now">Book Now</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section> */}
        {/* Popular Destinations Area end */}
        {/* Features Area start */}
        <section className="features-area pt-100 pb-45 rel z-1">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-6">
                <div
                  className="features-content-part mb-55"
                  data-aos="fade-left"
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div className="section-title mb-60">
                    <h2>
                      The Ultimate Travel Experience Features That Set Our
                      Agency Apart
                    </h2>
                  </div>
                  <div className="features-customer-box">
                    <div className="image">
                      <img
                        src="assets/images/features/features-box.jpg"
                        alt="Features"
                      />
                    </div>
                    <div className="content">
                      <div className="feature-authors mb-15">
                        <img
                          src="assets/images/features/feature-author1.jpg"
                          alt="Author"
                        />
                        <img
                          src="assets/images/features/feature-author2.jpg"
                          alt="Author"
                        />
                        <img
                          src="assets/images/features/feature-author3.jpg"
                          alt="Author"
                        />
                        <span>4k+</span>
                      </div>
                      <h6>850K+ Happy Customer</h6>
                      <div className="divider style-two counter-text-wrap my-25">
                        <span>
                          <span
                            className="count-text plus"
                            data-speed={3000}
                            data-stop={25}
                          >
                            15
                          </span>{" "}
                          Years
                        </span>
                      </div>
                      <p>
                        We pride ourselves offering personalized itineraries
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-xl-6"
                data-aos="fade-right"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="row pb-25">
                  <div className="col-md-6">
                    <div className="feature-item">
                      <div className="icon">
                        <i className="flaticon-tent" />
                      </div>
                      <div className="content">
                        <h5>
                          <Link href="tour-details">Desert Safari</Link>
                        </h5>
                        <p>
                          Experience the ultimate desert adventure with Sunrise
                          View Safari
                        </p>
                      </div>
                    </div>
                    <div className="feature-item">
                      <div className="icon">
                        <i className="flaticon-tent" />
                      </div>
                      <div className="content">
                        <h5>
                          <Link href="tour-details">Dinner</Link>
                        </h5>
                        <p>Desert Safari with Bab Al Shams Dinner</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="feature-item mt-20">
                      <div className="icon">
                        <i className="flaticon-tent" />
                      </div>
                      <div className="content">
                        <h5>
                          <Link href="tour-details">Quad Biking</Link>
                        </h5>
                        <p>
                          Desert biking is exhilarating sport that physical
                          fitness
                        </p>
                      </div>
                    </div>
                    <div className="feature-item">
                      <div className="icon">
                        <i className="flaticon-tent" />
                      </div>
                      <div className="content">
                        <h5>
                          <Link href="tour-details">
                            Duad Biking with Childrens
                          </Link>
                        </h5>
                        <p>Duad Biking with Childrens are the best</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Features Area end */}
        {/* Hotel Area start */}
        {/* <section className="hotel-area bgc-black py-100 rel z-1">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div
                className="section-title text-white text-center counter-text-wrap mb-70"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <SectionTitle
                  title={"Discover the World's Class Top Hotel"}
                  subtitle2="most popular experience you'll remember"
                />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xxl-6 col-xl-8 col-lg-10">
              <div
                className="destination-item style-three"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="image">
                  <div className="ratting">
                    <i className="fas fa-star" /> 4.8
                  </div>
                  <a href="#" className="heart">
                    <i className="fas fa-heart" />
                  </a>
                  <img
                    src="assets/images/destinations/hotel1.jpg"
                    alt="Hotel"
                  />
                </div>
                <div className="content">
                  <span className="location">
                    <i className="fal fa-map-marker-alt" /> Ao Nang, Thailand
                  </span>
                  <h5>
                    <Link href="destination-details">
                      The brown bench near swimming pool Hotel
                    </Link>
                  </h5>
                  <ul className="list-style-one">
                    <li>
                      <i className="fal fa-bed-alt" /> 2 Bed room
                    </li>
                    <li>
                      <i className="fal fa-hat-chef" /> 1 kitchen
                    </li>
                    <li>
                      <i className="fal fa-bath" /> 2 Wash room
                    </li>
                    <li>
                      <i className="fal fa-router" /> Internet
                    </li>
                  </ul>
                  <div className="destination-footer">
                    <span className="price">
                      <span>$85.00</span>/per night
                    </span>
                    <a href="#" className="read-more">
                      Book Now <i className="fal fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-6 col-xl-8 col-lg-10">
              <div
                className="destination-item style-three"
                data-aos="fade-up"
                data-aos-delay={50}
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="image">
                  <div className="ratting">
                    <i className="fas fa-star" /> 4.8
                  </div>
                  <a href="#" className="heart">
                    <i className="fas fa-heart" />
                  </a>
                  <img
                    src="assets/images/destinations/hotel2.jpg"
                    alt="Hotel"
                  />
                </div>
                <div className="content">
                  <span className="location">
                    <i className="fal fa-map-marker-alt" /> Kigali, Rwanda
                  </span>
                  <h5>
                    <Link href="destination-details">
                      Green trees and body of water Marriott Hotel
                    </Link>
                  </h5>
                  <ul className="list-style-one">
                    <li>
                      <i className="fal fa-bed-alt" /> 2 Bed room
                    </li>
                    <li>
                      <i className="fal fa-hat-chef" /> 1 kitchen
                    </li>
                    <li>
                      <i className="fal fa-bath" /> 2 Wash room
                    </li>
                    <li>
                      <i className="fal fa-router" /> Internet
                    </li>
                  </ul>
                  <div className="destination-footer">
                    <span className="price">
                      <span>$85.00</span>/per night
                    </span>
                    <a href="#" className="read-more">
                      Book Now <i className="fal fa-angle-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-6 col-xl-8 col-lg-10">
              <div
                className="destination-item style-three"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="content">
                  <span className="location">
                    <i className="fal fa-map-marker-alt" /> Ao Nang, Thailand
                  </span>
                  <h5>
                    <a href="#">Painted house surrounded with trees Hotel</a>
                  </h5>
                  <ul className="list-style-one">
                    <li>
                      <i className="fal fa-bed-alt" /> 2 Bed room
                    </li>
                    <li>
                      <i className="fal fa-hat-chef" /> 1 kitchen
                    </li>
                    <li>
                      <i className="fal fa-bath" /> 2 Wash room
                    </li>
                    <li>
                      <i className="fal fa-router" /> Internet
                    </li>
                  </ul>
                  <div className="destination-footer">
                    <span className="price">
                      <span>$85.00</span>/per night
                    </span>
                    <a href="#" className="read-more">
                      Book Now <i className="fal fa-angle-right" />
                    </a>
                  </div>
                </div>
                <div className="image">
                  <div className="ratting">
                    <i className="fas fa-star" /> 4.8
                  </div>
                  <a href="#" className="heart">
                    <i className="fas fa-heart" />
                  </a>
                  <img
                    src="assets/images/destinations/hotel3.jpg"
                    alt="Hotel"
                  />
                </div>
              </div>
            </div>
            <div className="col-xxl-6 col-xl-8 col-lg-10">
              <div
                className="destination-item style-three"
                data-aos="fade-up"
                data-aos-delay={50}
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="content">
                  <span className="location">
                    <i className="fal fa-map-marker-alt" /> Ao Nang, Thailand
                  </span>
                  <h5>
                    <a href="#">house pool Jungle Pool Indonesia Hotel</a>
                  </h5>
                  <ul className="list-style-one">
                    <li>
                      <i className="fal fa-bed-alt" /> 2 Bed room
                    </li>
                    <li>
                      <i className="fal fa-hat-chef" /> 1 kitchen
                    </li>
                    <li>
                      <i className="fal fa-bath" /> 2 Wash room
                    </li>
                    <li>
                      <i className="fal fa-router" /> Internet
                    </li>
                  </ul>
                  <div className="destination-footer">
                    <span className="price">
                      <span>$85.00</span>/per night
                    </span>
                    <a href="#" className="read-more">
                      Book Now <i className="fal fa-angle-right" />
                    </a>
                  </div>
                </div>
                <div className="image">
                  <div className="ratting">
                    <i className="fas fa-star" /> 4.8
                  </div>
                  <a href="#" className="heart">
                    <i className="fas fa-heart" />
                  </a>
                  <img
                    src="assets/images/destinations/hotel4.jpg"
                    alt="Hotel"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="hotel-more-btn text-center mt-40">
            <Link href="destination2" className="theme-btn style-four">
              <span data-hover="Explore More Hotel">Explore More Hotel</span>
              <i className="fal fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section> */}
        {/* Hotel Area end */}

        {/* Mobile App Area start */}
        {/* <section className="mobile-app-area py-100 rel z-1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div
                className="mobile-app-content rmb-55"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="section-title mb-30">
                  <h2>
                    We Are Available On the Store Get Our Mobile Apps Very
                    Easily
                  </h2>
                </div>
                <p>
                  We go above and beyond to make your travel dreams a reality.
                  Trust us to handle the details so you can creating
                  unforgettable memories. Explore the world with confidence
                </p>
                <ul className="list-style-two mt-35 mb-30">
                  <li>Experience Agency</li>
                  <li>Professional Team</li>
                  <li>Low Cost Travel</li>
                  <li>Online Support 24/7</li>
                </ul>
                <div className="google-play-app-store">
                  <a href="#">
                    <img
                      src="assets/images/mobile-app/g-play.jpg"
                      alt="Google Play"
                    />
                  </a>
                  <a href="#">
                    <img
                      src="assets/images/mobile-app/a-store.jpg"
                      alt="App Store"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="mobile-app-images">
                <div className="bg">
                  <img src="assets/images/mobile-app/phone-bg.png" alt="BG" />
                </div>
                <div className="images">
                  <img
                    src="assets/images/mobile-app/phone2.png"
                    alt="Phone"
                    data-aos="fade-down-left"
                    data-aos-duration={1500}
                    data-aos-offset={50}
                  />
                  <img src="assets/images/mobile-app/phone.png" alt="Phone" />
                  <img
                    src="assets/images/mobile-app/phone3.png"
                    alt="Phone"
                    data-aos="fade-up-right"
                    data-aos-duration={1500}
                    data-aos-offset={50}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
        {/* Mobile App Area end */}
        {/* Testimonials Area start */}
        {/* <section className="testimonials-area rel z-1">
          <div className="container">
            <div className="testimonials-wrap bgc-lighter">
              <div className="row">
                <div
                  className="col-lg-5 rel"
                  data-aos="fade-right"
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div
                    className="testimonial-left-image rmb-55"
                    style={{
                      backgroundImage:
                        "url(assets/images/testimonials/testimonial-left.jpg)",
                    }}
                  />
                </div>
                <div className="col-lg-7">
                  <div
                    className="testimonial-right-content"
                    data-aos="fade-left"
                    data-aos-duration={1500}
                    data-aos-offset={50}
                  >
                    <div className="section-title mb-55">
                      <h2>
                        <span>5280</span> Global Clients Say About Us Services
                      </h2>
                    </div>
                    <Testimonial />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        {/* Testimonials Area end */}
        {/* CTA Area start */}
        {/* <section className="cta-area pt-100 rel z-1">
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-xl-4 col-md-6"
              data-aos="zoom-in-down"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div
                className="cta-item"
                style={{ backgroundImage: "url(assets/images/cta/cta1.jpg)" }}
              >
                <span className="category">Tent Camping</span>
                <h2>Explore the world best tourism</h2>
                <Link
                  href="tour-details"
                  className="theme-btn style-two bgc-secondary"
                >
                  <span data-hover="Explore Tours">Explore Tours</span>
                  <i className="fal fa-arrow-right" />
                </Link>
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6"
              data-aos="zoom-in-down"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div
                className="cta-item"
                style={{ backgroundImage: "url(assets/images/cta/cta2.jpg)" }}
              >
                <span className="category">Sea Beach</span>
                <h2>World largest Sea Beach in Thailand</h2>
                <Link href="tour-details" className="theme-btn style-two">
                  <span data-hover="Explore Tours">Explore Tours</span>
                  <i className="fal fa-arrow-right" />
                </Link>
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6"
              data-aos="zoom-in-down"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div
                className="cta-item"
                style={{ backgroundImage: "url(assets/images/cta/cta3.jpg)" }}
              >
                <span className="category">Water Falls</span>
                <h2>Largest Water falls Bali, Indonesia</h2>
                <Link
                  href="tour-details"
                  className="theme-btn style-two bgc-secondary"
                >
                  <span data-hover="Explore Tours">Explore Tours</span>
                  <i className="fal fa-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section> */}
        {/* CTA Area end */}
        {/* Blog Area start */}
        {/* <section className="blog-area py-70 rel z-1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div
                className="section-title text-center counter-text-wrap mb-70"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <SectionTitle
                  title={"Read Latest News & Blog"}
                  subtitle2="most popular experience you'll remember"
                />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-4 col-md-6">
              <div
                className="blog-item"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="content">
                  <Link href="blog" className="category">
                    Travel
                  </Link>
                  <h5>
                    <Link href="blog-details">
                      Ultimate Guide to Planning Your Dream Vacation with Ravelo
                      Travel Agency
                    </Link>
                  </h5>
                  <ul className="blog-meta">
                    <li>
                      <i className="far fa-calendar-alt" />{" "}
                      <a href="#">25 February 2024</a>
                    </li>
                    <li>
                      <i className="far fa-comments" />{" "}
                      <a href="#">Comments (5)</a>
                    </li>
                  </ul>
                </div>
                <div className="image">
                  <img src="assets/images/blog/blog1.jpg" alt="Blog" />
                </div>
                <Link href="blog-details" className="theme-btn">
                  <span data-hover="Book Now">Read More</span>
                  <i className="fal fa-arrow-right" />
                </Link>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div
                className="blog-item"
                data-aos="fade-up"
                data-aos-delay={50}
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="content">
                  <Link href="blog" className="category">
                    Travel
                  </Link>
                  <h5>
                    <Link href="blog-details">
                      Unforgettable Adventures Travel Agency Bucket List
                      Experiences
                    </Link>
                  </h5>
                  <ul className="blog-meta">
                    <li>
                      <i className="far fa-calendar-alt" />{" "}
                      <a href="#">25 February 2024</a>
                    </li>
                    <li>
                      <i className="far fa-comments" />{" "}
                      <a href="#">Comments (5)</a>
                    </li>
                  </ul>
                </div>
                <div className="image">
                  <img src="assets/images/blog/blog2.jpg" alt="Blog" />
                </div>
                <Link href="blog-details" className="theme-btn">
                  <span data-hover="Book Now">Read More</span>
                  <i className="fal fa-arrow-right" />
                </Link>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div
                className="blog-item"
                data-aos="fade-up"
                data-aos-delay={100}
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="content">
                  <Link href="blog" className="category">
                    Travel
                  </Link>
                  <h5>
                    <Link href="blog-details">
                      Exploring Culture and way Cuisine Travel Agency's they
                      Best Foodie Destinations
                    </Link>
                  </h5>
                  <ul className="blog-meta">
                    <li>
                      <i className="far fa-calendar-alt" />{" "}
                      <a href="#">25 February 2024</a>
                    </li>
                    <li>
                      <i className="far fa-comments" />{" "}
                      <a href="#">Comments (5)</a>
                    </li>
                  </ul>
                </div>
                <div className="image">
                  <img src="assets/images/blog/blog3.jpg" alt="Blog" />
                </div>
                <Link href="blog-details" className="theme-btn">
                  <span data-hover="Book Now">Read More</span>
                  <i className="fal fa-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      </ReveloLayout>
    </div>
  );
};
export default page;
