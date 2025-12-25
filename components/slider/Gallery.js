"use client";

import { sliderProps } from "@/utility/sliderprops";
import Link from "next/link";
import Slider from "react-slick";
import { useRef, useState } from "react";

const Gallery = ({ images = [] }) => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

  // If no images provided, return null or a placeholder
  if (!images || images.length === 0) {
    return (
      <div style={{ width: '100%', height: '600px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        No images available
      </div>
    );
  }

  // Keep images as provided (this codebase uses paths without leading slash)
  const normalizedImages = images;

  const handleBeforeChange = (oldIndex, newIndex) => {
    setCurrentSlide(newIndex);
  };

  const handleImageLoad = (imageSrc, index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div style={{ width: '100vw', margin: 0, padding: 0, maxWidth: '100%', display: 'block', minHeight: '600px', background: '#000', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
      <Slider 
        {...sliderProps.gallery} 
        className="gallery-slider-active" 
        ref={sliderRef}
        beforeChange={handleBeforeChange}
      >
        {normalizedImages.map((image, index) => (
        <div
          className="gallery-three-item"
          data-aos="fade-up"
          data-aos-duration={1500}
          data-aos-offset={50}
          key={index}
            style={{ width: '100vw', minWidth: '100vw', outline: 'none', display: 'block' }}
        >
          <div className="image" style={{ 
              height: '600px', 
            overflow: 'hidden',
              position: 'relative',
              width: '100vw',
              minWidth: '100vw',
              display: 'block',
              background: '#000'
          }}>
            <img 
              src={image} 
              alt={`Gallery Image ${index + 1}`} 
              style={{ 
                  width: '100vw',
                  minWidth: '100vw',
                  height: '600px',
                objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block'
                }}
                loading="eager"
                onError={(e) => {
                  console.error('Image failed to load:', image);
                  e.target.style.background = '#333';
                }}
                onLoad={(e) => {
                  handleImageLoad(image, index);
                  console.log('Image loaded successfully:', image);
              }} 
            />
          </div>
        </div>
      ))}
    </Slider>
    </div>
  );
};

export default Gallery;
