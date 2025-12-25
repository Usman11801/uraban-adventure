import Banner from "@/components/Banner";
import SectionTitle from "@/components/SectionTitle";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";

const page = () => {
  const guides = [
    {
      id: 1,
      name: "John Smith",
      image: "assets/images/team/team1.jpg",
      specialty: "Desert Tours",
      experience: "5+ Years",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      image: "assets/images/team/team2.jpg",
      specialty: "City Tours",
      experience: "3+ Years",
    },
  ];

  return (
    <ReveloLayout>
      <Banner pageTitle={"Tour Guides"} />
      <section className="tour-guide-area py-100 rel z-1">
        <div className="container">
          <SectionTitle
            title="Our Expert Guides"
            subtitle="Meet our professional team"
          />
          <div className="row">
            {guides.map((guide) => (
              <div key={guide.id} className="col-lg-4 col-md-6 mb-30">
                <div className="team-item">
                  <div className="image">
                    <img src={guide.image} alt={guide.name} />
                  </div>
                  <div className="content">
                    <h5>{guide.name}</h5>
                    <span>{guide.specialty}</span>
                    <p>Experience: {guide.experience}</p>
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

