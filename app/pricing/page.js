import Banner from "@/components/Banner";
import SectionTitle from "@/components/SectionTitle";
import Client from "@/components/slider/Client";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";

const page = () => {
  const pricingPlans = [
    {
      id: 1,
      name: "Basic",
      price: 99,
      features: ["Feature 1", "Feature 2", "Feature 3"],
    },
    {
      id: 2,
      name: "Premium",
      price: 199,
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    },
    {
      id: 3,
      name: "Enterprise",
      price: 299,
      features: ["All Features", "Priority Support", "Custom Solutions"],
    },
  ];

  return (
    <ReveloLayout>
      <Banner pageTitle={"Pricing"} />
      <section className="pricing-area py-100 rel z-1">
        <div className="container">
          <SectionTitle
            title="Our Pricing Plans"
            subtitle="Choose the best plan for you"
          />
          <div className="row">
            {pricingPlans.map((plan) => (
              <div key={plan.id} className="col-lg-4 col-md-6 mb-30">
                <div className="pricing-item">
                  <h3>{plan.name}</h3>
                  <div className="price">
                    <span>${plan.price}</span>/month
                  </div>
                  <ul className="list-style-one">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <Link href="/contact" className="theme-btn bgc-secondary">
                    <span data-hover="Get Started">Get Started</span>
                    <i className="fal fa-arrow-right" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="client-logo-area py-100 rel z-1">
        <div className="container">
          <Client />
        </div>
      </section>
      <Subscribe />
    </ReveloLayout>
  );
};

export default page;

