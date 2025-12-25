"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { calculateTotalFils } from "@/utility/payments";

const Booking = ({ tour, onBookingChange, onBuyNow, onAddToCart }) => {
  const [transferOption, setTransferOption] = useState("sharing");
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayTotal, setDisplayTotal] = useState("0.00");
  const [isClient, setIsClient] = useState(false);

  // Transfer option pricing
  const transferPricing = {
    sharing: { adult: 150, child: 130, infant: 0 },
    private: { adult: 300, child: 250, infant: 0 }
  };

  // Pricing configuration - use tour price as base
  const basePrice = Number(tour?.price) || 350;
  const adultPrice = transferPricing[transferOption]?.adult || basePrice;
  const childPrice = transferPricing[transferOption]?.child || Math.round(basePrice * 0.5);
  const infantPrice = transferPricing[transferOption]?.infant || 0;


  // Helper to compute total AED
  const computeTotalAed = () => {
    const validAdult = Number.isFinite(adultCount) ? adultCount : 0;
    const validChild = Number.isFinite(childCount) ? childCount : 0;
    const validInfant = Number.isFinite(infantCount) ? infantCount : 0;
    
    // Base tour price
    let total = validAdult * adultPrice + validChild * childPrice + validInfant * infantPrice;
    
    return total.toFixed(2);
  };

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize displayed total and keep it in sync
  useEffect(() => {
    setDisplayTotal(computeTotalAed());
  }, [adultPrice, childPrice, infantPrice, transferOption]);

  // Reset to default values when tour changes
  useEffect(() => {
    if (tour) {
      setTransferOption("sharing");
      setAdultCount(1);
      setChildCount(0);
      setInfantCount(0);
      setSelectedDate("");
      setSelectedTime("12:00");
      setError("");
    }
  }, [tour]);

  // Update total whenever counts or transfer option change
  useEffect(() => {
    setDisplayTotal(computeTotalAed());
    
    // Notify parent component of booking changes
    if (onBookingChange) {
      onBookingChange({
        transferOption,
        adultCount,
        childCount,
        infantCount,
        selectedDate,
        selectedTime,
        adultPrice,
        childPrice,
        infantPrice,
        totalAmount: computeTotalAed()
      });
    }
  }, [adultCount, childCount, infantCount, transferOption, selectedDate, selectedTime, onBookingChange]);

  const handleCheckout = async (e) => {
    e?.preventDefault?.();
    setError("");
    setIsLoading(true);

    // Validation
    if (!selectedDate) {
      setError("Please select a date");
      setIsLoading(false);
      return;
    }

    if (adultCount === 0 && childCount === 0 && infantCount === 0) {
      setError("Please select at least one ticket");
      setIsLoading(false);
      return;
    }

    try {
      const amountFils = calculateTotalFils({
        adultCount,
        childCount,
        infantCount,
        adultPriceAed: adultPrice,
        childPriceAed: childPrice,
        infantPriceAed: infantPrice,
        selectedAddons,
      });

      const res = await fetch("/api/ziina/create-intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          amountFils,
          currency: "AED",
          description: tour?.title || "Tour Booking",
          metadata: {
            tourId: tour?.id,
            selectedDate,
            selectedTime,
            transferOption,
            adultCount,
            childCount,
            infantCount,
            calculatedTotalAed: displayTotal,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create payment");
      }

      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("No redirect URL received");
      }
    } catch (err) {
      console.error("Checkout error", err);
      setError(err.message || "Unable to start payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .widget.widget-booking,
        .widget.widget-booking form {
          width: 100%;
        }


        .widget.widget-booking {
          background: #fff;
          border-radius: 12px;
          padding: 15px 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #E9E9E9;
          overflow: hidden;
          position: relative;
        }

        .widget-title {
          display: none;
        }

        .booking-content {
          padding: 0;
        }
        .booking-section {
          margin-bottom: 30px;
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }

        .booking-section:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          font-weight: 700;
          color: #2c3e50;
          font-size: 16px;
        }

        .section-title::before {
          content: "";
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          border-radius: 2px;
          margin-right: 12px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
          font-size: 14px;
          display: flex;
          align-items: center;
        }

        .form-group label::before {
          content: "";
          width: 8px;
          height: 8px;
          background: #e74c3c;
          border-radius: 50%;
          margin-right: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 15px 18px;
          border: 2px solid #e1e8ed;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: white;
          font-weight: 500;
        }

        .form-group input:focus {
          outline: none;
          border-color: #e74c3c;
          box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1);
          transform: translateY(-1px);
        }

        .form-group input:hover {
          border-color: #d1d9e0;
        }

        .ticket-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .ticket-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(135deg, #e74c3c, #c0392b);
        }

        .ticket-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .ticket-header {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 0;
        }

        .ticket-info {
          flex: 1;
        }

        .ticket-type {
          font-weight: 700;
          color: #2c3e50;
          font-size: 16px;
          margin-bottom: 5px;
        }

        .ticket-price {
          font-weight: 600;
          color: #e74c3c;
          font-size: 16px;
        }

        .ticket-select {
          width: 100%;
          padding: 15px 18px;
          border: 2px solid #e1e8ed;
          border-radius: 12px;
          background: white;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          transition: all 0.3s ease;
        }

        .ticket-select:focus {
          outline: none;
          border-color: #e74c3c;
          box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1);
          transform: translateY(-1px);
        }

        .ticket-select:hover {
          border-color: #d1d9e0;
        }
        .extra-services {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 15px;
        }

        .extra-option {
          position: relative;
        }

        .extra-option input[type="radio"] {
          display: none;
        }

        .extra-option label {
          display: block;
          padding: 15px 20px;
          background: white;
          border: 2px solid #e1e8ed;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          color: #2c3e50;
          text-align: center;
          position: relative;
        }

        .extra-option input[type="radio"]:checked + label {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          border-color: #e74c3c;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(231, 76, 60, 0.3);
        }

        .extra-option label:hover {
          border-color: #d1d9e0;
          transform: translateY(-1px);
        }

        .total-section {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          padding: 30px;
          border-radius: 20px;
          margin: 30px 0;
          color: white;
          text-align: center;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
        }

        .total-section::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(231, 76, 60, 0.1) 0%,
            transparent 70%
          );
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .total-section h6 {
          margin: 0 0 15px 0;
          color: white;
          font-size: 18px;
          font-weight: 600;
          position: relative;
          z-index: 1;
        }

        .total-amount {
          font-size: 36px;
          font-weight: 800;
          color: white;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
        }

        .book-button {
          width: 100%;
          padding: 20px;
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          border: none;
          border-radius: 15px;
          color: white;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 30px 0 20px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 10px 30px rgba(231, 76, 60, 0.3);
          position: relative;
          overflow: hidden;
        }

        .book-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }

        .book-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(231, 76, 60, 0.4);
        }

        .book-button:hover:not(:disabled)::before {
          left: 100%;
        }

        .book-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .extra-services {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .booking-content {
            padding: 20px;
          }

          .total-amount {
            font-size: 28px;
          }
        }

        .text-center a {
          color: #e74c3c;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .text-center a:hover {
          color: #c0392b;
        }

        .alert {
          border-radius: 10px;
          border: none;
          padding: 15px 20px;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .alert-danger {
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: white;
        }

        hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e1e8ed, transparent);
          margin: 25px 0;
        }
      `}</style>
      <div className="widget-booking-container">
          <div
            className="widget widget-booking"
            data-aos="fade-up"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <div className="booking-content">
              {error && (
                <div className="alert alert-danger mb-3" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleCheckout} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flexWrap: 'nowrap', overflowX: 'auto' }}>
                {/* Transfer Option */}
                <div style={{ flex: '0 0 auto', minWidth: '160px' }}>
                  <label style={{ fontSize: '12px', marginBottom: '5px', display: 'block', color: '#666', fontWeight: '500' }}>Transfer Option</label>
                  <select
                    value={transferOption}
                    onChange={(e) => setTransferOption(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', height: '36px', boxSizing: 'border-box' }}
                  >
                    <option value="sharing">Sharing Transfers</option>
                    <option value="private">Private Transfers</option>
                  </select>
                </div>

                {/* Tour Date */}
                <div style={{ flex: '0 0 auto', minWidth: '150px' }}>
                  <label style={{ fontSize: '12px', marginBottom: '5px', display: 'block', color: '#666', fontWeight: '500' }}>Tour Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', height: '36px', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Adult */}
                <div style={{ flex: '0 0 auto', minWidth: '90px' }}>
                  <label style={{ fontSize: '12px', marginBottom: '5px', display: 'block', color: '#666', fontWeight: '500' }}>Adult</label>
                  <input
                    type="number"
                    min="0"
                    value={adultCount}
                    onChange={(e) => setAdultCount(Number(e.target.value) || 0)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', textAlign: 'center', height: '36px', boxSizing: 'border-box' }}
                  />
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '3px', textAlign: 'center', height: '16px', lineHeight: '16px' }}>{adultPrice} AED</div>
                </div>

                {/* Child */}
                <div style={{ flex: '0 0 auto', minWidth: '90px' }}>
                  <label style={{ fontSize: '12px', marginBottom: '5px', display: 'block', color: '#666', fontWeight: '500' }}>Child</label>
                  <input
                    type="number"
                    min="0"
                    value={childCount}
                    onChange={(e) => setChildCount(Number(e.target.value) || 0)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', textAlign: 'center', height: '36px', boxSizing: 'border-box' }}
                  />
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '3px', textAlign: 'center', height: '16px', lineHeight: '16px' }}>{childPrice} AED</div>
                </div>

                {/* Infant */}
                <div style={{ flex: '0 0 auto', minWidth: '90px' }}>
                  <label style={{ fontSize: '12px', marginBottom: '5px', display: 'block', color: '#666', fontWeight: '500' }}>Infant</label>
                  <input
                    type="number"
                    min="0"
                    value={infantCount}
                    onChange={(e) => setInfantCount(Number(e.target.value) || 0)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', textAlign: 'center', height: '36px', boxSizing: 'border-box' }}
                  />
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '3px', textAlign: 'center', height: '16px', lineHeight: '16px' }}>{infantPrice} AED</div>
                </div>

                {/* Total Price */}
                <div style={{ flex: '0 0 auto', minWidth: '130px', textAlign: 'right', marginLeft: 'auto' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px', fontWeight: '500' }}>Total</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--secondary-color)' }}>
                    {displayTotal} AED
                  </div>
                  {tour?.price && parseFloat(tour.price) > parseFloat(displayTotal) && (
                    <div style={{ fontSize: '11px', color: '#999', textDecoration: 'line-through', marginTop: '3px' }}>
                      {tour.price} AED
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
    </>
  );
};
export default Booking;


