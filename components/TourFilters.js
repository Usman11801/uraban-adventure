"use client";

import { useState, useEffect } from "react";

const TourFilters = ({ tours, onFilterChange }) => {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    rating: "",
    location: "",
    specialOffers: false,
    sortBy: "default",
  });

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    let filtered = [...tours];

    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter((tour) => tour.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((tour) => tour.price <= Number(filters.maxPrice));
    }

    // Filter by rating
    if (filters.rating) {
      filtered = filtered.filter((tour) => (tour.rating || 0) >= Number(filters.rating));
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter((tour) =>
        (tour.location || "").toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by special offers
    if (filters.specialOffers) {
      filtered = filtered.filter((tour) => tour.badge || tour.discount);
    }

    // Sort
    if (filters.sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    onFilterChange(filtered);
  };

  const resetFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      rating: "",
      location: "",
      specialOffers: false,
      sortBy: "default",
    });
  };

  return (
    <div className="tour-filters">
      <div className="filter-group">
        <label>Min Price</label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          placeholder="0"
        />
      </div>
      <div className="filter-group">
        <label>Max Price</label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          placeholder="1000"
        />
      </div>
      <div className="filter-group">
        <label>Rating</label>
        <select
          value={filters.rating}
          onChange={(e) => handleFilterChange("rating", e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Location</label>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          placeholder="Search location..."
        />
      </div>
      <div className="filter-group">
        <label>
          <input
            type="checkbox"
            checked={filters.specialOffers}
            onChange={(e) => handleFilterChange("specialOffers", e.target.checked)}
          />
          Special Offers Only
        </label>
      </div>
      <div className="filter-group">
        <label>Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
        >
          <option value="default">Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
      <button onClick={resetFilters} className="reset-btn">
        Reset Filters
      </button>
    </div>
  );
};

export default TourFilters;

