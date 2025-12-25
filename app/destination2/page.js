import Banner from "@/components/Banner";
import SectionTitle from "@/components/SectionTitle";
import Destination from "@/components/slider/Destination";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import destinations from "../Jsons/destinations2.json";

const page = () => {
  return (
    <ReveloLayout>
      <Banner pageTitle={"Destination 02"} />
      <section className="destinations-area py-100 rel z-1">
        <div className="container">
          <SectionTitle
            title="Popular Destinations"
            subtitle="Discover amazing places"
          />
          <Destination destinations={destinations} />
        </div>
      </section>
      <Subscribe />
    </ReveloLayout>
  );
};

export default page;

