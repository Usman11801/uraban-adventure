import Banner from "@/components/Banner";
import SectionTitle from "@/components/SectionTitle";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import toursData from "../tour-list/toursData.json";

const page = () => {
  return (
    <ReveloLayout>
      <Banner pageTitle={"Tour Grid"} />
      <section className="tour-grid-area py-100 rel z-1">
        <div className="container">
          <SectionTitle
            title="All Tours"
            subtitle="Explore our tour packages"
          />
          <div className="row">
            {toursData.tours.map((tour) => (
              <div key={tour.id} className="col-lg-4 col-md-6 mb-30">
                <div className="destination-item style-three">
                  <div className="image">
                    <img src={tour.image} alt={tour.title} />
                  </div>
                  <div className="content">
                    <h5>
                      <Link href={`/tour-details?id=${tour.id}`}>
                        {tour.title}
                      </Link>
                    </h5>
                    <p>{tour.description}</p>
                    <div className="price">
                      <span>AED {tour.price}</span>/person
                    </div>
                  </div>
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

