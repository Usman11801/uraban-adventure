import SectionTitle from "@/components/SectionTitle";
import Destination from "@/components/slider/Destination";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import Gallery from "@/components/slider/Gallery";
import destinations from "../Jsons/destinations.json";

const page = () => {
  return (
    <ReveloLayout>
      <section className="page-banner-two rel z-1">
        <div className="container-fluid">
          <hr className="mt-0" />
          <div className="container">
            <div className="banner-inner pt-15 pb-25">
              <h2 className="page-title mb-10">Bali, Indonesia</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center mb-20">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">
                    Destination Details
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>
      <div className="destination-gallery">
        <Gallery
          images={[
            "assets/images/destinations/burj1.jpg",
            "assets/images/destinations/dubai1.jpg",
            "assets/images/destinations/main1.jpg",
          ]}
        />
      </div>
      <section className="destinations-area py-100 rel z-1">
        <div className="container">
          <SectionTitle
            title="Related Destinations"
            subtitle="More places to explore"
          />
          <Destination destinations={destinations.slice(0, 5)} />
        </div>
      </section>
      <Subscribe />
    </ReveloLayout>
  );
};

export default page;

