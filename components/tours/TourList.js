"use client"

import { useState, useEffect } from 'react'
import TourCard from './TourCard'

export default function TourList({ page, section, initialTours = [], detailPage = '/tour-details' }) {
  const [tours, setTours] = useState(initialTours)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    const fetchTours = async () => {
      if (initialTours.length > 0) {
        setTours(initialTours)
        return
      }

      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (page) params.set('page', page)
        if (section) params.set('section', section)

        const response = await fetch(`/api/packages?${params}`)
        const data = await response.json()
        setTours(data.packages || [])
      } catch (error) {
        console.error('Failed to fetch tours:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [page, section, initialTours])

  useEffect(() => {
    setCurrentPage(1)
  }, [tours])

  const totalPages = Math.ceil(tours.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentTours = tours.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading tours...</div>
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
                    data-aos="fade-up"
                    data-aos-delay={rowIndex * 100}
                    data-aos-duration={1500}
                    data-aos-offset={50}
                  >
                    <TourCard tour={tour} detailPage={detailPage} />
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
              <span
                className="page-link"
                onClick={() => handlePageChange(i + 1)}
              >
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

