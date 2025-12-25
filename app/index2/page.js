"use client";
import Counter from "@/components/Counter";
import SearchFilter from "@/components/SearchFilter";
import SectionTitle from "@/components/SectionTitle";
import Testimonial from "@/components/slider/Testimonial";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import destinations from "../Jsons/destinations.json";
import Gallery from "@/components/slider/Gallery";

const page = () => {
  return (
    <ReveloLayout header={1}>
      <section className="hero-area bgc-black rel z-2">
        <div className="container-fluid">
          <Gallery
            images={[
              "assets/images/destinations/burj1.jpg",
              "assets/images/destinations/dubai1.jpg",
              "assets/images/destinations/main1.jpg",
            ]}
          />
        </div>
        <SearchFilter />
      </section>
      <section className="destinations-area py-100 rel z-1">
        <div className="container">
          <SectionTitle
            title="Popular Destinations"
            subtitle="Discover amazing places"
          />
          <div className="row">
            {destinations.slice(0, 6).map((destination) => (
              <div key={destination.id} className="col-lg-4 col-md-6">
                <div className="destination-item style-three">
                  <div className="image">
                    <img src={destination.image} alt={destination.title} />
                  </div>
                  <div className="content">
                    <h5>
                      <Link href={destination.link || "#"}>
                        {destination.title}
                      </Link>
                    </h5>
                    <p>{destination.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ReveloLayout>
  );
};

export default page;

