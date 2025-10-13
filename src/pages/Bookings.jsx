// src/pages/Booking.jsx (Updated with Icon Button)

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// [PERBAIKAN] Tambahkan FiEye untuk ikon mata
import { FiPlus, FiSearch, FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi"; 
import bookingData from "../JSON/booking.json";
import PageHeader from "../components/PageHeader";

export default function Booking() {
    // Semua logika state, filter, dan pagination Anda sudah bagus, tidak perlu diubah.
    const [filters, setFilters] = useState({
        searchTerm: "",
        selectedStatus: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const _searchTerm = filters.searchTerm.toLowerCase();
    const statusOptions = ["Confirmed", "Pending", "Cancelled"];

    const filteredBookings = bookingData.filter((booking) => {
        const nameMatch = booking.customerName?.toLowerCase().includes(_searchTerm);
        const bookingIDMatch = booking.id?.toString().toLowerCase().includes(_searchTerm);
        const statusMatch = filters.selectedStatus && filters.selectedStatus !== "All"
            ? booking.status === filters.selectedStatus
            : true;
        return (nameMatch || bookingIDMatch) && statusMatch;
    }).sort((a,b) => new Date(b.date) - new Date(a.date)); // Sortir data agar yang terbaru di atas

    useEffect(() => {
        setCurrentPage(1);
    }, [filters.searchTerm, filters.selectedStatus]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case "Confirmed": return "bg-green-100 text-green-800";
            case "Pending": return "bg-yellow-100 text-yellow-800";
            case "Cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Booking Management" breadcrumb={["Dashboard", "Booking List"]}>
                <Link to="/addbookings" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-transform hover:scale-105">
                    <FiPlus size={18} />
                    <span>Add Booking</span>
                </Link>
            </PageHeader>

            {/* Kontainer utama untuk filter dan tabel */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Bagian Filter */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-b border-gray-200">
                    <div>
                        <label htmlFor="searchTerm" className="text-sm font-medium text-gray-700 block mb-1">Search</label>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" id="searchTerm" name="searchTerm" placeholder="By name or booking ID..." value={filters.searchTerm} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="selectedStatus" className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                        <select id="selectedStatus" name="selectedStatus" value={filters.selectedStatus} onChange={handleChange} className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
                            <option value="">All Statuses</option>
                            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                </div>

                {/* Tabel Booking */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Booking ID</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Customer Name</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Total Price</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider">Booking Date</th>
                                <th className="px-6 py-3 font-semibold text-gray-600 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{booking.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{booking.customerName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                        Rp {booking.totalPrice.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(booking.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        {/* [PERBAIKAN UTAMA] Mengganti link teks dengan tombol ikon */}
                                        <Link
                                            to={`/booking/${booking.id}`}
                                            className="p-2 inline-block text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                            title="View Booking Details"
                                        >
                                            <FiEye size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to <span className="font-semibold">{Math.min(indexOfLastItem, filteredBookings.length)}</span> of <span className="font-semibold">{filteredBookings.length}</span> results
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"><FiChevronLeft size={16} /></button>
                            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"><FiChevronRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}