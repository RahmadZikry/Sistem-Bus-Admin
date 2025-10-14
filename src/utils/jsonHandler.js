// utils/jsonHandler.js
const fs = require('fs');
const path = require('path');

const bookingFilePath = path.join(process.cwd(), 'components/JSON/booking.json');

// Read bookings from JSON file
export const readBookings = () => {
  try {
    const data = fs.readFileSync(bookingFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading bookings:', error);
    return [];
  }
};

// Write bookings to JSON file
export const writeBookings = (bookings) => {
  try {
    fs.writeFileSync(bookingFilePath, JSON.stringify(bookings, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing bookings:', error);
    return false;
  }
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};