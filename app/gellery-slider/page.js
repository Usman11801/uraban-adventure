import Banner from "@/components/Banner";
import SectionTitle from "@/components/SectionTitle";
import Gallery from "@/components/slider/Gallery";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";

const page = () => {
  const galleryImages = [
    "assets/images/gallery/gallery-slider1.jpg",
    "assets/images/gallery/gallery-slider2.jpg",
    "assets/images/gallery/gallery-slider3.jpg",
    "assets/images/gallery/gallery-slider4.jpg",
    "assets/images/gallery/gallery-slider5.jpg",
  ];

  return (
    <ReveloLayout>
      <Banner pageTitle={"Gallery Slider"} />
      <section className="gallery-slider-area py-100 rel z-1">
        <div className="container">
          <SectionTitle
            title="Our Gallery"
            subtitle="Beautiful moments captured"
          />
          <Gallery images={galleryImages} />
        </div>
      </section>
      <Subscribe />
    </ReveloLayout>
  );
};

export default page;

