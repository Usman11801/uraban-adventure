import Link from 'next/link'

export default function TourCard({ tour, detailPage = '/tour-details' }) {
  const price = tour.discount_price || tour.base_price || tour.price
  const originalPrice = tour.discount_price ? tour.base_price : null
  const tourName = tour.name || tour.title
  const tourDescription = tour.description || ''
  
  // Ensure image URL is properly formatted
  let imageUrl = tour.image || tour.image1 || '/assets/images/default-tour.jpg';
  
  // If image is a relative path without leading slash, add it
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    imageUrl = '/' + imageUrl;
  }
  
  // If image is empty or null, use default
  if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') {
    imageUrl = '/assets/images/default-tour.jpg';
  }

  return (
    <div
      className="destination-item style-three bgc-lighter"
      style={{ height: "100%" }}
    >
      <div className="image">
        {tour.badge && (
          <span className="badge">{tour.badge}</span>
        )}
        <a href="#" className="heart">
          <i className="fas fa-heart" />
        </a>
        <img 
          src={imageUrl} 
          alt={tourName}
          onError={(e) => {
            // Fallback to default image if image fails to load
            if (e.target.src !== '/assets/images/default-tour.jpg') {
              e.target.src = '/assets/images/default-tour.jpg';
            }
          }}
        />
      </div>
      <div className="content">
        <div className="destination-header">
          <span className="location">
            <i className="fal fa-map-marker-alt" /> {tour.location || 'UAE'}
          </span>
          <div className="ratting">
            {Array.from({ length: tour.rating || 5 }, (_, i) => (
              <i key={i} className="fas fa-star" />
            ))}
          </div>
        </div>
        <h5>
          <Link
            href={`${detailPage}?slug=${tour.slug}`}
          >
            {tourName}
          </Link>
        </h5>
        <p>{tourDescription}</p>
        <ul className="blog-meta">
          {tour.duration && (
            <li>
              <i className="far fa-clock" /> {tour.duration}
            </li>
          )}
          {tour.guests && (
            <li>
              <i className="far fa-user" /> {tour.guests}
            </li>
          )}
        </ul>
        <div className="destination-footer">
          <span className="price">
            {originalPrice && (
              <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '8px' }}>
                AED {parseFloat(originalPrice).toFixed(2)}
              </span>
            )}
            <span>AED {parseFloat(price).toFixed(2)}</span>/person
          </span>
          <Link
            href={`${detailPage}?slug=${tour.slug}`}
            className="theme-btn style-two style-three"
          >
            <span data-hover="Book Now">Book Now</span>
            <i className="fal fa-arrow-right" />
          </Link>
        </div>
      </div>
    </div>
  )
}
