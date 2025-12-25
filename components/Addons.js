"use client";
import { useState, useEffect } from "react";

const Addons = ({ tour, onAddonsChange }) => {
  const [selectedAddons, setSelectedAddons] = useState({});

  // Get tour image for addons
  const tourImage = tour?.image || tour?.image1 || tour?.image2 || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop";

  // Addons data with original prices for discount display
  const addons = [
    {
      id: "louvre_museum",
      name: "Louvre Museum",
      image: tourImage,
      adultPrice: 65,
      childPrice: 65,
      originalPrice: 65,
      infantPrice: 0
    },
    {
      id: "qasr_al_watan",
      name: "Qasr Al Watan",
      image: tourImage,
      adultPrice: 60,
      childPrice: 60,
      originalPrice: 60,
      infantPrice: 0
    },
    {
      id: "ferrari_world",
      name: "Ferrari World",
      image: tourImage,
      adultPrice: 310,
      childPrice: 310,
      originalPrice: 345,
      infantPrice: 0
    },
    {
      id: "warner_bros",
      name: "Warner Bros",
      image: tourImage,
      adultPrice: 310,
      childPrice: 310,
      originalPrice: 345,
      infantPrice: 0
    }
  ];

  // Notify parent of addon changes
  useEffect(() => {
    if (onAddonsChange) {
      const addonsData = {};
      Object.keys(selectedAddons).forEach(id => {
        const addon = addons.find(a => a.id === id);
        if (addon && selectedAddons[id]?.selected) {
          addonsData[id] = {
            ...selectedAddons[id],
            name: addon.name,
            adultPrice: addon.adultPrice,
            childPrice: addon.childPrice,
            originalPrice: addon.originalPrice
          };
        }
      });
      onAddonsChange(addonsData);
    }
  }, [selectedAddons, onAddonsChange]);

  return (
    <>
      <style jsx>{`
        .addons-section {
          background: var(--lighter-color);
          padding: 30px;
          border-radius: 12px;
        }

        .addons-container {
          max-width: 100%;
          margin: 0;
          padding: 0;
        }

        .addons-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--heading-color);
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .addons-subtitle {
          font-size: 13px;
          color: #666;
          font-weight: 400;
          margin-left: 10px;
        }

        .addons-grid {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .addon-card {
          background: #fff;
          border-radius: 0;
          padding: 15px 20px;
          border: 1px solid #e0e0e0;
          border-top: none;
          display: flex;
          gap: 20px;
          align-items: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .addon-card:first-child {
          border-top: 1px solid #e0e0e0;
          border-radius: 8px 8px 0 0;
        }

        .addon-card:last-child {
          border-radius: 0 0 8px 8px;
        }

        .addon-card.selected {
          border-color: var(--secondary-color);
          border-left: 3px solid var(--secondary-color);
          background: #fffbf5;
        }

        .addon-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transform: translateX(2px);
        }

        .addon-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 10px;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          order: -1;
        }

        .addon-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .addon-name {
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 0;
          color: var(--heading-color);
        }

        .addon-pricing {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .addon-price-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          background: transparent;
          padding: 0;
          border: none;
        }

        .addon-price-label {
          font-size: 12px;
          color: #0066cc;
          font-weight: 500;
          white-space: nowrap;
        }

        .addon-quantity-input {
          width: 70px;
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: 14px;
          text-align: center;
          -moz-appearance: textfield;
        }

        .addon-quantity-input::-webkit-outer-spin-button,
        .addon-quantity-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .addon-quantity-input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .addon-total-wrapper {
          margin-left: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          min-width: 100px;
          padding: 0;
          background: transparent;
          border: none;
        }

        .addon-total {
          font-size: 16px;
          font-weight: 700;
          color: #0066cc;
        }

        .addon-discount-price {
          font-size: 13px;
          color: #dc3545;
          text-decoration: line-through;
          margin-top: 4px;
        }

        .addon-checkbox-wrapper {
          display: flex;
          align-items: center;
          margin-left: 15px;
          padding: 10px;
        }

        .addon-checkbox {
          width: 24px;
          height: 24px;
          cursor: pointer;
          accent-color: var(--secondary-color);
          border-radius: 50%;
          transition: transform 0.2s ease;
        }

        .addon-checkbox:hover {
          transform: scale(1.1);
        }
      `}</style>
      <div className="addons-section">
        <div className="addons-container">
          <h2 className="addons-title">
            Addons <span className="addons-subtitle">(Check Addons to customize your experience.)</span>
          </h2>
          <div className="addons-grid">
            {addons.map((addon) => {
              const addonState = selectedAddons[addon.id] || { selected: false, adult: 0, child: 0 };
              const addonTotal = (addonState.adult * addon.adultPrice) + (addonState.child * addon.childPrice);
              const hasDiscount = addon.originalPrice && addon.originalPrice > addonTotal;
              const discountAmount = hasDiscount ? (addon.originalPrice - addonTotal) : 0;
              
              return (
                <div key={addon.id} className={`addon-card ${addonState.selected ? 'selected' : ''}`}>
                  <img 
                    src={addon.image} 
                    alt={addon.name}
                    className="addon-image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="addon-content">
                    <div className="addon-name">{addon.name}</div>
                    <div className="addon-pricing">
                      <div className="addon-price-group">
                        <div className="addon-price-label">Adult: {addon.adultPrice} AED</div>
                        <input
                          type="number"
                          min="0"
                          value={addonState.adult || 0}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setSelectedAddons({
                              ...selectedAddons,
                              [addon.id]: { ...addonState, adult: val, selected: val > 0 || addonState.child > 0 }
                            });
                          }}
                          disabled={!addonState.selected}
                          className="addon-quantity-input"
                        />
                      </div>
                      <div className="addon-price-group">
                        <div className="addon-price-label">Child: {addon.childPrice} AED</div>
                        <input
                          type="number"
                          min="0"
                          value={addonState.child || 0}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setSelectedAddons({
                              ...selectedAddons,
                              [addon.id]: { ...addonState, child: val, selected: val > 0 || addonState.adult > 0 }
                            });
                          }}
                          disabled={!addonState.selected}
                          className="addon-quantity-input"
                        />
                      </div>
                      <div className="addon-total-wrapper">
                        <div className="addon-total">
                          {addonTotal > 0 ? `${addonTotal.toFixed(0)} AED` : '0 AED'}
                        </div>
                        {hasDiscount && discountAmount > 0 && (
                          <div className="addon-discount-price">
                            -{discountAmount.toFixed(0)} AED
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="addon-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={addonState.selected || false}
                      onChange={(e) => {
                        setSelectedAddons({
                          ...selectedAddons,
                          [addon.id]: { 
                            selected: e.target.checked, 
                            adult: e.target.checked ? 1 : 0, 
                            child: 0 
                          }
                        });
                      }}
                      className="addon-checkbox"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Addons;

