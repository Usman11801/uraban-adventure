"use client";
import { useState } from "react";

const ReviewsSection = ({ tour, tourType = "tour" }) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
    services: 5,
    guides: 5,
    price: 5,
  });

  // Get reviews for this specific tour
  const reviews = tour?.reviews || [];
  const averageRating = tour?.averageRating || 4.5;
  const totalReviews = tour?.totalReviews || reviews.length;

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Here you would typically send the review to your backend
    console.log("New review submitted:", newReview);
    alert("Thank you for your review! It will be published after moderation.");
    setShowAddReview(false);
    setNewReview({
      name: "",
      email: "",
      rating: 5,
      comment: "",
      services: 5,
      guides: 5,
      price: 5,
    });
  };

  const renderStars = (rating, size = "sm") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star" />);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i
          key={`empty-${i}`}
          className="fas fa-star"
          style={{ color: "#ddd" }}
        />
      );
    }

    return stars;
  };

  return (
    <div className="tour-reviews-section">
      <style jsx>{`
        .tour-reviews-section {
          margin: 40px 0;
        }

        .reviews-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        .reviews-summary {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .overall-rating {
          text-align: center;
        }

        .rating-number {
          font-size: 48px;
          font-weight: 700;
          color: #e74c3c;
          line-height: 1;
        }

        .rating-stars {
          margin: 10px 0;
        }

        .rating-stars i {
          font-size: 20px;
          color: #ffc107;
          margin: 0 2px;
        }

        .total-reviews {
          color: #666;
          font-size: 14px;
        }

        .add-review-btn {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-review-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
        }

        .reviews-list {
          margin-bottom: 40px;
        }

        .review-item {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 20px;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
          border: 1px solid #f0f0f0;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .review-author {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 18px;
        }

        .author-info h6 {
          margin: 0;
          font-weight: 600;
          color: #2c3e50;
        }

        .author-info span {
          color: #666;
          font-size: 14px;
        }

        .review-rating {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .review-rating .stars {
          color: #ffc107;
        }

        .review-rating .rating-text {
          font-weight: 600;
          color: #2c3e50;
        }

        .review-content {
          margin-top: 15px;
        }

        .review-text {
          color: #555;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .review-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .review-detail-item {
          text-align: center;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .review-detail-item .label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }

        .review-detail-item .stars {
          color: #ffc107;
          font-size: 14px;
        }

        .add-review-form {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #f0f0f0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e1e8ed;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #e74c3c;
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        }

        .rating-inputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .rating-input {
          text-align: center;
        }

        .rating-input label {
          font-size: 14px;
          margin-bottom: 5px;
        }

        .rating-input select {
          width: 100%;
          padding: 8px 12px;
          border: 2px solid #e1e8ed;
          border-radius: 6px;
          font-size: 14px;
        }

        .submit-btn {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
        }

        .no-reviews {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        @media (max-width: 768px) {
          .reviews-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .reviews-summary {
            flex-direction: column;
            gap: 15px;
          }

          .review-header {
            flex-direction: column;
            gap: 15px;
          }

          .review-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Reviews Header */}
      <div className="reviews-header">
        <div className="reviews-summary">
          <div className="overall-rating">
            <div className="rating-number">{averageRating}</div>
            <div className="rating-stars">{renderStars(averageRating)}</div>
            <div className="total-reviews">{totalReviews} Reviews</div>
          </div>
        </div>
        <button
          className="add-review-btn"
          onClick={() => setShowAddReview(!showAddReview)}
        >
          {showAddReview ? "Cancel" : "Add Review"}
        </button>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-header">
                <div className="review-author">
                  <div className="author-avatar">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="author-info">
                    <h6>{review.name}</h6>
                    <span>{review.date}</span>
                  </div>
                </div>
                <div className="review-rating">
                  <div className="stars">{renderStars(review.rating)}</div>
                  <span className="rating-text">{review.rating}/5</span>
                </div>
              </div>
              <div className="review-content">
                <p className="review-text">{review.comment}</p>
                <div className="review-details">
                  <div className="review-detail-item">
                    <div className="label">Services</div>
                    <div className="stars">{renderStars(review.services)}</div>
                  </div>
                  <div className="review-detail-item">
                    <div className="label">Guides</div>
                    <div className="stars">{renderStars(review.guides)}</div>
                  </div>
                  <div className="review-detail-item">
                    <div className="label">Price</div>
                    <div className="stars">{renderStars(review.price)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <h5>No reviews yet</h5>
            <p>Be the first to review this {tourType}!</p>
          </div>
        )}
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <div className="add-review-form">
          <h4>Add Your Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview({ ...newReview, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                value={newReview.email}
                onChange={(e) =>
                  setNewReview({ ...newReview, email: e.target.value })
                }
                required
              />
            </div>

            <div className="rating-inputs">
              <div className="rating-input">
                <label>Overall Rating</label>
                <select
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      rating: parseFloat(e.target.value),
                    })
                  }
                >
                  <option value={5}>5 Stars</option>
                  <option value={4.5}>4.5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3.5}>3.5 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2.5}>2.5 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1.5}>1.5 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div className="rating-input">
                <label>Services</label>
                <select
                  value={newReview.services}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      services: parseFloat(e.target.value),
                    })
                  }
                >
                  <option value={5}>5 Stars</option>
                  <option value={4.5}>4.5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3.5}>3.5 Stars</option>
                  <option value={3}>3 Stars</option>
                </select>
              </div>

              <div className="rating-input">
                <label>Guides</label>
                <select
                  value={newReview.guides}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      guides: parseFloat(e.target.value),
                    })
                  }
                >
                  <option value={5}>5 Stars</option>
                  <option value={4.5}>4.5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3.5}>3.5 Stars</option>
                  <option value={3}>3 Stars</option>
                </select>
              </div>

              <div className="rating-input">
                <label>Price</label>
                <select
                  value={newReview.price}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      price: parseFloat(e.target.value),
                    })
                  }
                >
                  <option value={5}>5 Stars</option>
                  <option value={4.5}>4.5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3.5}>3.5 Stars</option>
                  <option value={3}>3 Stars</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Your Review *</label>
              <textarea
                id="comment"
                rows={5}
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                placeholder="Share your experience with this tour..."
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
