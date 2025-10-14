import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddBookings() {
  const navigate = useNavigate();

  // Define state for the form fields
  const [formData, setFormData] = useState({
    id: "",
    customerName: "",
    date: "",
    destination: "",
    passengers: "",
    status: "Confirmed",
    totalPrice: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit the form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform form validation
    if (!formData.customerName || !formData.destination || !formData.date || !formData.passengers || !formData.totalPrice) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      // Generate unique ID if not provided
      const bookingId = formData.id || generateId();
      
      const newBooking = {
        ...formData,
        id: bookingId,
        passengers: parseInt(formData.passengers),
        totalPrice: parseFloat(formData.totalPrice),
        createdAt: new Date().toISOString()
      };

      // Add booking to JSON
      const success = await addBookingToJSON(newBooking);
      
      if (success) {
        alert("Booking added successfully!");
        console.log("New Booking Added", newBooking);
        navigate("/bookings"); // Redirect to bookings page
      } else {
        alert("Failed to add booking. Please try again.");
      }
    } catch (error) {
      console.error("Error adding booking:", error);
      alert("An error occurred while adding the booking.");
    }
  };

  // Function to add booking to JSON
  const addBookingToJSON = async (bookingData) => {
    try {
      // In a real application, you would make an API call here
      // For now, we'll simulate the process
      
      // Get existing bookings from localStorage or initialize empty array
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      
      // Add new booking
      const updatedBookings = [...existingBookings, bookingData];
      
      // Save to localStorage (simulating JSON file update)
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      
      // In a real app, you would send this to your backend API
      console.log('Booking data to be saved:', bookingData);
      
      return true;
    } catch (error) {
      console.error('Error saving booking:', error);
      return false;
    }
  };

  // Generate unique ID function
  const generateId = () => {
    return 'BKG' + Date.now().toString() + Math.random().toString(36).substr(2, 5).toUpperCase();
  };

  // Auto-generate ID when component mounts
  useState(() => {
    setFormData(prev => ({
      ...prev,
      id: generateId()
    }));
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Booking</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Booking ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="id">
            Booking ID
          </label>
          <input
            type="text"
            name="id"
            id="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Booking ID will be auto-generated"
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">Booking ID is auto-generated</p>
        </div>

        {/* Customer Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="customerName">
            Customer Name *
          </label>
          <input
            type="text"
            name="customerName"
            id="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter Customer Name"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="date">
            Booking Date *
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="destination">
            Destination *
          </label>
          <input
            type="text"
            name="destination"
            id="destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter Destination"
            required
          />
        </div>

        {/* Passengers */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="passengers">
            Number of Passengers *
          </label>
          <input
            type="number"
            name="passengers"
            id="passengers"
            value={formData.passengers}
            onChange={handleChange}
            min="1"
            max="100"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter Number of Passengers"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="status">
            Status
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Total Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="totalPrice">
            Total Price (in IDR) *
          </label>
          <input
            type="number"
            name="totalPrice"
            id="totalPrice"
            value={formData.totalPrice}
            onChange={handleChange}
            min="0"
            step="1000"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter Total Price"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg text-lg font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Booking
          </button>
        </div>
      </form>
    </div>
  );
}