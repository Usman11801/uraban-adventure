"use client";
import Counter from "@/components/Counter";
import SearchFilter from "@/components/SearchFilter";
import SectionTitle from "@/components/SectionTitle";
import Testimonial from "@/components/slider/Testimonial";
import Destination from "@/components/slider/Destination";
import HotDeals from "@/components/slider/HotDeals";
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
            title="Hot Deals"
            subtitle="Special offers for you"
          />
          <HotDeals deals={destinations.slice(0, 6)} />
        </div>
      </section>
      <section className="destinations-area py-100 rel z-1">
        <div className="container">
          <SectionTitle
            title="Popular Destinations"
            subtitle="Explore amazing places"
          />
          <Destination destinations={destinations} />
        </div>
      </section>
    </ReveloLayout>
  );
};

export default page;

