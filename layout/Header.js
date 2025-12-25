"use client";
import useClickOutside from "@/utility/useClickOutside";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useCart } from "@/context/CartContext";

const Menu = () => {
  return (
    <nav className="main-menu navbar-expand-lg">
      <Accordion>
        <div className="navbar-header">
          <div className="mobile-logo">
            <Link href="/">
              <img
                src="/logo.png"
                alt="Logo"
                title="Logo"
                width={300}
                height={100}
                style={{ objectFit: "contain" }}
              />
            </Link>
          </div>
          {/* Toggle Button */}
          <Accordion.Toggle
            as={"button"}
            type="button"
            className="navbar-toggle"
            eventKey="collapse"
          >
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </Accordion.Toggle>
        </div>
        <Accordion.Collapse
          eventKey="collapse"
          className="navbar-collapse  clearfix"
        >
          <ul className="navigation clearfix">
            {/* <li className="dropdown current">
              <a href="#">Home</a>
              <ul>
                <li>
                  <Link href="/">Travel Agency</Link>
                </li>
                <li>
                  <Link href="index2">City Tou</Link>
                </li>
                <li>
                  <Link href="index3">Tour Package</Link>
                </li>
              </ul>
              <div className="dropdown-btn">
                <span className="far fa-angle-down" />
              </div>
            </li> */}
            <li>
              <Link href="/">Home</Link>
            </li>
            <li className="dropdown">
              <a href="#">Tours & destinations</a>
              <ul>
                <li>
                  <Link href="tour-list">Desert Safari</Link>
                </li>
                <li>
                  <Link href="sight-see-list">City Tour</Link>
                </li>
                <li>
                  <Link href="desert-resort-list">Desert Resort</Link>
                </li>
                <li>
                  <Link href="theme-park-list">Theme Park</Link>
                </li>
                <li>
                  <Link href="buggy-bike-list">Buggy & Quad Bikes</Link>
                </li>
                <li>
                  <Link href="private-tour-list">Private Tour</Link>
                </li>
                <li>
                  <Link href="executive-tour-list">Executive</Link>
                </li>
                <li>
                  <Link href="combo-deal-list">Combo Deals</Link>
                </li>
                <li>
                  <Link href="water-park-list">Water Parks</Link>
                </li>
                <li>
                  <Link href="sky-tour-list">Sky Tours</Link>
                </li>
                <li>
                  <Link href="sea-advantucher-list">Sea Advantucher</Link>
                </li>
                <li>
                  <Link href="dhow-cruise-list">Dhow Cruise</Link>
                </li>
                <li></li>
              </ul>
              <div className="dropdown-btn">
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li>
              <Link href="faqs">FAQ</Link>
            </li>
            <li>
              <Link href="about">About</Link>
            </li>
            <li>
              <Link href="contact">Contact us</Link>
            </li>
            {/* <li className="dropdown">
              <a href="#">Destinations</a>
              <ul>
                <li>
                  <Link href="destination1">Destination 01</Link>
                </li>
                <li>
                  <Link href="destination2">Destination 02</Link>
                </li>
                <li>
                  <Link href="destination-details">Destination Details</Link>
                </li>
              </ul>
              <div className="dropdown-btn">
                <span className="far fa-angle-down" />
              </div>
            </li> */}

            {/* <li className="dropdown">
              <a href="#">Pages</a>
              <ul>
                <li>
                  <Link href="pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="faqs">faqs</Link>
                </li>
                <li className="dropdown">
                  <a href="#">Gallery</a>
                  <ul>
                    <li>
                      <Link href="gellery-grid">Gallery Grid</Link>
                    </li>
                    <li>
                      <Link href="gellery-slider">Gallery Slider</Link>
                    </li>
                  </ul>
                  <div className="dropdown-btn">
                    <span className="far fa-angle-down" />
                  </div>
                </li>
                <li className="dropdown">
                  <a href="#">products</a>
                  <ul>
                    <li>
                      <Link href="shop">Our Products</Link>
                    </li>
                    <li>
                      <Link href="product-details">Product Details</Link>
                    </li>
                  </ul>
                  <div className="dropdown-btn">
                    <span className="far fa-angle-down" />
                  </div>
                </li>
                <li>
                  <Link href="contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="404">404 Error</Link>
                </li>
              </ul>
              <div className="dropdown-btn">
                <span className="far fa-angle-down" />
              </div>
            </li> */}
            {/* <li className="dropdown">
              <a href="#">blog</a>
              <ul>
                <li>
                  <Link href="blog">blog List</Link>
                </li>
                <li>
                  <Link href="blog-details">blog details</Link>
                </li>
              </ul>
              <div className="dropdown-btn">
                <span className="far fa-angle-down" />
              </div>
            </li> */}
          </ul>
        </Accordion.Collapse>
      </Accordion>
    </nav>
  );
};

