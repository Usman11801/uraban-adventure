"use client";
import Banner from "@/components/Banner";
import RaveloAccordion from "@/components/RaveloAccordion";
import SectionTitle from "@/components/SectionTitle";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useState } from "react";
import { Accordion } from "react-bootstrap";
const page = () => {
  const faqItem = [
    {
      id: 1,
      title: "1. Do I get picked from hotel when I book a Desert Safari Tour?",
      answer: "Yes we shall pick you from your hotel / residence for Dubai Desert Safari. And there is no additional charges for Pick it's included in the Price ."
    },
    {
      id: 2,
      title: "2. How long is the Desert Safari?",
      answer: "Dubai Desert Safari is 6 hours tour in Evening. 4 Hours tour is you go for Morning Desert Safari. And if you go for Over Night Desert Safari it will be around 16 Hours Tour."
    },
    {
      id: 3,
      title: "3. How long is Quad Biking?",
      answer: "Quad biking will be for 20 to 30 minutes."
    },
    {
      id: 4,
      title: "4. Can Kids Drive Quad Bikes?",
      answer: "Yes we have special quad bikes which are designed for the young kids."
    },
    {
      id: 5,
      title: "5. Is there Veg Food Also?",
      answer: "Yes, vegetarian food options are available as part of the safari."
    },
    {
      id: 6,
      title: "6. What is the maximum number of people who can go to Desert Safari?",
      answer: "There is no limit to that as we have many cars and can arrange many more if needed. Also no matter how many people are there in the safari only 6 people get in to a 4x4 ( including the driver ) so the size of the group does not effect the quality of the tour."
    },
  ];
  const [active, setActive] = useState("collapse0");
  return (
    <ReveloLayout>
      <Banner pageTitle={"FAQs"} />
      {/* FAQ Page About Area start */}
      <section className="faq-page-about pt-100 rel z-1">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-lg-6">
              <div
                className="faq-page-about-content mb-30 rmb-55"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <div className="section-title mb-30">
                  <h2>
                    Destination Dreams The Insider’s Guide to Exceptional Travel
                    Experiences with Urban advanture Tourism
                  </h2>
                </div>
                <p>
                  Urban advanture Tourism play a crucial role in enriching lives by
                  offering unique experiences, cultural exchanges, and the joy
                  of exploration.
                </p>
                <ul className="list-style-two mt-35 mb-20">
                  <li>Experience Agency</li>
                  <li>Professional Team</li>
                  <li>Low Cost Travel</li>
                  <li>Online Support 24/7</li>
                </ul>
                <Link href="contact" className="theme-btn style-two">
                  <span data-hover="Book Now">Book Now</span>
                  <i className="fal fa-arrow-right" />
                </Link>
              </div>
            </div>
            <div
              className="col-lg-6"
              data-aos="fade-right"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="row">
                <div className="col-sm-6">
                  <div className="image mb-30">
                    <img
                      className="br-10 w-100"
                      src="assets/images/destinations/dubai5.jpg"
                      alt="FAQ"
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="image mb-30">
                    <img
                      className="br-10 w-100"
                      src="assets/images/destinations/dhabi2.jpg"
                      alt="FAQ"
                    />
                  </div>
                  <div className="image mb-30">
                    <img
                      className="br-10 w-100"
                      src="assets/images/destinations/dhabi3.jpg"
                      alt="FAQ"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Page About Area end */}
      {/* FAQs Area start */}
      <section className="faq-page-area pt-70 pb-85 rel z-1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div
                className="section-title text-center counter-text-wrap mb-50"
                data-aos="fade-up"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                <SectionTitle title={"Frequently Asked Questions"} />
              </div>
              <Accordion className="accordion-one" defaultActiveKey={active}>
  {faqItem.map((data, i) => (
    <RaveloAccordion
      title={data.title}
      key={data.id}
      event={`collapse${i}`}
      onClick={() =>
        setActive(active == `collapse${i}` ? "" : `collapse${i}`)
      }
      active={active}
      answer={data.answer}
    />
  ))}
</Accordion>
            </div>
          </div>
        </div>
      </section>
      {/* FAQs Area end */}
      {/* Features Area start */}
      <section className="faq-page-featuers pb-70 rel z-1">
        <div className="container">
          <div className="row justify-content-center">
            <div
              className="col-xxl-3 col-xl-4 col-md-6"
              data-aos="flip-left"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="feature-item style-three">
                <div className="icon">
                  <i className="flaticon-route" />
                </div>
                <div className="content">
                  <h6>
                    <Link href="tour-list">Safari Destinations</Link>
                  </h6>
                  <p>
                    Adventure seekers can embark thrilling journeys.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-xxl-3 col-xl-4 col-md-6"
              data-aos="flip-left"
              data-aos-delay={50}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="feature-item style-three bgc-secondary">
                <div className="icon">
                  <i className="flaticon-best-price" />
                </div>
                <div className="content">
                  <h6>
                    <Link href="sight-see-list">In City Destinations</Link>
                  </h6>
                  <p>
                    Adventure seekers can embark thrilling journeys
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-xxl-3 col-xl-4 col-md-6"
              data-aos="flip-left"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="feature-item style-three bgc-primary">
                <div className="icon">
                  <i className="flaticon-travel-1" />
                </div>
                <div className="content">
                  <h6>
                    <Link href="desert-resort-list">Desert resort Destinations</Link>
                  </h6>
                  <p>
                    Adventure seekers can embark thrilling journeys.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-xxl-3 col-xl-4 col-md-6"
              data-aos="flip-left"
              data-aos-delay={150}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="feature-item style-three bgc-pink">
                <div className="icon">
                  <i className="flaticon-guidepost" />
                </div>
                <div className="content">
                  <h6>
                    <Link href="theme-park-list">Theme park destinations</Link>
                  </h6>
                  <p>
                    Adventure seekers can embark thrilling journeys through the
                    Amazon Rainforest or scale
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Area end */}
      {/* Newsletter Area start */}
      {/* <Subscribe /> */}
      {/* Newsletter Area end */}
    </ReveloLayout>
  );
};
export default page;
