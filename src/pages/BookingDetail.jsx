// src/pages/BookingDetail.jsx (atau path yang sesuai)

import { useParams, Link, useNavigate } from "react-router-dom";
import bookingData from "../JSON/booking.json"; // Sesuaikan path jika perlu
import PageHeader from "../components/PageHeader"; // Asumsi Anda punya PageHeader
import { FiArrowLeft, FiCalendar, FiUsers, FiMapPin, FiDollarSign, FiCheckCircle, FiClock, FiXCircle, FiInfo } from "react-icons/fi"; // Contoh ikon

export default function BookingDetail() {
  const { id: bookingId } = useParams(); // Mengambil 'id' dari URL
  const navigate = useNavigate();

  // Cari data booking berdasarkan ID
  // Pastikan bookingId dari URL (string) dibandingkan dengan booking.id dari JSON (string)
  const booking = bookingData.find((b) => b.id === bookingId);

  // Fungsi untuk styling status badge (sama seperti di Booking.jsx)
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
        case "Confirmed": return <FiCheckCircle className="mr-2 text-green-500" />;
        case "Pending": return <FiClock className="mr-2 text-yellow-500" />;
        case "Cancelled": return <FiXCircle className="mr-2 text-red-500" />;
        default: return <FiInfo className="mr-2 text-gray-500" />;
    }
  }

  if (!booking) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 text-center">
        <PageHeader title="Booking Not Found" breadcrumb={["Dashboard", "Booking List", "Not Found"]} />
        <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Oops! Booking Not Found</h2>
            <p className="text-gray-500 mb-6">
            We couldn't find the booking details you were looking for.
            </p>
            <Link
            to="/booking"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
            >
            <FiArrowLeft size={20} />
            <span>Back to Booking List</span>
            </Link>
        </div>
      </div>
    );
  }

  // Jika booking ditemukan
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader
        title={`Booking Detail: #${booking.id}`}
        breadcrumb={["Dashboard", "Booking List", `Detail #${booking.id}`]}
      >
        <button
          onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
          className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg shadow hover:shadow-md transition-all duration-200 ease-in-out"
        >
          <FiArrowLeft size={20} />
          <span>Back</span>
        </button>
      </PageHeader>

      <div className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header Detail Booking */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 md:p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-1">
            {booking.customerName}
          </h2>
          <p className="text-sm text-blue-100">Booking ID: {booking.id}</p>
        </div>

        {/* Isi Detail Booking */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Kolom Kiri */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Booking Information
            </h3>
            <div className="space-y-4">
              <DetailItem icon={<FiMapPin />} label="Destination" value={booking.destination} />
              <DetailItem icon={<FiCalendar />} label="Booking Date" value={new Date(booking.date).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric'
              })} />
              <DetailItem icon={<FiUsers />} label="Passengers" value={`${booking.passengers} people`} />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Payment & Status
            </h3>
            <div className="space-y-4">
              <DetailItem icon={<FiDollarSign />} label="Total Price" value={`Rp ${booking.totalPrice.toLocaleString('id-ID')}`} valueClass="text-green-600 font-bold" />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                  {getStatusIcon(booking.status)}
                  Status
                </p>
                <span
                  className={`px-3 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeStyle(booking.status)}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8 border-t border-gray-200 text-right">
        </div>

      </div>
    </div>
  );
}

// Komponen kecil untuk menampilkan item detail
function DetailItem({ icon, label, value, valueClass = "text-gray-800" }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1 flex items-center">
        {icon && <span className="mr-2 text-gray-400">{icon}</span>}
        {label}
      </p>
      <p className={`text-base md:text-lg ${valueClass}`}>{value}</p>
    </div>
  );
}