const Header = ({ header }) => {
  const sidebarClick = () =>
    document.querySelector("body").classList.toggle("side-content-visible");

  switch (header) {
    case 1:
      return <Header1 sidebarClick={sidebarClick} />;
    case 2:
      return <Header2 sidebarClick={sidebarClick} />;

    default:
      return <Header3 sidebarClick={sidebarClick} />;
  }
};
export default Header;

const Header1 = ({ sidebarClick }) => {
  return (
    <Fragment>
      <style jsx>{`
        .logo img {
          max-height: 70px;
          width: auto;
          object-fit: contain;
        }

        .logo-outer {
          display: flex;
          align-items: center;
        }

        .mobile-logo img {
          max-height: 60px;
          width: auto;
          object-fit: contain;
        }

        /* Hide main header logo on mobile devices */
        @media (max-width: 991px) {
          .logo-outer {
            display: none !important;
          }
        }
      `}</style>
      <header className="main-header header-one white-menu menu-absolute fixed-header">
        {/*Header-Upper*/}
        <div className="header-upper py-30 rpy-0">
          <div className="container-fluid clearfix">
            <div className="header-inner rel d-flex align-items-center">
              <div className="logo-outer">
                <div className="logo">
                  <Link href="/">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      title="Logo"
                      width={250}
                      height={70}
                      style={{ objectFit: "contain" }}
                    />
                  </Link>
                </div>
              </div>
              <div className="nav-outer mx-lg-auto ps-xxl-5 clearfix">
                {/* Main Menu */}
                <Menu />
                {/* Main Menu End*/}
              </div>
              {/* Nav Search */}
              {/* Search bar removed */}
              {/* Menu Button */}
              <div className="menu-btns py-10 d-flex align-items-center gap-3">
                <CartIcon />
                <Link
                  href="tour-list"
                  className="theme-btn style-two bgc-secondary"
                >
                  <span data-hover="Book Now">Book Now</span>
                  <i className="fal fa-arrow-right" />
                </Link>
                {/* menu sidebar removed */}
              </div>
            </div>
          </div>
        </div>
        {/*End Header Upper*/}
      </header>
      <Sidebar sidebarClick={sidebarClick} />
    </Fragment>
  );
};
const Header2 = ({ sidebarClick }) => {
  const [activeMenu, setActiveMenu] = useState("");
  const [multiMenu, setMultiMenu] = useState("");
  const activeMenuSet = (value) =>
      setActiveMenu(activeMenu === value ? "" : value),
    activeLi = (value) =>
      value === activeMenu ? { display: "block" } : { display: "none" };
  const multiMenuSet = (value) =>
      setMultiMenu(multiMenu === value ? "" : value),
    multiMenuActiveLi = (value) =>
      value === multiMenu ? { display: "block" } : { display: "none" };

  return (
    <Fragment>
      <style jsx>{`
        .logo img {
          max-height: 70px;
          width: auto;
          object-fit: contain;
        }

        .logo-outer {
          display: flex;
          align-items: center;
        }

        .mobile-logo img {
          max-height: 60px;
          width: auto;
          object-fit: contain;
        }

        /* Hide main header logo on mobile devices */
        @media (max-width: 991px) {
          .logo-outer {
            display: none !important;
          }
        }
      `}</style>
      <header className="main-header header-two">
        {/*Header-Upper*/}
        <div className="header-upper">
          <div className="container-fluid clearfix">
            <div className="header-inner rel d-flex align-items-center justify-content-between">
              <div className="logo-outer d-block">
                <div className="logo">
                  <Link href="/">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      title="Logo"
                      width={250}
                      height={70}
                      style={{ objectFit: "contain" }}
                    />
                  </Link>
                </div>
              </div>
              {/* Menu Button */}
              <div className="menu-btns py-10">
                {/* menu sidebar removed */}
              </div>
            </div>
          </div>
        </div>
        {/*End Header Upper*/}
      </header>
      <section className="hidden-bar">
        <div className="inner-box">
          <div className="cross-icon" onClick={() => sidebarClick()}>
            <span className="fal fa-times" />
          </div>
          <div className="logo text-lg-center">
            <Link href="/">
              <img src="/logo.png" alt="Logo" width={220} height={20} />
            </Link>
          </div>
          <hr className="my-40" />
          <ul className="sidebar-menu">
            <li className="dropdown current">
              <a href="#" onClick={() => activeMenuSet("home")}>
                Home
              </a>
              <ul style={activeLi("home")}>
                <li>
                  <Link href="/">Travel Agency</Link>
                </li>
                <li>
                  <Link href="index2">City Tou</Link>
                </li>
                <li>
                  <Link href="index3">Tour Package</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("home")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li>
              <Link href="about">About</Link>
            </li>
            <li className="dropdown">
              <a href="#" onClick={() => activeMenuSet("Tours")}>
                Tours
              </a>
              <ul style={activeLi("Tours")}>
                <li>
                  <Link href="tour-list">Tour List</Link>
                </li>
                <li>
                  <Link href="tour-grid">Tour Grid</Link>
                </li>
                <li>
                  <Link href="tour-sidebar">Tour Sidebar</Link>
                </li>
                <li>
                  <Link href="tour-details">Tour Details</Link>
                </li>
                <li>
                  <Link href="tour-guide">Tour Guide</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("Tours")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li className="dropdown">
              <a href="#" onClick={() => activeMenuSet("Destinations")}>
                Destinations
              </a>
              <ul style={activeLi("Destinations")}>
                <li>
                  <Link href="destination1">Destination 01</Link>
                </li>
                <li>
                  <Link href="destination2">Destination 02</Link>
                </li>
                <li>
                  <Link href="destination-details">Destination Details</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("Destinations")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li className="dropdown">
              <a href="#" onClick={() => activeMenuSet("Pages")}>
                Pages
              </a>
              <ul style={activeLi("Pages")}>
                <li>
                  <Link href="pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="faqs">faqs</Link>
                </li>
                <li className="dropdown">
                  <a href="#">Gallery</a>
                  <ul style={multiMenuActiveLi("Gallery")}>
                    <li>
                      <Link href="gellery-grid">Gallery Grid</Link>
                    </li>
                    <li>
                      <Link href="gellery-slider">Gallery Slider</Link>
                    </li>
                  </ul>
                  <div
                    className="dropdown-btn"
                    onClick={() => multiMenuSet("Gallery")}
                  >
                    <span className="far fa-angle-down" />
                  </div>
                </li>
                <li className="dropdown">
                  <a href="#">products</a>
                  <ul style={multiMenuActiveLi("products")}>
                    <li>
                      <Link href="shop">Our Products</Link>
                    </li>
                    <li>
                      <Link href="product-details">Product Details</Link>
                    </li>
                  </ul>
                  <div
                    className="dropdown-btn"
                    onClick={() => multiMenuSet("products")}
                  >
                    <span className="far fa-angle-down" />
                  </div>
                </li>
                <li>
                  <Link href="contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="404">404 Error</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("Pages")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
            <li className="dropdown">
              <a href="#" onClick={() => activeMenuSet("blog")}>
                blog
              </a>
              <ul style={activeLi("blog")}>
                <li>
                  <Link href="blog">blog List</Link>
                </li>
                <li>
                  <Link href="blog-details">blog details</Link>
                </li>
              </ul>
              <div
                className="dropdown-btn"
                onClick={() => activeMenuSet("blog")}
              >
                <span className="far fa-angle-down" />
              </div>
            </li>
          </ul>
          <Link
            href="contact"
            className="theme-btn style-two style-three mt-15 mb-55"
          >
            <span data-hover="Book Now">Book Now</span>
            <i className="fal fa-arrow-right" />
          </Link>
          <hr className="mb-65" />
          <h6>Social Media</h6>
          {/*Social Icons*/}
          <div className="social-style-two mt-10">
            <a
              href="https://www.instagram.com/urbanadventuretourism/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter" />
            </a>
            <a
              href="https://www.facebook.com/share/18yWbgkJyJ/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f" />
            </a>
            <a
              href="https://www.instagram.com/urbanadventuretourism/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram" />
            </a>
            <a
              href="https://youtube.com/@urbanadventuretourism?si=tANsOX-CpYdUZXnw"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-youtube" />
            </a>
          </div>
        </div>
      </section>

      <div className="form-back-drop" onClick={() => sidebarClick()} />
    </Fragment>
  );
};

