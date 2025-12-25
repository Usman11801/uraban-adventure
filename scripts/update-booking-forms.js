// Script to update all tour detail pages to use the Booking component
// This script identifies and updates inline booking forms

const fs = require("fs");
const path = require("path");

const tourDetailPages = [
  "water-park-details/page.js",
  "private-tour-details/page.js",
  "desert-resort-detail/page.js",
  "theme-park-details/page.js",
  "buggy-bike-details/page.js",
  "sea-advantucher-details/page.js",
  "dhow-cruise-details/page.js",
  "executive-tour-details/page.js",
  "top-tour-details/page.js",
  "combo-deal-details/page.js",
];

console.log("Booking forms update script - kept for reference");

