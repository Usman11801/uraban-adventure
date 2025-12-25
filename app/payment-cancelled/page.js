"use client";
import Link from "next/link";
import ReveloLayout from "@/layout/ReveloLayout";

export default function PaymentCancelled() {
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
                Payment Cancelled
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
                  <li className="breadcrumb-item active">Payment Cancelled</li>
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
                    className="fas fa-times-circle text-warning"
                    style={{ fontSize: "4rem" }}
                  ></i>
                </div>

                <h2 className="mb-3 text-warning">Payment Cancelled</h2>

                <p className="lead mb-4">
                  Your payment was cancelled. No charges have been made to your
                  account.
                </p>

                <div className="alert alert-info mb-4">
                  <h5>What happened?</h5>
                  <p className="mb-0">
                    You chose to cancel the payment process. This could be
                    because you changed your mind, encountered an issue, or
                    needed to review your booking details.
                  </p>
                </div>

                <div className="alert alert-light mb-4">
                  <h5>Need Help?</h5>
                  <p className="mb-0">
                    If you experienced any technical issues or need assistance
                    with your booking, please don't hesitate to contact our
                    support team.
                  </p>
                </div>

                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link href="/tour-list" className="btn btn-primary">
                    <i className="fas fa-redo me-2"></i>
                    Try Booking Again
                  </Link>
                  <Link href="/" className="btn btn-outline-primary">
                    <i className="fas fa-home me-2"></i>
                    Back to Home
                  </Link>
                  <Link href="/contact" className="btn btn-outline-secondary">
                    <i className="fas fa-envelope me-2"></i>
                    Contact Support
                  </Link>
                </div>

                <div className="mt-5">
                  <h6>Contact Information</h6>
                  <p className="text-muted">
                    Our team is here to help you with any questions or issues.
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