const Header3 = ({ sidebarClick }) => {
  return (
    <Fragment>
      <style jsx>{`
        .logo img {
          max-height: 70px;
          width: auto;
          object-fit: contain;
        }

        .logo-outer {
          display: flex;
          align-items: center;
        }

        .mobile-logo img {
          max-height: 60px;
          width: auto;
          object-fit: contain;
        }

        /* Hide main header logo on mobile devices */
        @media (max-width: 991px) {
          .logo-outer {
            display: none !important;
          }
        }
      `}</style>
      <header className="main-header header-one">
        {/*Header-Upper*/}
        <div className="header-upper bg-white py-30 rpy-0">
          <div className="container-fluid clearfix">
            <div className="header-inner rel d-flex align-items-center">
              <div className="logo-outer">
                <div className="logo">
                  <Link href="/">
                    <img
                      src="/logo.png"
                      width={250}
                      height={70}
                      style={{ objectFit: "contain" }}
                      alt="Logo"
                      title="Logo"
                    />
                  </Link>
                </div>
              </div>
              <div className="nav-outer mx-lg-auto ps-xxl-5 clearfix">
                {/* Main Menu */}
                <Menu />
                {/* Main Menu End*/}
              </div>
              {/* Menu Button */}
              <div className="menu-btns py-10 d-flex align-items-center gap-3">
                <CartIcon />
                <Link
                  href="tour-list"
                  className="theme-btn style-two bgc-secondary"
                >
                  <span data-hover="Book Now">Book Now</span>
                  <i className="fal fa-arrow-right" />
                </Link>
                {/* menu sidebar removed */}
              </div>
            </div>
          </div>
        </div>
        {/*End Header Upper*/}
      </header>
      <Sidebar sidebarClick={sidebarClick} />
    </Fragment>
  );
};

