import Banner from "@/components/Banner";
import SectionTitle from "@/components/SectionTitle";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";

const page = () => {
  const galleryImages = [
    "assets/images/gallery/gallery1.jpg",
    "assets/images/gallery/gallery2.jpg",
    "assets/images/gallery/gallery3.jpg",
    "assets/images/gallery/gallery4.jpg",
    "assets/images/gallery/gallery5.jpg",
    "assets/images/gallery/gallery6.jpg",
  ];

  return (
    <ReveloLayout>
      <Banner pageTitle={"Gallery Grid"} />
      <section className="gallery-grid-area py-100 rel z-1">
        <div className="container">
          <SectionTitle
            title="Our Gallery"
            subtitle="Beautiful moments captured"
          />
          <div className="row">
            {galleryImages.map((image, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-30">
                <div className="gallery-item">
                  <img src={image} alt={`Gallery ${index + 1}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Subscribe />
    </ReveloLayout>
  );
};

export default page;

