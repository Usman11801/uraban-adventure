"use client";

const ReviewsSection = ({ tour, tourType = "tour" }) => {

  // Get reviews for this specific tour (only approved reviews should be passed)
  const reviews = tour?.reviews || [];
  
  // Calculate average rating from reviews if not provided
  const calculateAverageRating = () => {
    if (tour?.average_rating) return parseFloat(tour.average_rating);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (parseInt(review.rating) || 0), 0);
    return sum / reviews.length;
  };
  
  const averageRating = calculateAverageRating() || 0;
  const totalReviews = tour?.total_reviews || reviews.length;


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
                    <span>{review.date || (review.created_at ? new Date(review.created_at).toLocaleDateString() : '')}</span>
                  </div>
                </div>
                <div className="review-rating">
                  <div className="stars">{renderStars(review.rating)}</div>
                  <span className="rating-text">{review.rating}/5</span>
                </div>
              </div>
              <div className="review-content">
                <p className="review-text">{review.comment}</p>
                {(review.services_rating || review.guides_rating || review.price_rating) && (
                  <div className="review-details">
                    {review.services_rating && (
                      <div className="review-detail-item">
                        <div className="label">Services</div>
                        <div className="stars">{renderStars(review.services_rating)}</div>
                      </div>
                    )}
                    {review.guides_rating && (
                      <div className="review-detail-item">
                        <div className="label">Guides</div>
                        <div className="stars">{renderStars(review.guides_rating)}</div>
                      </div>
                    )}
                    {review.price_rating && (
                      <div className="review-detail-item">
                        <div className="label">Price</div>
                        <div className="stars">{renderStars(review.price_rating)}</div>
                      </div>
                    )}
                  </div>
                )}
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

    </div>
  );
};

export default ReviewsSection;
