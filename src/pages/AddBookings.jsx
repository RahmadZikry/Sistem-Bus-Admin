import { useState } from "react";

export default function AddBookings() {

  // Define state for the form fields
  const [formData, setFormData] = useState({
    id: "",
    customerName: "",
    date: "",
    destination: "",
    passengers: "",
    status: "Confirmed", // Default status
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
  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form validation
    if (!formData.customerName || !formData.destination || !formData.date || !formData.passengers || !formData.totalPrice) {
      alert("Please fill out all fields.");
      return;
    }

    
    console.log("New Booking Added", formData);

    
    history.push("/Booking"); 
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Add New Booking</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Booking ID */}
        <div>
          <label className="block text-sm font-semibold" htmlFor="id">
            Booking ID
          </label>
          <input
            type="text"
            name="id"
            id="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Enter Booking ID"
          />
        </div>

        {/* Customer Name */}
        <div>
          <label className="block text-sm font-semibold" htmlFor="customerName">
            Customer Name
          </label>
          <input
            type="text"
            name="customerName"
            id="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Enter Customer Name"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold" htmlFor="date">
            Booking Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-semibold" htmlFor="destination">
            Destination
          </label>
          <input
            type="text"
            name="destination"
            id="destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Enter Destination"
          />
        </div>

        {/* Passengers */}
        <div>
          <label className="block text-sm font-semibold" htmlFor="passengers">
            Number of Passengers
          </label>
          <input
            type="number"
            name="passengers"
            id="passengers"
            value={formData.passengers}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Enter Number of Passengers"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold" htmlFor="status">
            Status
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Total Price */}
        <div>
          <label className="block text-sm font-semibold" htmlFor="totalPrice">
            Total Price (in IDR)
          </label>
          <input
            type="number"
            name="totalPrice"
            id="totalPrice"
            value={formData.totalPrice}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Enter Total Price"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-lg text-xl font-semibold shadow-md transform transition-all duration-300 hover:scale-103 hover:shadow-lg"
          >
            Add Booking
          </button>
        </div>
      </form>
    </div>
  );
}
