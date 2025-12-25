"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ReveloLayout from "@/layout/ReveloLayout";

export default function ThankYou() {
  const [searchParams, setSearchParams] = useState({});
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const mock = params.get("mock") === "true";
      const amount = params.get("amount");
      const tourId = params.get("tourId");

      setSearchParams({ mock, amount, tourId });
      setIsMock(mock);
    }
  }, []);

  const formatAmount = (amountFils) => {
    if (!amountFils) return "";
    const aed = (parseInt(amountFils) / 100).toFixed(2);
    return `AED ${aed}`;
  };

  return (
    <ReveloLayout>
      <section className="page-banner-two rel z-1">
        <div className="container-fluid">
          <hr className="mt-0" />
          <div className="container">
            <div className="banner-inner pt-15 pb-25">
              <h2
                className="page-title mb-10"
                data-aos="fade-left"
                data-aos-duration={1500}
                data-aos-offset={50}
              >
                Payment Successful
              </h2>
              <nav aria-label="breadcrumb">
                <ol
                  className="breadcrumb justify-content-center mb-20"
                  data-aos="fade-right"
                  data-aos-delay={200}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Thank You</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="tour-details-page pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center">
                <div className="mb-4">
                  <i
                    className="fas fa-check-circle text-success"
                    style={{ fontSize: "4rem" }}
                  ></i>
                </div>

                <h2 className="mb-3 text-success">Payment Successful!</h2>

                <p className="lead mb-4">
                  Thank you for your booking. Your payment has been processed
                  successfully.
                </p>

                {isMock && (
                  <div className="alert alert-info mb-4">
                    <strong>Test Mode:</strong> This was a mock payment for
                    testing purposes.
                  </div>
                )}

                {searchParams.amount && (
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title">Payment Details</h5>
                      <p className="card-text">
                        <strong>Amount Paid:</strong>{" "}
                        {formatAmount(searchParams.amount)}
                      </p>
                      {searchParams.tourId && (
                        <p className="card-text">
                          <strong>Tour ID:</strong> {searchParams.tourId}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="alert alert-success mb-4">
                  <h5>What's Next?</h5>
                  <ul className="list-unstyled mb-0">
                    <li>✓ You will receive a confirmation email shortly</li>
                    <li>
                      ✓ Our team will contact you to confirm your tour details
                    </li>
                    <li>
                      ✓ Please keep your booking reference for your records
                    </li>
                  </ul>
                </div>

                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link href="/" className="btn btn-primary">
                    <i className="fas fa-home me-2"></i>
                    Back to Home
                  </Link>
                  <Link href="/tour-list" className="btn btn-outline-primary">
                    <i className="fas fa-list me-2"></i>
                    Browse More Tours
                  </Link>
                  <Link href="/contact" className="btn btn-outline-secondary">
                    <i className="fas fa-envelope me-2"></i>
                    Contact Support
                  </Link>
                </div>

                <div className="mt-5">
                  <h6>Need Help?</h6>
                  <p className="text-muted">
                    If you have any questions about your booking, please don't
                    hesitate to contact us.
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:urbanadventuretourism@gmail.com">
                      urbanadventuretourism@gmail.com
                    </a>
                    <br />
                    <strong>Phone:</strong>{" "}
                    <a href="tel:+971528067631">+971528067631</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ReveloLayout>
  );
}
