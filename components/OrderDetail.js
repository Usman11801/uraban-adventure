"use client";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";

const OrderDetail = ({ tour, bookingData, selectedAddons, onBuyNow, onAddToCart }) => {
  const { cartItems, getCartTotal } = useCart();
  const [orderDate, setOrderDate] = useState("");

  useEffect(() => {
    if (bookingData?.selectedDate) {
      const date = new Date(bookingData.selectedDate);
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const dayName = days[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      setOrderDate(`${dayName} ${day} ${month} ${year}`);
    }
  }, [bookingData?.selectedDate]);

  // Calculate tour total
  const tourTotal = bookingData ? parseFloat(bookingData.totalAmount || 0) : 0;
  // Use same price logic as TourCard: discount_price || base_price || price
  const displayPrice = tour?.discount_price || tour?.base_price || tour?.price || 0;
  const originalTourPrice = tour?.base_price ? parseFloat(tour.base_price) : (displayPrice ? parseFloat(displayPrice) : 0);
  // Show original price only if there's a discount
  const showOriginalPrice = tour?.discount_price && tour?.base_price && parseFloat(tour.discount_price) < parseFloat(tour.base_price);
  const tourDiscount = showOriginalPrice && originalTourPrice > tourTotal ? originalTourPrice - tourTotal : 0;

  // Calculate addons total
  const addonsTotal = selectedAddons ? Object.keys(selectedAddons).reduce((total, addonId) => {
    const addon = selectedAddons[addonId];
    if (addon && addon.selected) {
      return total + (addon.adult * (addon.adultPrice || 0)) + (addon.child * (addon.childPrice || 0));
    }
    return total;
  }, 0) : 0;

  // Total amount
  const totalAmount = tourTotal + addonsTotal;

  // Get selected addons list
  const selectedAddonsList = selectedAddons ? Object.keys(selectedAddons).filter(id => selectedAddons[id]?.selected) : [];

  return (
    <>
      <style jsx>{`
        .order-detail-widget {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          border: 1px solid var(--border-color);
          overflow: hidden;
          position: sticky;
          top: 20px;
        }

        .order-detail-header {
          background: var(--secondary-color);
          color: #fff;
          padding: 15px 20px;
          font-weight: 600;
          font-size: 18px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .order-detail-content {
          padding: 20px;
        }

        .tour-summary {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
          margin-bottom: 20px;
        }

        .tour-summary-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .tour-summary-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 8px;
        }

        .tour-summary-title {
          font-weight: 600;
          font-size: 16px;
          color: var(--heading-color);
          flex: 1;
        }

        .tour-summary-date {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .tour-summary-price {
          font-size: 18px;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 5px;
        }

        .tour-summary-original-price {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
          margin-left: 10px;
        }

        .tour-summary-info {
          font-size: 13px;
          color: #666;
          margin-top: 10px;
        }

        .tour-summary-info-item {
          margin-bottom: 5px;
        }

        .addons-summary {
          margin-bottom: 20px;
        }

        .addons-summary-title {
          font-weight: 600;
          font-size: 16px;
          color: var(--heading-color);
          margin-bottom: 15px;
        }

        .addon-summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .addon-summary-item:last-child {
          border-bottom: none;
        }

        .addon-summary-name {
          font-size: 14px;
          color: var(--heading-color);
          flex: 1;
        }

        .addon-summary-price {
          font-size: 14px;
          font-weight: 600;
          color: var(--secondary-color);
        }

        .addon-summary-original-price {
          font-size: 12px;
          color: #999;
          text-decoration: line-through;
          margin-left: 5px;
        }

        .addons-total {
          font-weight: 600;
          font-size: 16px;
          color: var(--heading-color);
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
        }

        .total-amount-section {
          background: var(--lighter-color);
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }

        .total-amount-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .total-amount-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .order-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-buy-now {
          flex: 1;
          padding: 14px 24px;
          background: var(--primary-color);
          color: #fff;
          border: 2px solid var(--primary-color);
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 15px;
          text-transform: capitalize;
          box-shadow: 0 4px 12px rgba(99, 171, 69, 0.25);
        }

        .btn-buy-now:hover {
          background: #4d8a35;
          border-color: #4d8a35;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(99, 171, 69, 0.35);
        }

        .btn-add-cart {
          flex: 1;
          padding: 14px 24px;
          background: var(--secondary-color);
          color: #fff;
          border: 2px solid var(--secondary-color);
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 15px;
          text-transform: capitalize;
          box-shadow: 0 4px 12px rgba(247, 146, 30, 0.25);
        }

        .btn-add-cart:hover {
          background: #e67e22;
          border-color: #e67e22;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(247, 146, 30, 0.35);
        }
      `}</style>
      <div className="order-detail-widget">
        <div className="order-detail-header">Order Detail</div>
        <div className="order-detail-content">
          {tour && bookingData && (
            <>
              <div className="tour-summary">
                <div className="tour-summary-header">
                  <img 
                    src={tour.image || tour.image1} 
                    alt={tour.title}
                    className="tour-summary-image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="tour-summary-title">{tour.title}</div>
                </div>
                {orderDate && (
                  <div className="tour-summary-date">{orderDate}</div>
                )}
                <div className="tour-summary-price">
                  {tourTotal.toFixed(2)} AED
                  {tourDiscount > 0 && (
                    <span className="tour-summary-original-price">
                      {originalTourPrice.toFixed(2)} AED
                    </span>
                  )}
                </div>
                <div className="tour-summary-info">
                  <div className="tour-summary-info-item">
                    <strong>Transfer Option:</strong> {bookingData.transferOption === 'sharing' ? 'Sharing' : 'Private'}
                  </div>
                  <div className="tour-summary-info-item">
                    <strong>Participants:</strong>{" "}
                    {bookingData.adultCount > 0 && `${bookingData.adultCount} x Adult (${(bookingData.adultCount * (bookingData.adultPrice || 0)).toFixed(2)} AED)`}
                    {bookingData.childCount > 0 && `, ${bookingData.childCount} x Child (${(bookingData.childCount * (bookingData.childPrice || 0)).toFixed(2)} AED)`}
                    {bookingData.infantCount > 0 && `, ${bookingData.infantCount} x Infant (${(bookingData.infantCount * (bookingData.infantPrice || 0)).toFixed(2)} AED)`}
                  </div>
                  <div className="tour-summary-info-item">
                    <strong>Tour Total:</strong>{" "}
                    <span style={{ color: 'var(--secondary-color)', fontWeight: '600' }}>
                      {tourTotal.toFixed(2)} AED
                    </span>
                    {tourDiscount > 0 && (
                      <span className="tour-summary-original-price" style={{ marginLeft: '10px' }}>
                        {originalTourPrice.toFixed(2)} AED
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selectedAddonsList.length > 0 && (
                <div className="addons-summary">
                  <div className="addons-summary-title">Addons:</div>
                  {selectedAddonsList.map((addonId) => {
                    const addon = selectedAddons[addonId];
                    const addonTotal = (addon.adult * (addon.adultPrice || 0)) + (addon.child * (addon.childPrice || 0));
                    const originalPrice = addon.originalPrice || addonTotal;
                    const discount = originalPrice > addonTotal ? originalPrice - addonTotal : 0;
                    
                    return (
                      <div key={addonId} className="addon-summary-item">
                        <div className="addon-summary-name">
                          {addon.name}
                          {addon.adult > 0 && ` - Adult: ${addon.adult}`}
                          {addon.child > 0 && ` - Child: ${addon.child}`}
                        </div>
                        <div className="addon-summary-price">
                          {addonTotal.toFixed(2)} AED
                          {discount > 0 && (
                            <span className="addon-summary-original-price">
                              {originalPrice.toFixed(2)} AED
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="addons-total">
                    Addons Total: {addonsTotal.toFixed(2)} AED
                  </div>
                </div>
              )}

              <div className="total-amount-section">
                <div className="total-amount-label">Total Amount</div>
                <div className="total-amount-value">{totalAmount.toFixed(2)} AED</div>
              </div>

              <div className="order-buttons">
                <button className="btn-buy-now" onClick={onBuyNow}>
                  Buy Now
                </button>
                <button className="btn-add-cart" onClick={onAddToCart}>
                  Add to cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetail;

