"use client";
import { useEffect, useRef } from "react";

const TawkToWidget = () => {
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    // Prevent loading on admin pages
    if (window.location.pathname.startsWith("/admin")) {
      return;
    }

    // Prevent multiple script loads
    if (scriptLoadedRef.current) {
      return;
    }

    // Get tawk.to configuration from environment variables
    const propertyId = process.env.NEXT_PUBLIC_TAWK_TO_PROPERTY_ID;
    const widgetId = process.env.NEXT_PUBLIC_TAWK_TO_WIDGET_ID;
    const apiKey = process.env.NEXT_PUBLIC_TAWK_TO_API_KEY;

    // Only load if we have the required IDs
    if (!propertyId || !widgetId) {
      console.warn(
        "Tawk.to widget not loaded: Missing Property ID or Widget ID in environment variables"
      );
      return;
    }

    // Check if script is already loaded to prevent duplicates
    // Check if script tag already exists or if Tawk_API is already initialized
    const existingScript = document.querySelector(`script[src*="embed.tawk.to/${propertyId}"]`);
    if (existingScript || (window.Tawk_API && window.Tawk_API.visitor)) {
      scriptLoadedRef.current = true;
      return;
    }

    // Mark as loading to prevent duplicate loads
    scriptLoadedRef.current = true;

    // Initialize Tawk_API object and Tawk_LoadStart (matches official tawk.to pattern)
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Set JavaScript API Key if provided (for advanced features)
    if (apiKey) {
      window.Tawk_API.key = apiKey;
    }

    // Create and configure the tawk.to script
    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    // Safe script insertion - handle case where no script tags exist
    const s0 = document.getElementsByTagName("script")[0];
    if (s0 && s0.parentNode) {
      // Insert before first script tag (official tawk.to pattern)
      s0.parentNode.insertBefore(s1, s0);
    } else {
      // Fallback: append to head if no script tags exist
      document.head.appendChild(s1);
    }

    // Optional: Configure widget behavior
    // You can customize these settings based on your needs
    // window.Tawk_API.onLoad = function() {
    //   console.log("Tawk.to widget loaded");
    // };
    // window.Tawk_API.onChatStarted = function() {
    //   console.log("Chat started");
    // };

    // Cleanup function (optional, but good practice)
    return () => {
      // Only cleanup if component unmounts (shouldn't happen often)
      const scriptToRemove = document.querySelector(
        `script[src*="embed.tawk.to/${propertyId}"]`
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
        scriptLoadedRef.current = false;
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // This component doesn't render anything visible
  // The tawk.to script handles the widget rendering
  return null;
};

export default TawkToWidget;

