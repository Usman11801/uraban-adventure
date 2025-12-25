"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";
import ReveloLayout from "@/layout/ReveloLayout";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, getCartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Redirect to checkout or process payment
    // For now, just show an alert
    setTimeout(() => {
      alert("Checkout functionality will be implemented here");
      setIsProcessing(false);
    }, 500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not selected";
    const date = new Date(dateString);
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName} ${day} ${month} ${year}`;
  };

  const calculateItemTotal = (item) => {
    const tourTotal = parseFloat(item.totalAmount || 0);
    const addonsTotal = item.selectedAddons ? Object.keys(item.selectedAddons).reduce((sum, addonId) => {
      const addon = item.selectedAddons[addonId];
      if (addon && addon.selected) {
        return sum + ((addon.adult || 0) * (addon.adultPrice || 0)) + ((addon.child || 0) * (addon.childPrice || 0));
      }
      return sum;
    }, 0) : 0;
    return tourTotal + addonsTotal;
  };

  const grandTotal = getCartTotal();

  return (
    <ReveloLayout header={1}>
      <style jsx>{`
        .cart-page {
          padding: 120px 0 100px;
          background: var(--lighter-color);
          min-height: 80vh;
        }
        .cart-header {
          text-align: center;
          margin-bottom: 60px;
          padding: 50px 20px;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 2px solid var(--border-color);
        }
        .cart-header h1 {
          color: var(--heading-color);
          font-weight: 700;
          font-size: 48px;
          margin-bottom: 15px;
        }
        .cart-header h1::after {
          content: '';
          display: block;
          width: 80px;
          height: 4px;
          background: var(--secondary-color);
          margin: 15px auto 0;
          border-radius: 2px;
        }
        .cart-header p {
          color: var(--base-color);
          font-size: 18px;
          margin: 0;
          font-weight: 500;
        }
        .cart-empty {
          text-align: center;
          padding: 60px 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .cart-empty-icon {
          font-size: 80px;
          color: var(--border-color);
          margin-bottom: 20px;
        }
        .cart-empty h3 {
          color: var(--heading-color);
          margin-bottom: 15px;
        }
        .cart-empty p {
          color: var(--base-color);
          margin-bottom: 30px;
        }
        .cart-item {
          background: #fff;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 25px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }
        .cart-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }
        .cart-item-header {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }
        .cart-item-image {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 12px;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        .cart-item:hover .cart-item-image {
          transform: scale(1.05);
        }
        .cart-item-info {
          flex: 1;
        }
        .cart-item-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--heading-color);
          margin-bottom: 15px;
          line-height: 1.3;
        }
        .cart-item-title a {
          color: var(--heading-color);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .cart-item-title a:hover {
          color: var(--primary-color);
        }
        .cart-item-details {
          font-size: 15px;
          color: var(--base-color);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cart-item-details i {
          color: var(--primary-color);
          width: 18px;
        }
        .cart-item-remove {
          background: transparent;
          border: none;
          color: #dc3545;
          cursor: pointer;
          font-size: 18px;
          padding: 5px 10px;
          transition: all 0.3s ease;
        }
        .cart-item-remove:hover {
          color: #c82333;
          transform: scale(1.1);
        }
        .cart-item-section {
          margin-bottom: 20px;
          padding: 20px;
          background: #fff;
          border-radius: 10px;
          border: 1px solid var(--border-color);
        }
        .cart-item-section:last-child {
          margin-bottom: 0;
        }
        .cart-item-section-title {
          font-weight: 700;
          color: var(--heading-color);
          margin-bottom: 15px;
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cart-item-section-title i {
          color: var(--primary-color);
        }
        .cart-item-section-content {
          font-size: 15px;
          color: var(--base-color);
          line-height: 2;
        }
        .cart-item-section-content > div {
          padding: 8px 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .cart-item-section-content > div:last-child {
          border-bottom: none;
        }
        .addon-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          margin-bottom: 8px;
          background: #fff;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }
        .addon-item:hover {
          border-color: var(--primary-color);
          box-shadow: 0 2px 8px rgba(99, 171, 69, 0.15);
        }
        .addon-item:last-child {
          margin-bottom: 0;
        }
        .cart-item-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          margin-top: 20px;
          background: var(--lighter-color);
          border-radius: 10px;
          border: 2px solid var(--border-color);
        }
        .cart-item-total-label {
          font-weight: 700;
          color: var(--heading-color);
          font-size: 20px;
        }
        .cart-item-total-value {
          font-weight: 700;
          color: var(--primary-color);
          font-size: 28px;
        }
        .cart-summary {
          background: #fff;
          border-radius: 15px;
          padding: 35px;
          box-shadow: 0 6px 25px rgba(0,0,0,0.1);
          border: 2px solid var(--border-color);
          position: sticky;
          top: 100px;
        }
        .cart-summary-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--heading-color);
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid var(--primary-color);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cart-summary-title i {
          color: var(--primary-color);
        }
        .cart-summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          margin-bottom: 10px;
          font-size: 16px;
          background: #fff;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .cart-summary-item-label {
          color: var(--base-color);
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cart-summary-item-value {
          font-weight: 600;
          color: var(--heading-color);
          margin-left: 15px;
        }
        .cart-summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px;
          margin-top: 25px;
          background: var(--lighter-color);
          border-radius: 12px;
          border: 2px solid var(--primary-color);
        }
        .cart-summary-total-label {
          font-size: 22px;
          font-weight: 700;
          color: var(--heading-color);
        }
        .cart-summary-total-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--primary-color);
        }
        .cart-actions {
          margin-top: 25px;
        }
        .btn-checkout {
          width: 100%;
          padding: 15px 30px;
          background: var(--primary-color);
          color: #fff;
          border: 2px solid var(--primary-color);
          border-radius: 30px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: capitalize;
          box-shadow: 0 4px 12px rgba(99, 171, 69, 0.25);
        }
        .btn-checkout:hover:not(:disabled) {
          background: #4d8a35;
          border-color: #4d8a35;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(99, 171, 69, 0.35);
        }
        .btn-checkout:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-clear-cart {
          width: 100%;
          padding: 12px 30px;
          background: transparent;
          color: #dc3545;
          border: 2px solid #dc3545;
          border-radius: 30px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 15px;
        }
        .btn-clear-cart:hover {
          background: #dc3545;
          color: #fff;
        }
      `}</style>
      <section className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            <p style={{ color: 'var(--base-color)' }}>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <i className="fal fa-shopping-cart" />
              </div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any tours to your cart yet.</p>
              <Link href="/" className="theme-btn bgc-secondary">
                <span data-hover="Browse Tours">Browse Tours</span>
                <i className="fal fa-arrow-right" />
              </Link>
            </div>
          ) : (
            <div className="row">
              <div className="col-lg-8">
                {cartItems.map((item) => {
                  const itemTotal = calculateItemTotal(item);
                  const addonsList = item.selectedAddons ? Object.keys(item.selectedAddons).filter(id => item.selectedAddons[id]?.selected) : [];
                  
                  return (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-header">
                        <img
                          src={item.tourImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop"}
                          alt={item.tourTitle}
                          className="cart-item-image"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop";
                          }}
                        />
                        <div className="cart-item-info">
                          <h3 className="cart-item-title">
                            <Link href={`/tour-details?id=${item.tourId}`}>{item.tourTitle}</Link>
                          </h3>
                          <div className="cart-item-details">
                            <i className="far fa-calendar-alt" />
                            <span><strong>Date:</strong> {formatDate(item.selectedDate)}</span>
                          </div>
                          <div className="cart-item-details">
                            <i className="far fa-car" />
                            <span><strong>Transfer:</strong> {item.transferOption === 'sharing' ? 'Sharing Transfers' : 'Private Transfers'}</span>
                          </div>
                        </div>
                        <button
                          className="cart-item-remove"
                          onClick={() => removeFromCart(item.id)}
                          title="Remove from cart"
                        >
                          <i className="fal fa-times" />
                        </button>
                      </div>

                      <div className="cart-item-section">
                        <div className="cart-item-section-title">
                          <i className="far fa-users" />
                          Participants
                        </div>
                        <div className="cart-item-section-content">
                          {item.adultCount > 0 && (
                            <div>Adult: {item.adultCount} x {item.adultPrice || 0} AED = {(item.adultCount * (item.adultPrice || 0)).toFixed(2)} AED</div>
                          )}
                          {item.childCount > 0 && (
                            <div>Child: {item.childCount} x {item.childPrice || 0} AED = {(item.childCount * (item.childPrice || 0)).toFixed(2)} AED</div>
                          )}
                          {item.infantCount > 0 && (
                            <div>Infant: {item.infantCount} x {item.infantPrice || 0} AED = {(item.infantCount * (item.infantPrice || 0)).toFixed(2)} AED</div>
                          )}
                        </div>
                      </div>

                      {addonsList.length > 0 && (
                        <div className="cart-item-section">
                          <div className="cart-item-section-title">
                            <i className="far fa-plus-circle" />
                            Addons
                          </div>
                          <div className="cart-item-section-content">
                            {addonsList.map((addonId) => {
                              const addon = item.selectedAddons[addonId];
                              const addonTotal = ((addon.adult || 0) * (addon.adultPrice || 0)) + ((addon.child || 0) * (addon.childPrice || 0));
                              return (
                                <div key={addonId} className="addon-item">
                                  <span>{addon.name} {addon.adult > 0 && `- Adult: ${addon.adult}`} {addon.child > 0 && `- Child: ${addon.child}`}</span>
                                  <span style={{ fontWeight: '600', color: 'var(--secondary-color)' }}>{addonTotal.toFixed(2)} AED</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="cart-item-total">
                        <span className="cart-item-total-label">Package Total:</span>
                        <span className="cart-item-total-value">{itemTotal.toFixed(2)} AED</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="col-lg-4">
                <div className="cart-summary">
                  <h2 className="cart-summary-title">
                    <i className="far fa-receipt" />
                    Order Summary
                  </h2>
                  
                  <div className="cart-summary-item">
                    <span className="cart-summary-item-label">Items ({cartItems.length})</span>
                    <span className="cart-summary-item-value">{cartItems.length}</span>
                  </div>

                  {cartItems.map((item, index) => {
                    const itemTotal = calculateItemTotal(item);
                    return (
                      <div key={item.id} className="cart-summary-item">
                        <span className="cart-summary-item-label">{item.tourTitle.substring(0, 30)}...</span>
                        <span className="cart-summary-item-value">{itemTotal.toFixed(2)} AED</span>
                      </div>
                    );
                  })}

                  <div className="cart-summary-total">
                    <span className="cart-summary-total-label">Grand Total</span>
                    <span className="cart-summary-total-value">{grandTotal.toFixed(2)} AED</span>
                  </div>

                  <div className="cart-actions">
                    <button
                      className="btn-checkout"
                      onClick={handleCheckout}
                      disabled={isProcessing || cartItems.length === 0}
                    >
                      {isProcessing ? "Processing..." : "Proceed to Checkout"}
                    </button>
                    <button
                      className="btn-clear-cart"
                      onClick={() => {
                        if (confirm("Are you sure you want to clear your cart?")) {
                          clearCart();
                        }
                      }}
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </ReveloLayout>
  );
};

export default CartPage;

