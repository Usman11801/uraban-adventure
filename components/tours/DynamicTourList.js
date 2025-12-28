"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Loader from '@/components/Loader'

const ITEMS_PER_PAGE = 10

export default function DynamicTourList({ 
  displayPage, 
  detailPage = '/tour-details',
  pageTitle = 'Tour List'
}) {
  const [tours, setTours] = useState([])
  const [filteredTours, setFilteredTours] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set max timeout - show content after 1 second even if still loading
    const maxTimeoutId = setTimeout(() => {
      setLoading(false)
    }, 1000)

    const fetchTours = async () => {
      try {
        const params = new URLSearchParams()
        if (displayPage) params.set('page', displayPage)
        
        const response = await fetch(`/api/packages?${params}`)
        const data = await response.json()
        const fetchedTours = data.packages || []
        
        setTours(fetchedTours)
        setFilteredTours(fetchedTours)
      } catch (error) {
        console.error('Failed to fetch tours:', error)
      } finally {
        clearTimeout(maxTimeoutId)
        // Minimum 300ms to prevent flicker
        setTimeout(() => {
        setLoading(false)
        }, 300)
      }
    }

    fetchTours()

    return () => {
      clearTimeout(maxTimeoutId)
    }
  }, [displayPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [filteredTours])

  const totalPages = Math.ceil(filteredTours.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentTours = filteredTours.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) {
    return <Loader fullScreen={false} message="Loading tours..." />
  }

  if (tours.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>No tours available</div>
  }

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="row">
            {currentTours.map((tour, index) => {
              const rowIndex = Math.floor(index / 2)
              return (
                <div
                  key={tour.id}
                  className="col-lg-6 col-md-6 col-sm-12 mb-30"
                >
                  <div
                    className="destination-item style-three bgc-lighter"
                    data-aos="fade-up"
                    data-aos-delay={rowIndex * 100}
                    data-aos-duration={1500}
                    data-aos-offset={50}
                    style={{ height: '100%' }}
                  >
                    <div className="image">
                      {tour.badge && <span className="badge">{tour.badge}</span>}
                      <a href="#" className="heart">
                        <i className="fas fa-heart" />
                      </a>
                      <img src={tour.image} alt={tour.title || tour.name} />
                    </div>
                    <div className="content">
                      <div className="destination-header">
                        <span className="location">
                          <i className="fal fa-map-marker-alt" /> {tour.location || 'Dubai'}
                        </span>
                        <div className="ratting">
                          {Array.from({ length: tour.rating || 5 }, (_, i) => (
                            <i key={i} className="fas fa-star" />
                          ))}
                        </div>
                      </div>
                      <h5>
                        <Link href={`${detailPage}?slug=${tour.slug}`}>
                          {tour.title || tour.name}
                        </Link>
                      </h5>
                      <p>{tour.description}</p>
                      <ul className="blog-meta">
                        {tour.duration && (
                          <li>
                            <i className="far fa-clock" /> {tour.duration}
                          </li>
                        )}
                        {tour.guests && (
                          <li>
                            <i className="far fa-user" /> {tour.guests} guest
                          </li>
                        )}
                      </ul>
                      <div className="destination-footer">
                        <span className="price">
                          <span>AED {tour.price}</span>/person
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
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {totalPages > 1 && (
        <ul
          className="pagination pt-15 flex-wrap"
          data-aos="fade-up"
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <span
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <i className="far fa-chevron-left" />
            </span>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <span className="page-link" onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </span>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <span
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <i className="far fa-chevron-right" />
            </span>
          </li>
        </ul>
      )}
    </>
  )
}

