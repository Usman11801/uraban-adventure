"use client";
import { useState, useEffect } from "react";

const BookingForm = ({ cartItems, grandTotal, onClose, paymentType, onSuccess }) => {
  const [formData, setFormData] = useState({
    gender: "",
    firstName: "",
    lastName: "",
    email: "",
    nationality: "",
    phone: "",
    hotelName: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    // Only lock scroll if modal is actually being displayed
    if (typeof document !== 'undefined') {
      // Store original overflow value
      const originalOverflow = window.getComputedStyle(document.body).overflow;
      // Lock scroll
      document.body.style.overflow = 'hidden';
      
      // Cleanup: restore scroll when modal closes
      return () => {
        document.body.style.overflow = originalOverflow || '';
        // Force restore scroll as safety measure
        if (document.body.style.overflow === 'hidden') {
          document.body.style.overflow = '';
        }
      };
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.gender) newErrors.gender = "Please select gender";
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.nationality.trim()) newErrors.nationality = "Nationality is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.hotelName.trim()) newErrors.hotelName = "Hotel name or pickup location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data
      const bookingData = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        nationality: formData.nationality,
        hotel_name: formData.hotelName,
        gender: formData.gender,
        payment_method: paymentType === "pay_on_arrival" ? "pay_on_arrival" : "stripe",
        payment_status: paymentType === "pay_on_arrival" ? "pending" : "pending",
        booking_status: paymentType === "pay_on_arrival" ? "pending" : "pending",
        total_amount: grandTotal,
        cart_items: cartItems,
      };

      // Create booking
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      // If pay on arrival, show success message
      if (paymentType === "pay_on_arrival") {
        onSuccess({
          type: "pay_on_arrival",
          message: "Booking is confirmed! You will pay on arrival.",
          bookingId: data.booking?.id,
        });
      } else {
        // For Stripe, redirect to checkout URL
        if (data.checkoutUrl) {
        onSuccess({
          type: "stripe",
            bookingId: data.bookings?.[0]?.id,
            checkoutUrl: data.checkoutUrl,
        });
        } else {
          throw new Error("Failed to create payment session. Please try again.");
        }
      }
    } catch (error) {
      alert(error.message || "An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="booking-form-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
      }}
    >
      <div className="booking-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="booking-form-header">
          <h2>Booking Information</h2>
          <button className="booking-form-close" onClick={onClose}>
            <i className="fal fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="booking-form-row">
            <div className="booking-form-group">
              <label>
                He/She <span className="required">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? "error" : ""}
              >
                <option value="">Select</option>
                <option value="he">He</option>
                <option value="she">She</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
          </div>

          <div className="booking-form-row">
            <div className="booking-form-group">
              <label>
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className={errors.firstName ? "error" : ""}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="booking-form-group">
              <label>
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className={errors.lastName ? "error" : ""}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="booking-form-row">
            <div className="booking-form-group">
              <label>
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="booking-form-group">
              <label>
                Nationality <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                placeholder="Enter nationality"
                className={errors.nationality ? "error" : ""}
              />
              {errors.nationality && <span className="error-message">{errors.nationality}</span>}
            </div>
          </div>

          <div className="booking-form-row">
            <div className="booking-form-group">
              <label>
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="booking-form-row">
            <div className="booking-form-group full-width">
              <label>
                Hotel Name / Pickup Location <span className="required">*</span>
              </label>
              <input
                type="text"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
                placeholder="Enter hotel name or pickup location"
                className={errors.hotelName ? "error" : ""}
              />
              {errors.hotelName && <span className="error-message">{errors.hotelName}</span>}
            </div>
          </div>

          <div className="booking-form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit Booking"}
            </button>
          </div>
        </form>

        <style jsx>{`
          .booking-form-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.6) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 10000 !important;
            padding: 20px !important;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .booking-form-container {
            background: #fff;
            border-radius: 15px;
            max-width: 700px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            animation: slideUp 0.3s ease;
            position: relative;
          }

          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .booking-form-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 25px 30px;
            border-bottom: 2px solid var(--border-color);
          }

          .booking-form-header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: var(--heading-color);
          }

          .booking-form-close {
            background: transparent;
            border: none;
            font-size: 24px;
            color: var(--base-color);
            cursor: pointer;
            padding: 5px;
            transition: color 0.3s ease;
          }

          .booking-form-close:hover {
            color: var(--primary-color);
          }

          .booking-form {
            padding: 30px;
          }

          .booking-form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          .booking-form-group {
            display: flex;
            flex-direction: column;
          }

          .booking-form-group.full-width {
            grid-column: 1 / -1;
          }

          .booking-form-group label {
            font-weight: 600;
            color: var(--heading-color);
            margin-bottom: 8px;
            font-size: 14px;
          }

          .required {
            color: #dc3545;
          }

          .booking-form-group input,
          .booking-form-group select {
            padding: 12px 16px;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.3s ease;
            font-family: inherit;
          }

          .booking-form-group input:focus,
          .booking-form-group select:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(99, 171, 69, 0.1);
          }

          .booking-form-group input.error,
          .booking-form-group select.error {
            border-color: #dc3545;
          }

          .error-message {
            color: #dc3545;
            font-size: 12px;
            margin-top: 5px;
          }

          .booking-form-actions {
            display: flex;
            gap: 15px;
            margin-top: 30px;
            padding-top: 25px;
            border-top: 2px solid var(--border-color);
          }

          .btn-cancel,
          .btn-submit {
            flex: 1;
            padding: 14px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid;
          }

          .btn-cancel {
            background: transparent;
            color: var(--base-color);
            border-color: var(--border-color);
          }

          .btn-cancel:hover {
            background: var(--lighter-color);
            border-color: var(--base-color);
          }

          .btn-submit {
            background: var(--primary-color);
            color: #fff;
            border-color: var(--primary-color);
          }

          .btn-submit:hover:not(:disabled) {
            background: #4d8a35;
            border-color: #4d8a35;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(99, 171, 69, 0.3);
          }

          .btn-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          @media (max-width: 768px) {
            .booking-form-row {
              grid-template-columns: 1fr;
            }

            .booking-form-actions {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BookingForm;

