const fs = require("fs");
const path = require("path");

// List of tour detail pages that still need to be updated
const tourDetailPages = [
  "app/theme-park-details/page.js",
  "app/buggy-bike-details/page.js",
  "app/private-tour-details/page.js",
  "app/sea-advantucher-details/page.js",
  "app/dhow-cruise-details/page.js",
  "app/combo-deal-details/page.js",
  "app/top-tour-details/page.js",
];

function updateTourDetailPage(filePath) {
  try {
    console.log(`Updating ${filePath}...`);
    // Script kept for reference
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

console.log("Booking forms update script - kept for reference");

