"use client";

import Counter from "@/components/Counter";
import Link from "next/link";
import { useState, useEffect } from "react";

const Footer = ({ footer, insta }) => {
  switch (footer) {
    case 1:
      return <Footer1 />;

    default:
      return <Footer2 insta={insta} />;
  }
};
export default Footer;

const FooterInstagram = () => {
  return (
    <div className="container">
      <div className="footer-instagram pt-100 mb-70">
        <div className="row row-cols-xxl-6 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-2">
          <div
            className="col"
            data-aos="zoom-in-up"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <a
              className="instagram-item"
              href="assets/images/destinations/dubai3.jpg"
            >
              <img
                src="assets/images/destinations/dubai2.jpg"
                alt="Instagram"
              />
            </a>
          </div>
          <div
            className="col"
            data-aos="zoom-in-down"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <a
              className="instagram-item"
              href="assets/images/destinations/burj4.jpg"
            >
              <img
                src="assets/images/destinations/dhabi4.jpg"
                alt="Instagram"
              />
            </a>
          </div>
          <div
            className="col"
            data-aos="zoom-in-up"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <a
              className="instagram-item"
              href="assets/images/destinations/dubai4.jpg"
            >
              <img
                src="assets/images/destinations/dubai4.jpg"
                alt="Instagram"
              />
            </a>
          </div>
          <div
            className="col"
            data-aos="zoom-in-down"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <a
              className="instagram-item"
              href="assets/images/instagram/instagram4.jpg"
            >
              <img
                src="assets/images/destinations/shams1.jpg"
                alt="Instagram"
              />
            </a>
          </div>
          <div
            className="col"
            data-aos="zoom-in-up"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <a
              className="instagram-item"
              href="assets/images/destinations/shams2.jpg"
            >
              <img
                src="assets/images/destinations/shams2.jpg"
                alt="Instagram"
              />
            </a>
          </div>
          <div
            className="col"
            data-aos="zoom-in-down"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <a
              className="instagram-item"
              href="assets/images/destinations/shams3.jpg"
            >
              <img
                src="assets/images/destinations/shams3.jpg"
                alt="Instagram"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer1 = () => {
  return (
    <footer
      className="main-footer bgs-cover overlay rel z-1 pb-25"
      style={{
        backgroundImage: "url(assets/images/backgrounds/footer.jpg)",
      }}
    >
      <div className="container">
        <div className="footer-top pt-100 pb-30">
          <div className="row justify-content-between">
            <div
              className="col-xl-5 col-lg-6"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-text">
                <div className="footer-logo mb-25">
                  <Link href="/">
                    <img src="/logo.png" alt="Logo" />
                  </Link>
                </div>
                <p>
                  We curate bespoke itineraries tailored to your preferences,
                  ensuring every trip is seamless and enriching hidden gems
                  beaten
                </p>
                <div className="social-style-one mt-15">
                  <a
                    href="https://www.facebook.com/share/18yWbgkJyJ/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a
                    href="https://youtube.com/@urbanadventuretourism?si=tANsOX-CpYdUZXnw"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-youtube" />
                  </a>
                  <a
                    href="https://www.instagram.com/urbanadventuretourism/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                  <a
                    href="https://www.instagram.com/urbanadventuretourism/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-twitter" />
                  </a>
                </div>
              </div>
            </div>
            <div
              className="col-xl-5 col-lg-6"
              data-aos="fade-up"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              {/* <div className="section-title counter-text-wrap mb-35">
                <h2>Subscribe Newsletter</h2>
                <p>
                  One site{" "}
                  <span className="count-text plus">
                    <Counter end={34500} />
                  </span>{" "}
                  most popular experience you’ll remember
                </p>
              </div> */}
              {/* <form className="newsletter-form mb-50" action="#">
                <input
                  id="news-email"
                  type="email"
                  placeholder="Email Address"
                  required=""
                />
                <button
                  type="submit"
                  className="theme-btn bgc-secondary style-two"
                >
                  <span data-hover="Subscribe">Subscribe</span>
                  <i className="fal fa-arrow-right" />
                </button>
              </form> */}
            </div>
          </div>
        </div>
      </div>
      <div className="widget-area pt-95 pb-45">
        <div className="container">
          <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-2">
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links">
                <div className="footer-title">
                  <h5>Top Destinations</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link
                      href={{
                        pathname: "/top-tour-details",
                        query: { id: 1 },
                      }}
                    >
                      Morning Safari Desert
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={{
                        pathname: "/top-tour-details",
                        query: { id: 2 },
                      }}
                    >
                      Abu Dhabi City Tour
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={{
                        pathname: "/top-tour-details",
                        query: { id: 3 },
                      }}
                    >
                      Evening Desert Safari
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links">
                <div className="footer-title">
                  <h5>Company</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link href="about">About Company</Link>
                  </li>

                  <li>
                    <Link href="contact">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
            <FooterDestinations />
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-delay={150}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links">
                <div className="footer-title">
                  <h5>Desert Activities</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link href="tour-list">Sunrise View Safari</Link>
                  </li>
                  <li>
                    <Link href="tour-list">Red Dune Desert Safari</Link>
                  </li>
                  <li>
                    <Link href="tour-list">Bab Al Shams Dinner</Link>
                  </li>
                  <li>
                    <Link href="tour-list">Desert Safari with Quad Bike</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="col col-md-6 col-10 col-small"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-contact">
                <div className="footer-title">
                  <h5>Get In Touch</h5>
                </div>
                <ul className="list-style-one">
                  <li>
                    <i className="fal fa-map-marked-alt" /> Al zahraa techno
                    center al rafa office 101 Dubai UAE
                  </li>
                  <li>
                    <i className="fal fa-envelope" />{" "}
                    <a
                      href="mailto:urbanadventuretourism@gmail.com
"
                    >
                      urbanadventuretourism@gmail.com
                    </a>
                  </li>
                  <li>
                    <i className="fal fa-clock" /> Mon - Fri, 08am - 05pm
                  </li>
                  <li>
                    <i className="fal fa-phone-volume" />{" "}
                    <a href="callto:+971528067631">+971528067631</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom pt-20 pb-5">
        <div className="container">
          {/* <div className="row">
            <div className="col-lg-5">
              <div className="copyright-text text-center text-lg-start">
                <p>
                  @Linkopy 202/4 <a href="">Ravelo</a>, All rights reserved
                </p>
              </div>
            </div>
            <div className="col-lg-7 text-center text-lg-end">
              <ul className="footer-bottom-nav">
                <li>
                  <Link href="about">Terms</Link>
                </li>
                <li>
                  <Link href="about">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="about">Legal notice</Link>
                </li>
                <li>
                  <Link href="about">Accessibility</Link>
                </li>
              </ul>
            </div>
          </div> */}
          {/* Scroll Top Button */}
          <button className="scroll-top scroll-to-target" data-target="html">
            <img src="assets/images/icons/scroll-up.png" alt="Scroll  Up" />
          </button>
        </div>
      </div>
    </footer>
  );
};

const FooterDestinations = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");
        const data = await response.json();
        const activeCategories = (data.categories || []).filter(
          (cat) => cat.is_active
        );
        setCategories(activeCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Split categories into 3 rows
  const itemsPerRow = Math.ceil(categories.length / 3);
  const row1 = categories.slice(0, itemsPerRow);
  const row2 = categories.slice(itemsPerRow, itemsPerRow * 2);
  const row3 = categories.slice(itemsPerRow * 2);

  return (
    <div
      className="col"
      style={{ flex: "0 0 auto", minWidth: "300px", maxWidth: "400px" }}
      data-aos="fade-up"
      data-aos-delay={150}
      data-aos-duration={1500}
      data-aos-offset={50}
    >
      <div className="footer-widget footer-links">
        <div className="footer-title">
          <h5>Destinations</h5>
        </div>
        {loading ? (
          <ul className="list-style-three">
            <li>Loading...</li>
          </ul>
        ) : categories.length === 0 ? (
          <ul className="list-style-three">
            <li>No categories available</li>
          </ul>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {/* Row 1 */}
            <ul
              className="list-style-three"
              style={{ margin: 0, padding: 0, listStyle: "none" }}
            >
              {row1.map((category) => {
                const link = category.slug
                  ? category.slug.endsWith("-list")
                    ? `/category/${category.slug}`
                    : `/category/${category.slug}-list`
                  : "#";
                return (
                  <li key={category.id} style={{ marginBottom: "5px" }}>
                    <Link href={link}>{category.name}</Link>
                  </li>
                );
              })}
            </ul>
            {/* Row 2 */}
            {row2.length > 0 && (
              <ul
                className="list-style-three"
                style={{ margin: 0, padding: 0, listStyle: "none" }}
              >
                {row2.map((category) => {
                  const link = category.slug
                    ? category.slug.endsWith("-list")
                      ? `/category/${category.slug}`
                      : `/category/${category.slug}-list`
                    : "#";
                  return (
                    <li key={category.id} style={{ marginBottom: "5px" }}>
                      <Link href={link}>{category.name}</Link>
                    </li>
                  );
                })}
              </ul>
            )}
            {/* Row 3 */}
            {row3.length > 0 && (
              <ul
                className="list-style-three"
                style={{ margin: 0, padding: 0, listStyle: "none" }}
              >
                {row3.map((category) => {
                  const link = category.slug
                    ? category.slug.endsWith("-list")
                      ? `/category/${category.slug}`
                      : `/category/${category.slug}-list`
                    : "#";
                  return (
                    <li key={category.id} style={{ marginBottom: "5px" }}>
                      <Link href={link}>{category.name}</Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Footer2 = ({ insta }) => {
  return (
    <footer
      className={`main-footer footer-two bgp-bottom bgc-black rel z-15 ${
        insta ? "" : "pt-100 pb-115"
      }`}
      style={{
        backgroundImage: "url(assets/images/backgrounds/footer-two.png)",
      }}
    >
      {insta && <FooterInstagram />}
      <div className="widget-area">
        <div className="container">
          <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-md-3 row-cols-2">
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-text">
                <div className="footer-logo mb-40">
                  <Link href="/">
                    <img src="/logo.png" alt="Logo" />
                  </Link>
                </div>
                {/* <div className="footer-map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d28917.758162586367!2d55.270783!3d25.204849!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1706508986625!5m2!1sen!2sbd"
                    style={{ border: 0, width: "100%" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div> */}
              </div>
            </div>
            {/* <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links ms-sm-5">
                <div className="footer-title">
                  <h5>Services</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link href="/about">About Services</Link>
                  </li>
                  <li>
                    <Link href="destination-details">Tour Booking</Link>
                  </li>
                  <li>
                    <Link href="destination-details">Hotel Booking</Link>
                  </li>
                  <li>
                    <Link href="destination-details">Ticket Booking</Link>
                  </li>
                </ul>
              </div>
            </div> */}
            <div
              className="col col-small"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-links ms-md-4">
                <div className="footer-title">
                  <h5>Company</h5>
                </div>
                <ul className="list-style-three">
                  <li>
                    <Link href="about">About Company</Link>
                  </li>
                  {/* <li>
                    <Link href="blog">Community Blog</Link>
                  </li>
                  <li>
                    <Link href="contact">Jobs and Careers</Link>
                  </li>
                  <li>
                    <Link href="blog">latest News Blog</Link>
                  </li> */}
                </ul>
              </div>
            </div>
            <FooterDestinations />
            <div
              className="col col-md-6 col-10 col-small"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="footer-widget footer-contact">
                <div className="footer-title">
                  <h5>Get In Touch</h5>
                </div>
                <ul className="list-style-one">
                  <li>
                    <i className="fal fa-map-marked-alt" /> Al zahraa techno
                    center al rafa office 101 Dubai UAE
                  </li>
                  <li>
                    <i className="fal fa-envelope" />{" "}
                    <a href="mailto:urbanadventuretourism@gmail.com">
                      urbanadventuretourism@gmail.com
                    </a>
                  </li>
                  <li>
                    <i className="fal fa-phone-volume" />{" "}
                    <a href="callto:+971528067631">+971528067631</a>
                  </li>
                </ul>
                <div className="social-style-one mt-20">
                  <a
                    href="https://www.facebook.com/share/18yWbgkJyJ/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a
                    href="https://youtube.com/@urbanadventuretourism?si=tANsOX-CpYdUZXnw"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-youtube" />
                  </a>
                  <a
                    href="https://www.instagram.com/urbanadventuretourism/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                  <a
                    href="https://www.instagram.com/urbanadventuretourism/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-twitter" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="footer-bottom bg-transparent pt-20 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="copyright-text text-center text-lg-start">
                <p>
                  @Linkopy 202/4 <a href="">Ravelo</a>, All rights reserved
                </p>
              </div>
            </div>
            <div className="col-lg-7 text-center text-lg-end">
              <ul className="footer-bottom-nav">
                <li>
                  <Link href="about">Terms</Link>
                </li>
                <li>
                  <Link href="about">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="about">Legal notice</Link>
                </li>
                <li>
                  <Link href="about">Accessibility</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div> */}
    </footer>
  );
};
