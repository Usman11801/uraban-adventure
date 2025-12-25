"use client";

import { useState, useEffect } from "react";

const TourFilterBar = ({ tours, onFilterChange }) => {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sortBy: "default",
  });

  // Get max price for placeholder
  const maxPrice = Math.max(...tours.map((tour) => tour.price || 0));

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
      sortBy: "default",
    });
  };

  return (
    <div className="tour-filter-bar mb-20" style={{ 
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%'
    }}>
      <div style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        gap: '15px',
        background: '#F9F9F7',
        padding: '10px 20px',
        borderRadius: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid #E9E9E9',
        flexWrap: 'wrap'
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="fas fa-dollar-sign" style={{ color: 'var(--primary-color)', fontSize: '12px' }}></i>
        <input
          type="number"
          placeholder="Min"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          min="0"
          max={maxPrice}
          style={{
            width: '80px',
            padding: '6px 10px',
            border: '1px solid #E9E9E9',
            borderRadius: '20px',
            fontSize: '13px',
            transition: 'all 0.3s ease',
            background: '#fff',
            textAlign: 'center'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary-color)';
            e.target.style.boxShadow = '0 0 0 2px rgba(99, 171, 69, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E9E9E9';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="fas fa-dollar-sign" style={{ color: 'var(--primary-color)', fontSize: '12px' }}></i>
        <input
          type="number"
          placeholder="Max"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          min="0"
          max={maxPrice}
          style={{
            width: '80px',
            padding: '6px 10px',
            border: '1px solid #E9E9E9',
            borderRadius: '20px',
            fontSize: '13px',
            transition: 'all 0.3s ease',
            background: '#fff',
            textAlign: 'center'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary-color)';
            e.target.style.boxShadow = '0 0 0 2px rgba(99, 171, 69, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E9E9E9';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="fas fa-sort" style={{ color: 'var(--primary-color)', fontSize: '12px' }}></i>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          style={{
            padding: '6px 30px 6px 12px',
            border: '1px solid #E9E9E9',
            borderRadius: '20px',
            fontSize: '13px',
            background: '#fff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23484848' d='M5 7.5L1.5 4h7z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
            minWidth: '140px'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary-color)';
            e.target.style.boxShadow = '0 0 0 2px rgba(99, 171, 69, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E9E9E9';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="default">Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="theme-btn style-two"
        style={{ 
          padding: '6px 16px', 
          fontSize: '12px',
          fontWeight: '600',
          borderRadius: '20px',
          boxShadow: '0 2px 6px rgba(247, 146, 30, 0.2)',
          transition: 'all 0.3s ease',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 3px 8px rgba(247, 146, 30, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 6px rgba(247, 146, 30, 0.2)';
        }}
      >
        <i className="fas fa-redo" style={{ marginRight: '5px', fontSize: '11px' }}></i>
        <span data-hover="Reset">Reset</span>
      </button>
      </div>
    </div>
  );
};

export default TourFilterBar;

