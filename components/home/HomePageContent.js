"use client"

import Counter from "@/components/Counter"
import SearchFilter from "@/components/SearchFilter"
import SectionTitle from "@/components/SectionTitle"
import Testimonial from "@/components/slider/Testimonial"
import ReveloLayout from "@/layout/ReveloLayout"
import Link from "next/link"
import destinations from "@/app/Jsons/destinations.json"
import destinations2 from "@/app/Jsons/destinations2.json"
import Gallery from "@/components/slider/Gallery"
import TourSlider from "@/components/slider/TourSlider"
import CategorySlider from "@/components/slider/CategorySlider"
import { useEffect, useState } from "react"

export default function HomePageContent({ initialToursData = {} }) {
  const [toursData, setToursData] = useState(initialToursData)

  useEffect(() => {
    // Fetch all tour sections dynamically
    const fetchAllTours = async () => {
      const pageMappings = {
        'tour-list': { title: 'Desert Safari', link: '/tour-details' },
        'sight-see-list': { title: 'City Tour', link: '/sight-see-Tdetails' },
        'desert-resort-list': { title: 'Desert Resort', link: '/desert-resort-details' },
        'theme-park-list': { title: 'Theme Park', link: '/theme-park-details' },
        'buggy-bike-list': { title: 'Buggy & Quad Bikes', link: '/buggy-bike-details' },
        'private-tour-list': { title: 'Private Tour', link: '/private-tour-details' },
        'executive-tour-list': { title: 'Executive', link: '/executive-tour-details' },
        'combo-deal-list': { title: 'Combo Deals', link: '/combo-deal-details' },
        'water-park-list': { title: 'Water Parks', link: '/water-park-details' },
        'sky-tour-list': { title: 'Sky Tours', link: '/sky-tour-details' },
        'sea-advantucher-list': { title: 'Sea Advantucher', link: '/sea-advantucher-details' },
        'dhow-cruise-list': { title: 'Dhow Cruise', link: '/dhow-cruise-details' },
      }

      const fetchedData = {}
      
      for (const [page, config] of Object.entries(pageMappings)) {
        try {
          const response = await fetch(`/api/packages?page=${page}&limit=8`)
          const data = await response.json()
          const packages = data.packages || []
          
          fetchedData[page] = packages.map((tour) => ({
            ...tour,
            reviews: tour.total_reviews || 0,
            originalPrice: tour.discount_price && tour.base_price ? tour.base_price : null,
            discount: tour.badge ? parseInt(tour.badge.replace('% Off', '').replace('%', '')) : null,
            link: `${config.link}?slug=${tour.slug}`,
          }))
        } catch (error) {
          console.error(`Failed to fetch ${page}:`, error)
          fetchedData[page] = []
        }
      }

      setToursData(fetchedData)
    }

    // Only fetch if initial data is empty
    if (Object.keys(initialToursData).length === 0) {
      fetchAllTours()
    }
  }, [initialToursData])

  return (
    <div>
      <style jsx>{`
        .read-more {
          color: white !important;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .read-more:hover {
          color: #e0e0e0 !important;
          text-decoration: none;
        }

        .read-more i {
          color: inherit;
        }
      `}</style>
      <ReveloLayout header={1}>
        {/* Hero Area Start */}
        <section
          className="hero-area bgc-black rel z-2"
          style={{
            backgroundImage: "url('/assets/images/hero/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Hero content will be here */}
        </section>

        {/* Category Slider */}
        <CategorySlider
          categories={[
            { name: "Desert Safari", link: "tour-list" },
            { name: "City Tour", link: "sight-see-list" },
            { name: "Desert Resort", link: "desert-resort-list" },
            { name: "Theme Park", link: "theme-park-list" },
            { name: "Buggy & Bike", link: "buggy-bike-list" },
            { name: "Private Tour", link: "private-tour-list" },
            { name: "Executive", link: "executive-tour-list" },
            { name: "Combo Deal", link: "combo-deal-list" },
            { name: "Water Park", link: "water-park-list" },
            { name: "Sky Tour", link: "sky-tour-list" },
            { name: "Sea Advantucher", link: "sea-advantucher-list" },
            { name: "Dhow Cruise", link: "dhow-cruise-list" },
          ]}
        />

        {/* Top Tours Section */}
        <TourSlider
          title="Top Tours"
          tours={destinations2.map((tour) => ({
            ...tour,
            reviews: 176,
            originalPrice:
              tour.id === 1
                ? 800
                : tour.id === 2
                ? 900
                : tour.id === 3
                ? 150
                : null,
            discount:
              tour.id === 1
                ? 6
                : tour.id === 2
                ? 11
                : tour.id === 3
                ? 13
                : null,
            link: `/top-tour-details?id=${tour.id}`,
          }))}
        />

        {/* Best Selling Section */}
        <TourSlider
          title="BEST SELLING"
          tours={destinations2.map((tour) => ({
            ...tour,
            reviews: 144,
            originalPrice: null,
            discount: null,
            link: `/top-tour-details?id=${tour.id}`,
          }))}
        />

        {/* Category Sliders - Dynamic */}
        {toursData['tour-list'] && toursData['tour-list'].length > 0 && (
          <TourSlider
            title="Desert Safari"
            tours={toursData['tour-list'].slice(0, 8)}
          />
        )}

        {toursData['sight-see-list'] && toursData['sight-see-list'].length > 0 && (
          <TourSlider
            title="City Tour"
            tours={toursData['sight-see-list'].slice(0, 8)}
          />
        )}

        {toursData['desert-resort-list'] && toursData['desert-resort-list'].length > 0 && (
          <TourSlider
            title="Desert Resort"
            tours={toursData['desert-resort-list'].slice(0, 8)}
          />
        )}

        {toursData['theme-park-list'] && toursData['theme-park-list'].length > 0 && (
          <TourSlider
            title="Theme Park"
            tours={toursData['theme-park-list'].slice(0, 8)}
          />
        )}

        {toursData['buggy-bike-list'] && toursData['buggy-bike-list'].length > 0 && (
          <TourSlider
            title="Buggy & Quad Bikes"
            tours={toursData['buggy-bike-list'].slice(0, 8)}
          />
        )}

        {toursData['private-tour-list'] && toursData['private-tour-list'].length > 0 && (
          <TourSlider
            title="Private Tour"
            tours={toursData['private-tour-list'].slice(0, 8)}
          />
        )}

        {toursData['executive-tour-list'] && toursData['executive-tour-list'].length > 0 && (
          <TourSlider
            title="Executive"
            tours={toursData['executive-tour-list'].slice(0, 8)}
          />
        )}

        {toursData['combo-deal-list'] && toursData['combo-deal-list'].length > 0 && (
          <TourSlider
            title="Combo Deals"
            tours={toursData['combo-deal-list'].slice(0, 8)}
          />
        )}

        {toursData['water-park-list'] && toursData['water-park-list'].length > 0 && (
          <TourSlider
            title="Water Parks"
            tours={toursData['water-park-list'].slice(0, 8)}
          />
        )}

        {toursData['sky-tour-list'] && toursData['sky-tour-list'].length > 0 && (
          <TourSlider
            title="Sky Tours"
            tours={toursData['sky-tour-list'].slice(0, 8)}
          />
        )}

        {toursData['sea-advantucher-list'] && toursData['sea-advantucher-list'].length > 0 && (
          <TourSlider
            title="Sea Advantucher"
            tours={toursData['sea-advantucher-list'].slice(0, 8)}
          />
        )}

        {toursData['dhow-cruise-list'] && toursData['dhow-cruise-list'].length > 0 && (
          <TourSlider
            title="Dhow Cruise"
            tours={toursData['dhow-cruise-list'].slice(0, 8)}
          />
        )}

        {/* Other sections like Counter, Gallery, Testimonial, etc. */}
        <Counter />
        <Gallery />
        <Testimonial />
      </ReveloLayout>
    </div>
  )
}