// Cart Icon Component
const CartIcon = () => {
  const { cartItems } = useCart();
  const itemCount = cartItems.length;

  return (
    <>
      <style jsx>{`
        .cart-icon-wrapper {
          position: relative;
          display: inline-block;
        }
        .cart-icon-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          background: var(--lighter-color);
          border-radius: 50%;
          color: var(--heading-color);
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }
        .cart-icon-link:hover {
          background: var(--secondary-color);
          color: #fff;
          transform: translateY(-2px);
        }
        .cart-icon-link i {
          font-size: 20px;
        }
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--secondary-color);
          color: #fff;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          border: 2px solid #fff;
        }
        .cart-badge.hidden {
          display: none;
        }
      `}</style>
      <div className="cart-icon-wrapper">
        <Link href="/cart" className="cart-icon-link">
          <i className="fal fa-shopping-cart" />
          {itemCount > 0 && (
            <span className="cart-badge">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </Link>
      </div>
    </>
  );
};

const Sidebar = ({ sidebarClick }) => {
  return (
    <Fragment>
      {/*Form Back Drop*/}
      <div className="form-back-drop" onClick={() => sidebarClick()} />
      {/* Hidden Sidebar */}
      <section className="hidden-bar">
        <div className="inner-box text-center">
          <div className="cross-icon" onClick={() => sidebarClick()}>
            <span className="fa fa-times" />
          </div>
          {/*Social Icons*/}
          <div className="social-style-one">
            <a
              href="https://www.instagram.com/urbanadventuretourism/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter" />
            </a>
            <a
              href="https://www.facebook.com/share/18yWbgkJyJ/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f" />
            </a>
            <a
              href="https://www.instagram.com/urbanadventuretourism/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram" />
            </a>
            <a
              href="https://youtube.com/@urbanadventuretourism?si=tANsOX-CpYdUZXnw"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-youtube" />
            </a>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
